package com.example.guiame.domain.model

/** Respuesta de cada paso. [valorApi] es lo que se guarda en Cloud SQL. */
enum class Respuesta(val valorApi: String) {
    NO("no"),
    SI("si"),
    NO_SEGURA("no_segura")
}
