-- Guíame: lo que la API necesita ADEMÁS de tu esquema (schema.sql).
-- Ejecutar en Cloud SQL Studio como usuario "postgres" (dueño de las tablas), NO como "app".
-- Es seguro correrlo varias veces: no borra ni cambia tus tablas ni tus datos.

-- Sesiones: la API guarda solo el hash (SHA-256) de cada refresh token, para poder revocarlo al cerrar sesión.
CREATE TABLE IF NOT EXISTS refresh_token (
  id_refresh   SERIAL       PRIMARY KEY,
  id_usuario   INT          NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  token_hash   TEXT         NOT NULL UNIQUE,
  expira_en    TIMESTAMPTZ  NOT NULL,
  revocado     BOOLEAN      NOT NULL DEFAULT FALSE,
  creado_en    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_refresh_token_usuario ON refresh_token (id_usuario);

-- La API se conecta como "app": solo puede leer y escribir filas, no cambiar la estructura.
-- Las tablas con SERIAL también necesitan permiso sobre sus secuencias, o los INSERT fallan.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app;
