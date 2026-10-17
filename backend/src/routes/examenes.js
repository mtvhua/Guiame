'use strict';

const express = require('express');
const { getPool, query } = require('../db/pool');
const { requerirSesion, sesionOpcional } = require('../middleware/auth');
const vertex = require('../services/vertex');

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
  const idioma = req.body?.idioma === 'quc' ? 'quc' : 'es';
  const tieneAlertas = respuestas.some((r) => r.respuesta !== 'no');

  let nombre = null;
  let edad = null;
  if (req.usuarioId) {
    const { rows } = await query('SELECT nombre, edad FROM usuarios WHERE id = $1', [req.usuarioId]);
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
      `INSERT INTO autoexamenes (usuario_id, tiene_alertas, reporte, idioma)
       VALUES ($1, $2, $3, $4) RETURNING id, fecha`,
      [req.usuarioId, tieneAlertas, reporte, idioma]
    );
    const examen = rows[0];
    await client.query(
      `INSERT INTO respuestas (autoexamen_id, paso, respuesta)
       SELECT $1, paso, respuesta FROM unnest($2::smallint[], $3::text[]) AS t(paso, respuesta)`,
      [examen.id, respuestas.map((r) => r.paso), respuestas.map((r) => r.respuesta)]
    );
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
    `SELECT id, fecha, reporte, tiene_alertas AS "tieneAlertas"
       FROM autoexamenes WHERE usuario_id = $1 ORDER BY fecha DESC LIMIT 100`,
    [req.usuarioId]
  );
  res.json(rows.map((r) => ({ ...r, fecha: r.fecha.toISOString() })));
});

module.exports = router;
