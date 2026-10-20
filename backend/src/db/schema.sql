-- =====================================================================
-- Guíame · Esquema PostgreSQL (versión Cloud Computing · Cloud SQL)
-- Ejecutar como el usuario "postgres" (dueño de las tablas), NO como "app".
-- Borra las tablas y las vuelve a crear: al volver a ejecutarlo se pierden los datos.
-- =====================================================================

DROP TABLE IF EXISTS refresh_token       CASCADE;
DROP TABLE IF EXISTS respuesta           CASCADE;
DROP TABLE IF EXISTS autoexamen          CASCADE;
DROP TABLE IF EXISTS recurso_multimedia  CASCADE;
DROP TABLE IF EXISTS texto_pregunta      CASCADE;
DROP TABLE IF EXISTS pregunta            CASCADE;
DROP TABLE IF EXISTS notificacion        CASCADE;
DROP TABLE IF EXISTS perfil              CASCADE;
DROP TABLE IF EXISTS usuario             CASCADE;
DROP TABLE IF EXISTS idioma              CASCADE;

CREATE TABLE idioma (
  id_idioma      SERIAL       PRIMARY KEY,
  codigo         VARCHAR(5)   NOT NULL UNIQUE,    -- 'es', 'eng'
  nombre         VARCHAR(50)  NOT NULL,
  estado_idioma  SMALLINT     NOT NULL DEFAULT 1  -- 1 activo, 0 inactivo
);

CREATE TABLE usuario (
  id_usuario        SERIAL        PRIMARY KEY,
  id_idioma         INT           NOT NULL DEFAULT 1 REFERENCES idioma(id_idioma),
  nombre            VARCHAR(100)  NOT NULL,
  fecha_nacimiento  DATE,
  correo            VARCHAR(150)  NOT NULL UNIQUE,
  contra_hash       VARCHAR(255)  NOT NULL,
  creado_en         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE notificacion (
  id_notificacion   SERIAL    PRIMARY KEY,
  id_usuario        INT       NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  fecha_programada  DATE      NOT NULL,
  mensaje           TEXT      NOT NULL,
  estado            SMALLINT  NOT NULL DEFAULT 0  -- 0 pendiente, 1 enviada, 2 leída
);

CREATE TABLE pregunta (
  id_pregunta  SERIAL    PRIMARY KEY,
  paso         INT       NOT NULL UNIQUE CHECK (paso BETWEEN 1 AND 7),
  estado       SMALLINT  NOT NULL DEFAULT 1
);

CREATE TABLE autoexamen (
  id_autoexamen  SERIAL       PRIMARY KEY,
  id_usuario     INT          NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  ultima_fecha   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  estado         VARCHAR(20)  NOT NULL DEFAULT 'en_progreso'
                 CHECK (estado IN ('en_progreso', 'completado', 'cancelado')),
  nivel_alerta   VARCHAR(20)  CHECK (nivel_alerta IN ('sin_hallazgos', 'consultar')),
  recomendacion  TEXT,          -- reporte generado por la IA
  ver_modelo_ia  VARCHAR(50)
);

CREATE TABLE respuesta (
  id_respuesta   SERIAL       PRIMARY KEY,
  id_autoexamen  INT          NOT NULL REFERENCES autoexamen(id_autoexamen) ON DELETE CASCADE,
  id_pregunta    INT          NOT NULL REFERENCES pregunta(id_pregunta),
  valor          VARCHAR(20)  NOT NULL CHECK (valor IN ('no', 'si', 'no_segura')),
  UNIQUE (id_autoexamen, id_pregunta)
);

-- Sesiones: la API guarda solo el hash (SHA-256) de cada refresh token, para poder revocarlo al cerrar sesión.
CREATE TABLE refresh_token (
  id_refresh   SERIAL       PRIMARY KEY,
  id_usuario   INT          NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  token_hash   TEXT         NOT NULL UNIQUE,
  expira_en    TIMESTAMPTZ  NOT NULL,
  revocado     BOOLEAN      NOT NULL DEFAULT FALSE,
  creado_en    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notificacion_usuario  ON notificacion (id_usuario, fecha_programada);
CREATE INDEX idx_autoexamen_usuario    ON autoexamen (id_usuario, ultima_fecha DESC);
CREATE INDEX idx_respuesta_autoexamen  ON respuesta (id_autoexamen);
CREATE INDEX idx_refresh_token_usuario ON refresh_token (id_usuario);

-- =====================================================================
-- DATOS INICIALES
-- =====================================================================
INSERT INTO idioma (codigo, nombre) VALUES
  ('es',  'Español'),      -- id 1
  ('eng', 'English');    -- id 2

INSERT INTO pregunta (paso) VALUES (1), (2), (3), (4), (5), (6), (7);


-- La API se conecta como "app": solo puede leer y escribir filas, no cambiar la estructura.
-- Las tablas con SERIAL también necesitan permiso sobre sus secuencias, o los INSERT fallan.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app;