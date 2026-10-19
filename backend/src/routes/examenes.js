'use strict';

const express = require('express');
const { getPool, query } = require('../db/pool');
const { config } = require('../config');
const { requerirSesion, sesionOpcional } = require('../middleware/auth');
const vertex = require('../services/vertex');
const { EDAD_SQL } = require('../services/edad');

const router = express.Router();

const PASOS = [1, 2, 3, 4, 5, 6, 7];
const VALORES = new Set(['no', 'si', 'no_segura']);

/** Valida que vengan exactamente los 7 pasos, sin repetir y con valores permitidos. */
function validarRespuestas(lista) {
  if (!Array.isArray(lista) || lista.length !== PASOS.length) return null;
  const porPaso = new Map();
  for (const r of lista) {
    if (!r || !PASOS.includes(r.paso) || !VALORES.has(r.respuesta) || porPaso.has(r.paso)) return null;
    porPaso.set(r.paso, r.respuesta);
  }
  return PASOS.map((paso) => ({ paso, respuesta: porPaso.get(paso) }));
}

// Con sesión: guarda. Sin sesión (invitada): solo devuelve el reporte.
router.post('/', sesionOpcional, async (req, res) => {
  const respuestas = validarRespuestas(req.body?.respuestas);
  if (!respuestas) return res.status(400).json({ error: 'respuestas_invalidas' });
  const tieneAlertas = respuestas.some((r) => r.respuesta !== 'no');

  let nombre = null;
  let edad = null;
  if (req.usuarioId) {
    const { rows } = await query(`SELECT nombre, ${EDAD_SQL} FROM usuario WHERE id_usuario = $1`, [req.usuarioId]);
    if (!rows[0]) return res.status(401).json({ error: 'token_invalido' });
    ({ nombre, edad } = rows[0]);
  }

  const reporte = await vertex.generarReporte({ nombre, edad, respuestas, tieneAlertas });

  if (!req.usuarioId) {
    return res.json({ id: null, fecha: new Date().toISOString(), reporte, tieneAlertas, guardado: false });
  }

  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO autoexamen (id_usuario, estado, nivel_alerta, recomendacion, ver_modelo_ia)
       VALUES ($1, 'completado', $2, $3, $4)
       RETURNING id_autoexamen::text AS id, ultima_fecha AS fecha`,
      [req.usuarioId, tieneAlertas ? 'consultar' : 'sin_hallazgos', reporte, config.vertex.model]
    );
    const examen = rows[0];
    // Cada respuesta se enlaza con su pregunta (tabla pregunta) por el número de paso
    const guardadas = await client.query(
      `INSERT INTO respuesta (id_autoexamen, id_pregunta, valor)
       SELECT $1, p.id_pregunta, t.valor
         FROM unnest($2::int[], $3::text[]) AS t(paso, valor)
         JOIN pregunta p ON p.paso = t.paso`,
      [examen.id, respuestas.map((r) => r.paso), respuestas.map((r) => r.respuesta)]
    );
    if (guardadas.rowCount !== PASOS.length) {
      throw new Error('La tabla pregunta no tiene los 7 pasos: ejecuta los datos iniciales de schema.sql');
    }
    await client.query('COMMIT');
    res.json({ id: examen.id, fecha: examen.fecha.toISOString(), reporte, tieneAlertas, guardado: true });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
});

router.get('/', requerirSesion, async (req, res) => {
  const { rows } = await query(
    `SELECT id_autoexamen::text AS id, ultima_fecha AS fecha, recomendacion AS reporte,
            (nivel_alerta = 'consultar') AS "tieneAlertas"
       FROM autoexamen
      WHERE id_usuario = $1 AND estado = 'completado'
      ORDER BY ultima_fecha DESC LIMIT 100`,
    [req.usuarioId]
  );
  res.json(rows.map((r) => ({ ...r, fecha: r.fecha.toISOString() })));
});

module.exports = router;
