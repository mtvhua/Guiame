-- Guíame: esquema de Cloud SQL (PostgreSQL 13 o superior; gen_random_uuid() ya viene incluida)
-- Lo comparten la API (Cloud Run) y el portal web.
-- Ejecutar en Cloud SQL Studio con el usuario "postgres" (dueño de la base), NO con "app":
-- desde PostgreSQL 15 un usuario normal no puede crear tablas en el esquema public.
-- Al final se le dan a "app" solo los permisos de datos (leer/escribir), no de cambiar la estructura.
-- Es idempotente: se puede correr más de una vez.

CREATE TABLE IF NOT EXISTS usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,                         -- la edad se calcula a partir de esta fecha
    email           VARCHAR(255) NOT NULL,
    password_hash   TEXT NOT NULL,                 -- bcrypt, nunca texto plano
    idioma          VARCHAR(5) NOT NULL DEFAULT 'es' CHECK (idioma IN ('es', 'quc')),
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Bases creadas con la versión anterior (que tenía "edad"): agrega la columna nueva
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE;
-- El correo es único sin importar mayúsculas
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (lower(email));

-- Refresh tokens: se guarda solo el hash (SHA-256) para poder revocarlos
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL UNIQUE,
    expira_en       TIMESTAMPTZ NOT NULL,
    revocado        BOOLEAN NOT NULL DEFAULT false,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_refresh_usuario ON refresh_tokens (usuario_id);

CREATE TABLE IF NOT EXISTS autoexamenes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha           TIMESTAMPTZ NOT NULL DEFAULT now(),
    tiene_alertas   BOOLEAN NOT NULL,
    reporte         TEXT,                          -- generado con Vertex AI (puede ser NULL si la IA falló)
    idioma          VARCHAR(5) NOT NULL DEFAULT 'es'
);
CREATE INDEX IF NOT EXISTS idx_autoexamenes_usuario_fecha ON autoexamenes (usuario_id, fecha DESC);

CREATE TABLE IF NOT EXISTS respuestas (
    autoexamen_id   UUID NOT NULL REFERENCES autoexamenes(id) ON DELETE CASCADE,
    paso            SMALLINT NOT NULL CHECK (paso BETWEEN 1 AND 7),
    respuesta       VARCHAR(10) NOT NULL CHECK (respuesta IN ('no', 'si', 'no_segura')),
    PRIMARY KEY (autoexamen_id, paso)
);

-- La API se conecta como "app": solo necesita leer y escribir filas
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app;
