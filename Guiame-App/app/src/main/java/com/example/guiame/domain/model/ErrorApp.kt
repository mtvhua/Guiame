package com.example.guiame.domain.model

/** Errores que la UI sabe mostrar (cada uno tiene su texto en strings.xml). */
enum class ErrorApp {
    SIN_CONEXION,
    CREDENCIALES_INVALIDAS,
    CORREO_EN_USO,
    SESION_EXPIRADA,
    CAMPOS_INCOMPLETOS,
    CORREO_INVALIDO,
    CONTRASENA_CORTA,
    EDAD_INVALIDA,
    DEMASIADOS_INTENTOS,
    SERVIDOR
}

class AppException(val tipo: ErrorApp) : Exception(tipo.name)
