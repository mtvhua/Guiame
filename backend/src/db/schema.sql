-- =====================================================================
-- Guíame · Esquema PostgreSQL
-- Sirve igual para la base local y para Cloud SQL (guiame-sql).
-- Se puede ejecutar varias veces: borra las tablas y las vuelve a crear.
-- ¡OJO! Al volver a ejecutarlo se pierden los datos guardados.
-- =====================================================================

DROP TABLE IF EXISTS respuesta          CASCADE;
DROP TABLE IF EXISTS autoexamen         CASCADE;
DROP TABLE IF EXISTS recurso_multimedia CASCADE;
DROP TABLE IF EXISTS texto_pregunta     CASCADE;
DROP TABLE IF EXISTS pregunta           CASCADE;
DROP TABLE IF EXISTS notificacion       CASCADE;
DROP TABLE IF EXISTS perfil             CASCADE;
DROP TABLE IF EXISTS usuario            CASCADE;
DROP TABLE IF EXISTS idioma             CASCADE;

-- ---------------------------------------------------------------------
-- Idioma
-- ---------------------------------------------------------------------
CREATE TABLE idioma (
  id_idioma      SERIAL       PRIMARY KEY,
  codigo         VARCHAR(5)   NOT NULL UNIQUE,   -- 'es', 'quc'
  nombre         VARCHAR(50)  NOT NULL,          -- 'Español', 'K''iche'''
  estado_idioma  SMALLINT     NOT NULL DEFAULT 1 -- 1 activo, 0 inactivo
);

-- ---------------------------------------------------------------------
-- Usuario  (habla un Idioma)
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
  id_usuario        SERIAL        PRIMARY KEY,
  id_idioma         INT           NOT NULL DEFAULT 1 REFERENCES idioma(id_idioma),
  nombre            VARCHAR(100)  NOT NULL,
  fecha_nacimiento  DATE,
  correo            VARCHAR(150)  NOT NULL UNIQUE,
  contra_hash       VARCHAR(255)  NOT NULL,
  creado_en         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Perfil  (1 a 1 con Usuario)
-- ---------------------------------------------------------------------
CREATE TABLE perfil (
  id_perfil            SERIAL   PRIMARY KEY,
  id_usuario           INT      NOT NULL UNIQUE REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  menopausia           BOOLEAN  NOT NULL DEFAULT FALSE,
  ultima_menstruacion  DATE
);



-- ---------------------------------------------------------------------
-- Notificación  (Ciclo genera / Usuario recibe)
-- ---------------------------------------------------------------------
CREATE TABLE notificacion (
  id_notificacion   SERIAL    PRIMARY KEY,
  id_usuario        INT       NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  fecha_programada  DATE      NOT NULL,
  mensaje           TEXT      NOT NULL,
  estado            SMALLINT  NOT NULL DEFAULT 0  -- 0 pendiente, 1 enviada, 2 leída
);

-- ---------------------------------------------------------------------
-- Pregunta  (cada paso del autoexamen)
-- Los textos en cada idioma van en texto_pregunta.
-- ---------------------------------------------------------------------
CREATE TABLE pregunta (
  id_pregunta  SERIAL    PRIMARY KEY,
  paso         INT       NOT NULL UNIQUE CHECK (paso BETWEEN 1 AND 7),
  estado       SMALLINT  NOT NULL DEFAULT 1
);

-- ---------------------------------------------------------------------
-- Texto de la pregunta  (Pregunta se traduce en / traducido a Idioma)
-- ---------------------------------------------------------------------
CREATE TABLE texto_pregunta (
  id_texto_pregunta  SERIAL    PRIMARY KEY,
  id_pregunta        INT       NOT NULL REFERENCES pregunta(id_pregunta) ON DELETE CASCADE,
  id_idioma          INT       NOT NULL REFERENCES idioma(id_idioma),
  titulo             VARCHAR(150) NOT NULL,
  instruccion        TEXT      NOT NULL,
  texto              TEXT      NOT NULL,   -- la pregunta que se le hace a la usuaria
  estado             SMALLINT  NOT NULL DEFAULT 1,
  UNIQUE (id_pregunta, id_idioma)
);

-- ---------------------------------------------------------------------
-- Recurso multimedia  (ilustra una Pregunta)
-- ---------------------------------------------------------------------
CREATE TABLE recurso_multimedia (
  id_recurso    SERIAL       PRIMARY KEY,
  id_pregunta   INT          NOT NULL REFERENCES pregunta(id_pregunta) ON DELETE CASCADE,
  id_idioma     INT          REFERENCES idioma(id_idioma),   -- NULL = sirve para todos
  tipo_recurso  VARCHAR(20)  NOT NULL CHECK (tipo_recurso IN ('imagen', 'gif', 'video', 'audio')),
  url           TEXT         NOT NULL                        -- ruta en Cloud Storage
);

