package com.example.guiame.domain.repository

import com.example.guiame.domain.model.ReporteExamen
import com.example.guiame.domain.model.Respuesta
import com.example.guiame.domain.model.ResultadoExamen

interface IExamenRepository {
    /** Envía las respuestas; el backend genera el reporte con Vertex AI y lo guarda si hay sesión. */
    suspend fun enviarAutoexamen(respuestas: Map<Int, Respuesta>, idioma: String): Result<ResultadoExamen>
    suspend fun obtenerHistorial(): Result<List<ReporteExamen>>
}
