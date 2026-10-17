# API de Guíame (Cloud Run)

La app Android consume esta API. La URL base termina en `/api/` y es la de **Cloud Load Balancing**
(que reenvía `/api/*` a Cloud Run) o, en desarrollo, la de Cloud Run directo. Todo el JSON va en camelCase y las fechas en ISO-8601 (UTC).

## Autenticación (sin Firebase)

- El backend firma JWT con una clave guardada en **Secret Manager** (`JWT_SECRET`).
- Access token: vida corta (15–60 min). Refresh token: 30 días, guardado como hash en `refresh_tokens`.
- Rutas protegidas: header `Authorization: Bearer <accessToken>`.
- Si el access token venció, responder **401**. La app llama a `/auth/refresh` sola y repite la petición.

| Método | Ruta | Auth | Body | Respuesta |
|---|---|---|---|---|
| POST | `/auth/register` | No | `{ nombre, edad, email, password }` | `201` + `TokenResponse` · `409` si el correo existe |
| POST | `/auth/login` | No | `{ email, password }` | `200` + `TokenResponse` · `401` si no coincide |
| POST | `/auth/refresh` | No | `{ refreshToken }` | `200` + `TokenResponse` (con refresh nuevo) · `401` |
| POST | `/auth/logout` | No | `{ refreshToken }` | `204` (marca el refresh como revocado) |
| GET | `/usuarios/me` | Sí | — | `Usuario` |
| POST | `/examenes` | Opcional | `ExamenRequest` | `ExamenResponse` |
| GET | `/examenes` | Sí | — | `ExamenDto[]` (más reciente primero) |

Errores comunes: `400` datos inválidos · `401` credenciales o token inválidos · `409` correo repetido ·
`429` demasiados intentos (10 logins fallidos por correo o 100 peticiones por IP cada 15 min).
El backend de referencia está en la carpeta `backend/` (ver su README).

### Tipos

```jsonc
// TokenResponse
{ "accessToken": "eyJ...", "refreshToken": "c1f0...", "usuario": Usuario }

// Usuario
{ "id": "uuid", "nombre": "Ana", "email": "ana@correo.com", "edad": 28 }

// ExamenRequest  (respuesta: "no" | "si" | "no_segura", idioma: "es" | "quc")
{ "idioma": "es", "respuestas": [ { "paso": 1, "respuesta": "no" }, ... 7 pasos ] }

// ExamenResponse
{ "id": "uuid", "fecha": "2026-10-15T16:00:00Z", "reporte": "texto de Vertex AI",
  "tieneAlertas": true, "guardado": true }

// ExamenDto
{ "id": "uuid", "fecha": "2026-10-15T16:00:00Z", "reporte": "...", "tieneAlertas": false }
```

### `POST /examenes`

1. Validar que vengan los 7 pasos con valores permitidos.
2. `tieneAlertas` = alguna respuesta distinta de `"no"`.
3. Si hay token válido, leer nombre y edad de la usuaria en Cloud SQL.
4. Llamar a **Vertex AI** (Gemini) con la service account de Cloud Run, sin API key.
   El prompt pide un reporte breve, empático, en el idioma pedido, y que aclare que no
   reemplaza la consulta médica ni la mamografía.
5. Si hay sesión, guardar en `autoexamenes` + `respuestas` y devolver `guardado: true`.
   Sin sesión, solo devolver el reporte (`guardado: false`).
6. Si Vertex AI falla, devolver igual `200` con `reporte: null`. La app muestra su mensaje local.

## Multimedia (Cloud Storage, bucket privado `guiameapp-media`)

El bucket tiene el acceso público bloqueado, así que la app no lo llama directo. Pide los archivos al backend:

| Método | Ruta | Auth | Respuesta |
|---|---|---|---|
| GET | `/media/pasos/paso1.gif` … `/media/pasos/paso7.gif` | No | `302` a una URL firmada de Cloud Storage (válida unos minutos) |
| GET | `/media/info/que_es.jpg`, `cuando.jpg`, `senales.jpg`, `riesgo.jpg`, `mitos.jpg`, `donde_acudir.jpg` | No | `302` igual que arriba |

- Si el archivo no existe, responder `404`: la app muestra su imagen local de respaldo (pasos 1 a 6) o esconde el recuadro.
- Con credenciales de Cloud Run (sin llave JSON), para firmar URLs la service account `guiame-backend` necesita el rol
  **Service Account Token Creator sobre sí misma**. Storage Object Admin no basta para firmar.
- Alternativa más simple: que el backend lea el archivo con `@google-cloud/storage` y lo devuelva en el cuerpo (`200`).

## Seguridad

- Contraseñas con argon2id o bcrypt. Limitar los intentos de `/auth/login`.
- No escribir en Cloud Logging cuerpos de peticiones, respuestas del examen ni reportes (son datos de salud).
- Conectar Cloud Run con Cloud SQL usando el conector de Cloud SQL. La contraseña de la base va en Secret Manager.
- Service account de Cloud Run con solo estos roles: `roles/cloudsql.client`,
  `roles/secretmanager.secretAccessor`, `roles/aiplatform.user`, `roles/storage.objectViewer`.
