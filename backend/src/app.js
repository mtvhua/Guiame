'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { config } = require('./config');
const { query } = require('./db/pool');
const log = require('./log');

function crearApp() {
  const app = express();
  // Cloud Run (y el balanceador) ponen la IP real en X-Forwarded-For. Se confía solo en N saltos,
  // nunca en "true": así nadie puede falsificar su IP para saltarse el límite de intentos.
  app.set('trust proxy', config.trustProxyHops);
  app.disable('x-powered-by');
  app.use(helmet());
  if (config.corsOrigins.length) app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: '20kb' }));

  // Salud (el balanceador enruta /health* a este servicio)
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.get('/health/db', async (req, res) => {
    try {
      await query('SELECT 1');
      res.json({ status: 'ok', db: 'ok' });
    } catch (e) {
      log.error('Falló /health/db', { codigo: e.code });
      res.status(503).json({ status: 'error', db: 'error' });
    }
  });

  // Todo lo demás vive bajo /api (el balanceador enruta /api/* a este servicio)
  const api = express.Router();
  api.use('/auth', require('./routes/auth'));
  api.use('/usuarios', require('./routes/usuarios'));
  api.use('/examenes', require('./routes/examenes'));
  api.use('/media', require('./routes/media'));
  app.use('/api', api);

  app.use((req, res) => res.status(404).json({ error: 'no_encontrado' }));

  // Express 5 reenvía aquí también los errores de rutas async
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large') {
      return res.status(400).json({ error: 'solicitud_invalida' });
    }
    log.error('Error no controlado', { ruta: req.path, tipo: err.name, codigo: err.code });
    res.status(500).json({ error: 'error_interno' });
  });

  return app;
}

module.exports = { crearApp };
