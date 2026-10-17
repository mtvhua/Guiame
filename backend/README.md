# Backend de Guíame (Node.js + Express, para Cloud Run)

API única de Guíame. La usan la app Android (Kotlin) y el portal web. Es el **único** componente con acceso a
Cloud SQL, Cloud Storage y Vertex AI; los clientes no tienen credenciales de Google Cloud.

```
src/
├── server.js            arranque (valida secretos, cierra bien con SIGTERM)
├── app.js               rutas, /health, manejo de errores
├── config.js            variables de entorno
├── db/schema.sql        tablas (ejecutar en Cloud SQL Studio)
├── db/pool.js           conexión a Cloud SQL (socket /cloudsql/... en Cloud Run)
├── middleware/auth.js   JWT (sesión obligatoria u opcional)
├── routes/              auth, usuarios, examenes, media
└── services/            tokens (JWT + refresh), vertex (Gemini)
test/api.test.js         16 pruebas de integración contra PostgreSQL real
```

## Endpoints

Contrato completo para el cliente: `docs/API.md` del proyecto Android. Resumen:

| Método | Ruta | Sesión |
|---|---|---|
| GET | `/health`, `/health/db` | No |
| POST | `/api/auth/register`, `/login`, `/refresh`, `/logout` | No |
| GET | `/api/usuarios/me` | Sí |
| POST | `/api/examenes` | Opcional (sin sesión devuelve el reporte pero no guarda) |
| GET | `/api/examenes` | Sí |
| GET | `/api/media/pasos/paso1.gif`, `/api/media/info/que_es.jpg` … | No (responde 302 a una URL firmada) |

## Paso 6 (Cloud SQL): cargar las tablas

1. Cloud SQL Studio → base `guiame`, usuario `app`.
2. Pegar y ejecutar `src/db/schema.sql` (se puede ejecutar más de una vez sin dañar nada).

## Paso 7 (Cloud Run): desplegar

Desde esta carpeta (`backend/`). Reemplaza `guiameapp` si tu ID de proyecto es otro:

```bash
gcloud run deploy guiame-api --source . --region us-east1 \
  --service-account guiame-backend@guiameapp.iam.gserviceaccount.com \
  --add-cloudsql-instances guiameapp:us-east1:guiame-sql \
  --set-env-vars DB_USER=app,DB_NAME=guiame,INSTANCE_CONNECTION_NAME=guiameapp:us-east1:guiame-sql,MEDIA_BUCKET=guiameapp-media,GCP_PROJECT=guiameapp,VERTEX_LOCATION=us-east1,GEMINI_MODEL=gemini-2.5-flash \
  --set-secrets DB_PASS=db-password:latest,JWT_SECRET=jwt-secret:latest \
  --min-instances 0 --max-instances 3 \
  --allow-unauthenticated
```

- `jwt-secret` debe tener **al menos 32 caracteres**. Si no, el servicio no arranca y el motivo sale en Logging.
- No hace falta Dockerfile: Cloud Build detecta Node con `package.json` (`npm start`).
- Cuando el servicio esté detrás del balanceador (paso 10), agrega `TRUST_PROXY_HOPS=2` y confirma con una
  petición de prueba que el límite de intentos usa tu IP real (con el valor equivocado todos comparten la IP del balanceador).

### Permisos que necesita `guiame-backend`

| Para | Rol | Dónde |
|---|---|---|
| Leer `db-password` y `jwt-secret` | Secret Manager Secret Accessor | En cada secreto |
| Conectarse a Cloud SQL | Cloud SQL Client | Proyecto |
| Llamar a Gemini | Vertex AI User | Proyecto |
| Comprobar que el archivo existe | Storage Object Viewer (o el Object Admin que ya tiene) | Bucket `guiameapp-media` |
| **Firmar las URLs de `/api/media`** | **Service Account Token Creator** | **Sobre la propia cuenta `guiame-backend`** (IAM → Cuentas de servicio → guiame-backend → Permisos → Otorgar acceso a sí misma) |

Sin el último rol, `/api/media/...` responde 500 con un error de `signBlob` en Logging.

## Verificar tras desplegar

```bash
URL=https://guiame-api-xxxxx-ue.a.run.app      # la que imprime gcloud run deploy

curl $URL/health                                # {"status":"ok"}
curl $URL/health/db                             # {"status":"ok","db":"ok"}

curl -X POST $URL/api/auth/register -H 'content-type: application/json' \
  -d '{"nombre":"Prueba","edad":30,"email":"prueba@correo.com","password":"clave-segura-1"}'
# -> devuelve accessToken y refreshToken. Úsalos:

curl -X POST $URL/api/examenes -H 'content-type: application/json' -H "authorization: Bearer ACCESS_TOKEN" \
  -d '{"idioma":"es","respuestas":[{"paso":1,"respuesta":"no"},{"paso":2,"respuesta":"no"},{"paso":3,"respuesta":"no"},{"paso":4,"respuesta":"no"},{"paso":5,"respuesta":"si"},{"paso":6,"respuesta":"no"},{"paso":7,"respuesta":"no"}]}'
# -> "reporte" con texto de Vertex AI y "guardado": true. Si "reporte" es null, mira Logging (ver abajo).

curl -i $URL/api/media/pasos/paso1.gif          # 302 con Location: https://storage.googleapis.com/...
```

Si `"reporte"` sale `null`: en Logging busca `Vertex AI falló`. Causas habituales: API de Vertex no habilitada,
falta el rol Vertex AI User, o el modelo no está disponible en la región. En ese caso prueba
`VERTEX_LOCATION=us-central1` (`gcloud run services update guiame-api --region us-east1 --update-env-vars VERTEX_LOCATION=us-central1`);
la ubicación del modelo es independiente de dónde corre Cloud Run.

## Correr en tu computadora

```bash
npm install
cp .env.example .env        # edita los valores
# En otra terminal, el Cloud SQL Auth Proxy:  cloud-sql-proxy guiameapp:us-east1:guiame-sql
node --env-file=.env src/server.js
```

Para que el emulador de Android llegue a tu computadora, la app usa `http://10.0.2.2:8080/api/` (ya viene por defecto en debug).
Vertex AI y Cloud Storage desde tu computadora necesitan `gcloud auth application-default login`.

## Pruebas

```bash
# Usa una base de PRUEBAS (borra los datos de las tablas). Vertex AI y Cloud Storage se simulan.
DB_HOST=127.0.0.1 DB_USER=app DB_NAME=guiame_test DB_PASS=... npm test
```

## Seguridad

- Contraseñas con bcrypt; refresh tokens aleatorios guardados como SHA-256 y rotados en cada uso.
- Límite de intentos: 100 por IP y 10 fallidos por correo cada 15 minutos (429).
- El login tarda igual exista o no el correo y no revela cuáles están registrados.
- Los logs **no** incluyen contraseñas, tokens, respuestas ni reportes (son datos de salud).
- El reporte de IA nunca diagnostica y siempre recuerda que no reemplaza al profesional de salud.
- `/api/media` solo sirve las carpetas `pasos/` e `info/` con nombres simples.
