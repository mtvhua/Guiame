package com.example.guiame.domain.model

/** Un autoexamen guardado en Cloud SQL. [fecha] viene en ISO-8601 desde el backend. */
data class ReporteExamen(
    val id: String,
    val fecha: String,
    val reporte: String,
    val tieneAlertas: Boolean
)

/** Lo que devuelve el backend al terminar un autoexamen (reporte generado con Vertex AI). */
data class ResultadoExamen(
    val reporte: String?,
    val tieneAlertas: Boolean,
    val guardado: Boolean
)
