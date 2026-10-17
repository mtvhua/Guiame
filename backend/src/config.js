'use strict';

const env = process.env;

const config = {
  port: Number(env.PORT) || 8080,

  db: {
    user: env.DB_USER || 'app',
    database: env.DB_NAME || 'guiame',
    password: env.DB_PASS,
    // En Cloud Run (--add-cloudsql-instances) se conecta por socket unix.
    // En local (Cloud SQL Auth Proxy) se conecta por TCP con DB_HOST.
    host: env.DB_HOST || (env.INSTANCE_CONNECTION_NAME ? `/cloudsql/${env.INSTANCE_CONNECTION_NAME}` : '127.0.0.1'),
    port: Number(env.DB_PORT) || 5432,
    max: Number(env.DB_POOL_MAX) || 5
  },

  jwt: {
    secret: env.JWT_SECRET,
    accessTtl: env.JWT_ACCESS_TTL || '30m',
    refreshDays: Number(env.REFRESH_DAYS) || 30
  },

  mediaBucket: env.MEDIA_BUCKET || 'guiameapp-media',
  signedUrlMinutes: Number(env.SIGNED_URL_MINUTES) || 10,

  vertex: {
    project: env.GCP_PROJECT || env.GOOGLE_CLOUD_PROJECT,
    location: env.VERTEX_LOCATION || 'us-east1',
    model: env.GEMINI_MODEL || 'gemini-2.5-flash',
    timeoutMs: Number(env.VERTEX_TIMEOUT_MS) || 30000
  },

  // Cuántos proxies hay delante de la API para leer la IP real: 1 = Cloud Run directo; con balanceador suele ser 2
  trustProxyHops: Number(env.TRUST_PROXY_HOPS) || 1,

  corsOrigins: (env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
};

/** Falla al iniciar si falta algo imprescindible, en vez de fallar a media petición. */
function validar() {
  if (!config.jwt.secret || config.jwt.secret.length < 32) {
    throw new Error('JWT_SECRET falta o es demasiado corto (mínimo 32 caracteres). Revisa el secreto jwt-secret.');
  }
  if (!config.db.password) {
    throw new Error('DB_PASS no está definida. Revisa el secreto db-password.');
  }
}

module.exports = { config, validar };
