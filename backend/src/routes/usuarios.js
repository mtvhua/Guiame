'use strict';

const express = require('express');
const { query } = require('../db/pool');
const { requerirSesion } = require('../middleware/auth');
const { EDAD_SQL } = require('../services/edad');

const router = express.Router();

router.get('/me', requerirSesion, async (req, res) => {
  const { rows } = await query(
    `SELECT id_usuario::text AS id, nombre, correo AS email, ${EDAD_SQL} FROM usuario WHERE id_usuario = $1`,
    [req.usuarioId]
  );
  if (!rows[0]) return res.status(401).json({ error: 'token_invalido' });
  res.json(rows[0]);
});

module.exports = router;
