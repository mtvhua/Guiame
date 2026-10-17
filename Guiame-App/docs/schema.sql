-- Guíame: esquema de Cloud SQL (PostgreSQL 15+)
-- Lo comparten la API (Cloud Run) y el portal web. Ejecutar en Cloud SQL Studio con el usuario "app".
-- Es idempotente: se puede correr más de una vez.

CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid() (en PG13+ ya viene incluida)

CREATE TABLE IF NOT EXISTS usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(100) NOT NULL,
    edad            SMALLINT CHECK (edad BETWEEN 10 AND 110),
    email           VARCHAR(255) NOT NULL,
    password_hash   TEXT NOT NULL,                 -- bcrypt, nunca texto plano
    idioma          VARCHAR(5) NOT NULL DEFAULT 'es' CHECK (idioma IN ('es', 'quc')),
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);
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
