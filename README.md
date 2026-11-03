# Guíame — Ecosistema de salud digital para el autoexamen de mama

| Integrante | Carnet |
|---|---|
| Teresa Rivera | 24000579 |
| Molly Toledo | 24000196 |

**Guíame** enseña y acompaña el autoexamen de mama en Guatemala. Una **app Android** y un **portal web** comparten la misma API y la misma base de datos, desplegadas en **Google Cloud Platform**. La IA (Gemini en Vertex AI) redacta un reporte breve y no alarmante al terminar el autoexamen. El reporte nunca da un diagnóstico: recomienda consultar a un profesional de salud.

## Enlaces de la entrega

| Elemento | Enlace |
|---|---|
| API desplegada (Cloud Run) | https://guiame-api-252741632220.us-east1.run.app (`/health`, `/health/db`) |
| Portal web | No tiene link ya que fue desplegado desde localhost |
| Video de demostración | link |
| Documentación (PDF) |  |

## Funcionalidades

- Autoexamen guiado de **7 pasos** con GIF, preguntas Sí / No / No estoy segura y **reporte con IA**.
- Registro e inicio de sesión (JWT con refresh token rotativo).
- **Historial** de autoexámenes, en la app y en el portal web.
- Información educativa sobre cáncer de mama (qué es, cuándo hacerlo, señales de alerta, riesgos, mitos, dónde acudir).
- **Recordatorios** mensuales y selector de idioma (español / inglés).

## Arquitectura

!foto arquitectura

- **App Android:** Kotlin, Jetpack Compose y patrón **MVVM** (Vista → ViewModel → Repositorio → Retrofit/OkHttp).
- **Portal web:** React, login e historial.
- **API:** Node.js 20 + Express 5, en Cloud Run.
- **Base de datos:** PostgreSQL en Cloud SQL.

### Servicios de Google Cloud (9)

| # | Servicio | Rol |
|---|---|---|
| 1 | **Cloud Run** | Ejecuta la API (`guiame-api`), autoescala hasta 20 instancias |
| 2 | **Cloud SQL (PostgreSQL)** | Usuarias, autoexámenes, respuestas, notificaciones y sesiones |
| 3 | **Cloud Storage** | Bucket privado con GIF e imágenes (URL firmadas de 10 minutos) |
| 4 | **Vertex AI (Gemini 2.5 Flash)** | Reporte del autoexamen |
| 5 | **Cloud Load Balancing** | Balanceador de aplicaciones externo global (`guiame-lb`) |
| 6 | **Cloud IAM** | Cuenta de servicio `guiame-backend` con roles mínimos |
| 7 | **Secret Manager** | `db-password` y `jwt-secret` |
| 8 | **Cloud Monitoring y Logging** | Uptime check de `/health`, alerta 5xx, panel y consultas de errores |
| 9 | **Cloud Build** (+ Artifact Registry) | Despliegue continuo desde GitHub |

## Estructura del repositorio

```
Guiame/
├── backend/            API Node.js + Express (Cloud Run)
│   ├── src/
│   │   ├── routes/     auth, usuarios, examenes, media
│   │   ├── services/   vertex.js (IA), tokens.js (JWT), edad.js
│   │   ├── db/         pool.js y schema.sql
│   │   └── config.js
│   └── test/           17 pruebas con PostgreSQL real
├── Guiame-App/         App Android (Kotlin, Compose, MVVM)
├── web/                Portal web
└── docs/               Documentación, diagrama y esquema SQL
```

## Cómo ejecutarlo

### Backend en Google Cloud
Los pasos completos, con la consola web y la configuración de seguridad, están en la **sección 5 de la documentación PDF**. En resumen:

1. Crear el proyecto y habilitar las APIs (Cloud Run, Cloud SQL Admin, Secret Manager, Vertex AI, Cloud Build, Artifact Registry).
2. Crear la cuenta de servicio `guiame-backend` con los roles Cloud SQL Client y Vertex AI User.
3. Crear la instancia de Cloud SQL, la base `guiame` y el usuario `app`; ejecutar [`backend/src/db/schema.sql`](docs/schema.sql) como `postgres`.
4. Crear los secretos `db-password` y `jwt-secret` en Secret Manager.
5. Crear el bucket `guiameapp-media` (privado) y subir los GIF a la carpeta `pasos/`.
6. Crear el servicio de Cloud Run con despliegue continuo desde este repositorio (carpeta `/backend`, buildpacks) y las variables de entorno de la tabla siguiente.
7. Comprobar `/health` y `/health/db`.

| Variable | Valor |
|---|---|
| `DB_USER` | `app` |
| `DB_NAME` | `guiame` |
| `INSTANCE_CONNECTION_NAME` | `guiameapp:us-east1:guiame-sql` |
| `MEDIA_BUCKET` | `guiameapp-media` |
| `GCP_PROJECT` | `guiameapp` |
| `VERTEX_LOCATION` | `us-east1` |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `CORS_ORIGINS` | origen del portal web |
| `TRUST_PROXY_HOPS` | `2` con balanceador, `1` sin él |
| `DB_PASS` | secreto `db-password` |
| `JWT_SECRET` | secreto `jwt-secret` (mínimo 32 caracteres) |

### Backend en local
Necesita un PostgreSQL local (o el Cloud SQL Auth Proxy) con el esquema `schema.sql` aplicado.

### App Android
1. Abrir `Guiame-App/` con Android Studio.
2. En `local.properties` agregar la URL del API, terminada en `/api/`:
   ```
   guiame.api.url=https://TU-URL-DE-CLOUD-RUN/api/
   ```
3. Sync de Gradle y Run (emulador o celular con depuración USB).

### Portal web
Configurar la URL del API en la variable de entorno del proyecto y ejecutarlo en `http://localhost`. Para pasar por el balanceador use `http://IP-DEL-BALANCEADOR/api`.

## Seguridad

- Secretos en **Secret Manager**; nada en el código ni en GitHub.
- Contraseñas con **bcrypt**; JWT de 30 minutos y refresh token de 30 días rotativo, guardado como hash.
- Bucket **privado** con prevención de acceso público y URL firmadas que caducan.
- **Mínimo privilegio** con IAM: una cuenta de servicio con roles por recurso.
- Consultas parametrizadas, `helmet`, CORS con lista blanca y límite de intentos (429).
- Registros sin datos de salud, y token cifrado en el teléfono con Android Keystore.

## Costos estimados (USD / mes)

| Escenario | Total | Mayor gasto |
|---|---|---|
| Período de prueba | **$89.65** | Cloud SQL ($51.01) |
| Período de producción | **$403.68** | Vertex AI ($140.00), Cloud SQL ($115.62), Cloud Storage ($99.90) |

El detalle por servicio, los precios unitarios y el análisis están en la **sección 7 del PDF**.

## Limitaciones

- Sin dominio propio: la app llama directo a Cloud Run por HTTPS y el balanceador solo atiende HTTP.
- Traducción al K'iche' pendiente de revisión por hablantes nativos; el reporte de IA sale siempre en español.
