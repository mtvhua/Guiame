package com.example.guiame.data.repository

import com.example.guiame.data.remote.GuiameApi
import com.example.guiame.data.remote.dto.ExamenRequest
import com.example.guiame.data.remote.dto.RespuestaDto
import com.example.guiame.data.remote.llamarApi
import com.example.guiame.domain.model.ReporteExamen
import com.example.guiame.domain.model.Respuesta
import com.example.guiame.domain.model.ResultadoExamen
import com.example.guiame.domain.repository.IExamenRepository

/** Autoexámenes guardados en Cloud SQL a través del backend. */
class ExamenRepository(private val api: GuiameApi) : IExamenRepository {

    override suspend fun enviarAutoexamen(
        respuestas: Map<Int, Respuesta>,
        idioma: String
    ): Result<ResultadoExamen> {
        val tieneAlertas = respuestas.values.any { it != Respuesta.NO }
        val body = ExamenRequest(
            idioma = idioma,
            respuestas = respuestas.toSortedMap().map { (paso, r) -> RespuestaDto(paso, r.valorApi) }
        )
        return llamarApi { api.enviarExamen(body).toDomain(tieneAlertas) }
    }

    override suspend fun obtenerHistorial(): Result<List<ReporteExamen>> =
        llamarApi { api.obtenerExamenes().map { it.toDomain() }.sortedByDescending { it.fecha } }
}
