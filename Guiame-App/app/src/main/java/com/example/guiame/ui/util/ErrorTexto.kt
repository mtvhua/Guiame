package com.example.guiame.ui.util

import androidx.annotation.StringRes
import com.example.guiame.R
import com.example.guiame.domain.model.ErrorApp

@StringRes
fun ErrorApp.texto(): Int = when (this) {
    ErrorApp.SIN_CONEXION -> R.string.error_sin_conexion
    ErrorApp.CREDENCIALES_INVALIDAS -> R.string.error_credenciales
    ErrorApp.CORREO_EN_USO -> R.string.error_correo_en_uso
    ErrorApp.SESION_EXPIRADA -> R.string.error_sesion_expirada
    ErrorApp.CAMPOS_INCOMPLETOS -> R.string.error_campos
    ErrorApp.CORREO_INVALIDO -> R.string.error_correo_invalido
    ErrorApp.CONTRASENA_CORTA -> R.string.error_contrasena_corta
    ErrorApp.EDAD_INVALIDA -> R.string.error_edad
    ErrorApp.DEMASIADOS_INTENTOS -> R.string.error_demasiados_intentos
    ErrorApp.SERVIDOR -> R.string.error_servidor
}