-- ---------------------------------------------------------------------
-- Autoexamen  (Usuario realiza)
-- ---------------------------------------------------------------------
CREATE TABLE autoexamen (
  id_autoexamen  SERIAL       PRIMARY KEY,
  id_usuario     INT          NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  ultima_fecha   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  estado         VARCHAR(20)  NOT NULL DEFAULT 'en_progreso'
                 CHECK (estado IN ('en_progreso', 'completado', 'cancelado')),
  nivel_alerta   VARCHAR(20)  CHECK (nivel_alerta IN ('sin_hallazgos', 'consultar')),
  recomendacion  TEXT,
  ver_modelo_ia  VARCHAR(50)
);

-- ---------------------------------------------------------------------
-- Respuesta  (Autoexamen contiene / Pregunta responde)
-- ---------------------------------------------------------------------
CREATE TABLE respuesta (
  id_respuesta   SERIAL       PRIMARY KEY,
  id_autoexamen  INT          NOT NULL REFERENCES autoexamen(id_autoexamen) ON DELETE CASCADE,
  id_pregunta    INT          NOT NULL REFERENCES pregunta(id_pregunta),
  valor          VARCHAR(20)  NOT NULL CHECK (valor IN ('no', 'si', 'no_segura')),
  UNIQUE (id_autoexamen, id_pregunta)
);

-- Índices para las búsquedas más comunes (por usuaria)
CREATE INDEX idx_notificacion_usuario ON notificacion (id_usuario, fecha_programada);
CREATE INDEX idx_autoexamen_usuario   ON autoexamen (id_usuario, ultima_fecha DESC);
CREATE INDEX idx_respuesta_autoexamen ON respuesta (id_autoexamen);

-- =====================================================================
-- DATOS INICIALES
-- =====================================================================

INSERT INTO idioma (codigo, nombre) VALUES
  ('es',  'Español'),     -- id 1
  ('quc', 'K''iche''');   -- id 2

INSERT INTO pregunta (paso) VALUES (1), (2), (3), (4), (5), (6), (7);

-- Textos en español (id_idioma = 1). Los de K'iche' se agregan igual con id_idioma = 2.
INSERT INTO texto_pregunta (id_pregunta, id_idioma, titulo, instruccion, texto) VALUES
  (1, 1, 'Observa frente al espejo',
   'Con el torso descubierto y los brazos relajados a los lados, observa tus senos frente al espejo. Fíjate en su forma, tamaño y color.',
   '¿Notaste algún cambio en la forma, el tamaño o el color?'),
  (2, 1, 'Levanta los brazos',
   'Sube los brazos por encima de la cabeza y vuelve a observar. Busca hundimientos, arrugas o piel con aspecto de cáscara de naranja.',
   '¿Viste hundimientos o cambios en la piel?'),
  (3, 1, 'Manos en la cintura',
   'Coloca las manos en la cintura y presiona con firmeza para tensar el pecho. Observa si un seno se ve distinto al otro.',
   '¿Notaste alguna diferencia entre ambos senos?'),
  (4, 1, 'Revisa los pezones',
   'Observa si algún pezón está hundido o cambió de dirección. Presiónalo suavemente para ver si sale algún líquido.',
   '¿Notaste cambios o salida de líquido en los pezones?'),
  (5, 1, 'Palpa el seno izquierdo',
   'Acuéstate boca arriba con el brazo izquierdo detrás de la cabeza. Con las yemas de tres dedos de la mano derecha, recorre todo el seno con movimientos circulares, desde afuera hacia el pezón.',
   '¿Sentiste algún bulto, endurecimiento o dolor?'),
  (6, 1, 'Palpa el seno derecho',
   'Ahora coloca el brazo derecho detrás de la cabeza y repite el recorrido con la mano izquierda, con movimientos circulares desde afuera hacia el pezón.',
   '¿Sentiste algún bulto, endurecimiento o dolor?'),
  (7, 1, 'Revisa las axilas',
   'Con el brazo relajado, palpa cada axila con movimientos circulares, buscando bultos o zonas duras.',
   '¿Sentiste algún bulto en las axilas?');

-- Ejemplo de recurso multimedia (descoméntalo cuando subas el archivo al bucket):
-- INSERT INTO recurso_multimedia (id_pregunta, tipo_recurso, url)
-- VALUES (1, 'gif', 'https://storage.googleapis.com/guiame-media-TU_PROYECTO_ID/autoexamen/paso1.gif');