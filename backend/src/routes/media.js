'use strict';

const express = require('express');
const { Storage } = require('@google-cloud/storage');
const { config } = require('../config');

const router = express.Router();
const storage = new Storage();

// Solo se sirven las carpetas del autoexamen e información, con nombres simples (sin "..", ni subcarpetas extra)
const RUTA_VALIDA = /^(pasos|info)\/[a-z0-9_-]+\.(gif|jpg|jpeg|png|webp|mp4|mp3)$/;

/**
 * GET /api/media/pasos/paso1.gif -> 302 a una URL firmada de corta duración.
 * El bucket es privado (acceso público bloqueado): la app nunca recibe credenciales,
 * solo un enlace que caduca. Requiere que guiame-backend tenga el rol
 * "Service Account Token Creator" sobre sí misma para poder firmar sin llave JSON.
 */
router.get(/^\/(.+)$/, async (req, res) => {
  const ruta = req.params[0];
  if (!RUTA_VALIDA.test(ruta)) return res.status(404).json({ error: 'no_encontrado' });

  const archivo = storage.bucket(config.mediaBucket).file(ruta);
  const [existe] = await archivo.exists();
  if (!existe) return res.status(404).json({ error: 'no_encontrado' });

  const [url] = await archivo.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + config.signedUrlMinutes * 60 * 1000
  });
  res.set('Cache-Control', 'private, max-age=60');
  res.redirect(302, url);
});

module.exports = router;
