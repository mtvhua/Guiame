'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const { query } = require('../db/pool');

const sha256 = (texto) => crypto.createHash('sha256').update(texto).digest('hex');

function crearAccessToken(usuarioId) {
  return jwt.sign({}, config.jwt.secret, {
    algorithm: 'HS256',
    issuer: 'guiame-api',
    subject: String(usuarioId),
    expiresIn: config.jwt.accessTtl
  });
}

/** Crea un refresh token aleatorio; en la base solo se guarda su hash. */
async function crearRefreshToken(usuarioId) {
  const token = crypto.randomBytes(48).toString('hex');
  const expira = new Date(Date.now() + config.jwt.refreshDays * 24 * 60 * 60 * 1000);
  await query(
    'INSERT INTO refresh_token (id_usuario, token_hash, expira_en) VALUES ($1, $2, $3)',
    [usuarioId, sha256(token), expira]
  );
  return token;
}

/**
 * Rotación: el refresh token usado se revoca de forma atómica y se entrega uno nuevo.
 * Devuelve el id de la usuaria o null si el token no existe, venció o ya se usó.
 */
async function consumirRefreshToken(token) {
  const { rows } = await query(
    `UPDATE refresh_token SET revocado = true
      WHERE token_hash = $1 AND revocado = false AND expira_en > now()
      RETURNING id_usuario`,
    [sha256(token)]
  );
  return rows[0] ? rows[0].id_usuario : null;
}

async function revocarRefreshToken(token) {
  await query('UPDATE refresh_token SET revocado = true WHERE token_hash = $1', [sha256(token)]);
}

module.exports = { crearAccessToken, crearRefreshToken, consumirRefreshToken, revocarRefreshToken };
