'use strict';

const { Pool } = require('pg');
const { config } = require('../config');

let pool;

/** Un solo pool por instancia de Cloud Run (max pequeño: la instancia db-f1-micro tiene pocas conexiones). */
function getPool() {
  if (!pool) {
    pool = new Pool(config.db);
    pool.on('error', (err) => console.error(JSON.stringify({ severity: 'ERROR', message: 'Error en el pool de PostgreSQL', code: err.code })));
  }
  return pool;
}

const query = (text, params) => getPool().query(text, params);

module.exports = { getPool, query };
