# *GUIAME-APP*
- Repo de la pagina web: https://github.com/mtvhua/Guiame-App/tree/master

## Versión 2.0 (Cloud Computing, GCP)

App Android en Kotlin + Jetpack Compose, arquitectura MVVM. **Ya no usa Firebase**: la autenticación,
los datos y la IA pasan por el backend en Cloud Run.

```
App Android ──HTTPS──> Cloud Load Balancing ──> Cloud Run (backend)
                                                 ├── Cloud SQL (PostgreSQL)
                                                 ├── Vertex AI (reporte)
                                                 └── Secret Manager (BD, JWT)
App Android ──HTTPS──> Cloud Storage (GIF e imágenes de los pasos)
```

### Configuración

Agrega a `local.properties` (no se sube a Git):

```properties
guiame.api.url=https://guiame-api-xxxxx-ue.a.run.app/api/
```

Es la única URL que necesita la app. Debe terminar en `/`. Mientras desarrollas usa la URL de Cloud Run
(con el Ingress en "Todo"); al terminar el paso 10 de la guía de despliegue, cámbiala por la del balanceador.
Si no la pones, en debug la app usa `http://10.0.2.2:8080/` (tu backend local visto desde el emulador).
Los GIF e imágenes se piden al backend (`<api>/media/...`); la app nunca habla directo con Cloud Storage.

- Contrato de la API: [`docs/API.md`](docs/API.md)
- Tablas de Cloud SQL: [`docs/schema.sql`](docs/schema.sql)

### Estructura

```
app/src/main/java/com/example/guiame/
├── GuiameApplication.kt      # crea AppContainer y el cargador de GIF (Coil)
├── MainActivity.kt
├── di/AppContainer.kt        # Retrofit, OkHttp, repositorios
├── domain/
│   ├── model/                # Usuario, AuthState, Respuesta, ReporteExamen, ErrorApp
│   └── repository/           # IAuthRepository, IExamenRepository
├── data/
│   ├── remote/               # GuiameApi, DTOs, AuthInterceptor, TokenAuthenticator
│   ├── local/                # TokenStore (cifrado con Keystore), PreferenciasStore
│   └── repository/           # AuthRepository, ExamenRepository
├── ui/
│   ├── theme/ components/ navigation/ util/
│   ├── screens/inicio | informacion | perfil | autoexamen
│   └── viewmodel/            # AuthViewModel, AutoexamenViewModel, HistorialViewModel, RecordatoriosViewModel
├── util/IdiomaManager.kt     # Español / K'iche' (values-b+quc)
└── worker/                   # Recordatorio mensual (WorkManager)
```

---

*PROPOSAL:*

- PDF: [Guiame-App.pdf](https://github.com/user-attachments/files/25171000/Guiame-App.1.pdf) 
- Link video: https://youtu.be/JCGWWlkGgXc

#
*MOCK-UP:*
- PDF: [MockUp.pdf](https://github.com/user-attachments/files/25473898/MockUp.pdf)
- Link video: https://youtu.be/IWX6-Q4P9uw

#
*STATIC VERSION:*
- PDF: [StaticVersion.pdf](https://github.com/mtvhua/Guiame-App/blob/main/STATIC%20VERSION.pdf)
- Link video: https://youtu.be/nFlNEP-o8GE 


#
*FASE 4 y 5:*
- PDF: [Fase 4 y 5.pdf](https://github.com/user-attachments/files/26494830/Fase.4.y.5.pdf)
- Link del video: https://youtu.be/FDPQuztoHzg

#
*PRE-DELIVERY (BETA PHASE):*
- PDF: [GUÍAME APP - Pre-delivery (Beta).pdf](https://github.com/user-attachments/files/26884112/GUIAME.APP.-.Pre-delivery.Beta.pdf)
- Link del video: https://youtu.be/aX_cktIDg6c

#
*FINAL PROJECT:*
- App en su fase 1.0
- PDF: [GUÍAME APP - Final Project.pdf](https://github.com/user-attachments/files/27331045/GUIAME.APP.-.Final.Project.pdf)
- Link del video: https://youtu.be/KcgDjGg712w
