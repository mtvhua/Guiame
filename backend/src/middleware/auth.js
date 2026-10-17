'use strict';

const jwt = require('jsonwebtoken');
const { config } = require('../config');

function leerToken(req) {
  const header = req.get('authorization') || '';
  const [tipo, token] = header.split(' ');
  return tipo === 'Bearer' && token ? token : null;
}

function verificar(token) {
  return jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'], issuer: 'guiame-api' });
}

/** Exige sesión: responde 401 si no hay token o venció (la app entonces llama a /auth/refresh). */
function requerirSesion(req, res, next) {
  const token = leerToken(req);
  if (!token) return res.status(401).json({ error: 'no_autenticada' });
  try {
    req.usuarioId = verificar(token).sub;
    next();
  } catch (e) {
    res.status(401).json({ error: 'token_invalido' });
  }
}

/** Sesión opcional: sin token sigue como invitada; con token inválido responde 401. */
function sesionOpcional(req, res, next) {
  const token = leerToken(req);
  if (!token) return next();
  try {
    req.usuarioId = verificar(token).sub;
    next();
  } catch (e) {
    res.status(401).json({ error: 'token_invalido' });
  }
}

module.exports = { requerirSesion, sesionOpcional };
