'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { query } = require('../db/pool');
const tokens = require('../services/tokens');
const { EDAD_SQL, validarFechaNacimiento } = require('../services/edad');

const router = express.Router();

// Frena la fuerza bruta de contraseñas con dos límites:
//  1) por IP (general, para registro/login/refresh);
//  2) por correo (solo intentos fallidos de login): no depende de cómo llegue la IP detrás del balanceador.
const ventana = 15 * 60 * 1000;
const respuesta429 = { error: 'demasiados_intentos' };

router.use(rateLimit({
  windowMs: ventana,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  message: respuesta429
}));

const limitarLoginPorCorreo = rateLimit({
  windowMs: ventana,
  limit: 10,
  skipSuccessfulRequests: true,   // solo cuentan los intentos que fallan
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `correo:${String(req.body?.email || '').trim().toLowerCase()}`,
  message: respuesta429
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Hash de relleno para que login tarde igual exista o no el correo (no revelar qué correos están registrados)
const HASH_FALSO = bcrypt.hashSync('relleno-para-igualar-tiempos', 10);

const usuarioPublico = (u) => ({ id: u.id, nombre: u.nombre, email: u.email, edad: u.edad });

async function respuestaDeSesion(usuario) {
  return {
    accessToken: tokens.crearAccessToken(usuario.id),
    refreshToken: await tokens.crearRefreshToken(usuario.id),
    usuario: usuarioPublico(usuario)
  };
}

const texto = (v) => (typeof v === 'string' ? v.trim() : '');

router.post('/register', async (req, res) => {
  const nombre = texto(req.body?.nombre);
  const email = texto(req.body?.email).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const fechaNacimiento = validarFechaNacimiento(req.body?.fechaNacimiento);

  if (!nombre || nombre.length > 100) return res.status(400).json({ error: 'nombre_invalido' });
  if (!EMAIL_RE.test(email) || email.length > 255) return res.status(400).json({ error: 'correo_invalido' });
  if (!fechaNacimiento) return res.status(400).json({ error: 'fecha_nacimiento_invalida' });
  // bcrypt solo usa los primeros 72 bytes: se limita para no aceptar contraseñas que no se verifican completas
  if (password.length < 8 || Buffer.byteLength(password) > 72) return res.status(400).json({ error: 'contrasena_invalida' });

  const hash = await bcrypt.hash(password, 11);
  try {
    const { rows } = await query(
      `INSERT INTO usuarios (nombre, fecha_nacimiento, email, password_hash)
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, ${EDAD_SQL}`,
      [nombre, fechaNacimiento, email, hash]
    );
    res.status(201).json(await respuestaDeSesion(rows[0]));
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'correo_en_uso' });
    throw e;
  }
});

router.post('/login', limitarLoginPorCorreo, async (req, res) => {
  const email = texto(req.body?.email).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!email || !password) return res.status(400).json({ error: 'campos_incompletos' });

  const { rows } = await query(
    `SELECT id, nombre, email, ${EDAD_SQL}, password_hash FROM usuarios WHERE lower(email) = $1`,
    [email]
  );
  const usuario = rows[0];
  const ok = await bcrypt.compare(password, usuario ? usuario.password_hash : HASH_FALSO);
  if (!usuario || !ok) return res.status(401).json({ error: 'credenciales_invalidas' });

  res.json(await respuestaDeSesion(usuario));
});

router.post('/refresh', async (req, res) => {
  const refreshToken = texto(req.body?.refreshToken);
  if (!refreshToken) return res.status(400).json({ error: 'campos_incompletos' });

  const usuarioId = await tokens.consumirRefreshToken(refreshToken);
  if (!usuarioId) return res.status(401).json({ error: 'refresh_invalido' });

  const { rows } = await query(`SELECT id, nombre, email, ${EDAD_SQL} FROM usuarios WHERE id = $1`, [usuarioId]);
  if (!rows[0]) return res.status(401).json({ error: 'refresh_invalido' });
  res.json(await respuestaDeSesion(rows[0]));
});

router.post('/logout', async (req, res) => {
  const refreshToken = texto(req.body?.refreshToken);
  if (refreshToken) await tokens.revocarRefreshToken(refreshToken);
  res.status(204).end();
});

module.exports = router;
