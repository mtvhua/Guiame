package com.example.guiame.data.remote.dto

import com.example.guiame.domain.model.ReporteExamen
import com.example.guiame.domain.model.ResultadoExamen
import com.example.guiame.domain.model.Usuario

// Contrato completo en docs/API.md. Los campos de respuesta son nullables porque Gson
// no respeta la nulabilidad de Kotlin; se validan al convertir a modelos de dominio.

data class LoginRequest(val email: String, val password: String)

data class RegistroRequest(
    val nombre: String,
    val fechaNacimiento: String,   // AAAA-MM-DD
    val email: String,
    val password: String
)

data class RefreshRequest(val refreshToken: String)

data class TokenResponse(
    val accessToken: String?,
    val refreshToken: String?,
    val usuario: UsuarioDto?
)

data class UsuarioDto(
    val id: String?,
    val nombre: String?,
    val email: String?,
    val edad: Int?
) {
    fun toDomain() = Usuario(
        id = id.orEmpty(),
        nombre = nombre.orEmpty(),
        email = email.orEmpty(),
        edad = edad
    )
}

data class RespuestaDto(val paso: Int, val respuesta: String)

data class ExamenRequest(
    val idioma: String,
    val respuestas: List<RespuestaDto>
)

data class ExamenResponse(
    val id: String?,
    val fecha: String?,
    val reporte: String?,
    val tieneAlertas: Boolean?,
    val guardado: Boolean?
) {
    fun toDomain(tieneAlertasLocal: Boolean) = ResultadoExamen(
        reporte = reporte?.takeIf { it.isNotBlank() },
        tieneAlertas = tieneAlertas ?: tieneAlertasLocal,
        guardado = guardado ?: false
    )
}

data class ExamenDto(
    val id: String?,
    val fecha: String?,
    val reporte: String?,
    val tieneAlertas: Boolean?
) {
    fun toDomain() = ReporteExamen(
        id = id.orEmpty(),
        fecha = fecha.orEmpty(),
        reporte = reporte.orEmpty(),
        tieneAlertas = tieneAlertas ?: false
    )
}
