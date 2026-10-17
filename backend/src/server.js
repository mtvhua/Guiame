'use strict';

const { config, validar } = require('./config');
const { crearApp } = require('./app');
const { getPool } = require('./db/pool');
const log = require('./log');

validar();

const server = crearApp().listen(config.port, () => log.info(`guiame-api escuchando en el puerto ${config.port}`));

// Cloud Run envía SIGTERM antes de apagar la instancia: terminar peticiones y cerrar el pool
process.on('SIGTERM', () => {
  log.info('SIGTERM recibido, cerrando');
  server.close(async () => {
    await getPool().end().catch(() => {});
    process.exit(0);
  });
});
