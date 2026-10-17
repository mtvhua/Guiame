package com.example.guiame.data.remote

import com.example.guiame.domain.model.AppException
import com.example.guiame.domain.model.ErrorApp
import retrofit2.HttpException
import java.io.IOException

/** Convierte excepciones de red/HTTP en errores que la UI sabe mostrar. */
fun Throwable.aErrorApp(): AppException = when (this) {
    is AppException -> this
    is IOException -> AppException(ErrorApp.SIN_CONEXION)
    is HttpException -> when (code()) {
        400 -> AppException(ErrorApp.CAMPOS_INCOMPLETOS)
        401 -> AppException(ErrorApp.CREDENCIALES_INVALIDAS)
        409 -> AppException(ErrorApp.CORREO_EN_USO)
        429 -> AppException(ErrorApp.DEMASIADOS_INTENTOS)
        else -> AppException(ErrorApp.SERVIDOR)
    }
    else -> AppException(ErrorApp.SERVIDOR)
}

/** Ejecuta una llamada y devuelve Result con el error ya traducido. */
suspend fun <T> llamarApi(bloque: suspend () -> T): Result<T> =
    try {
        Result.success(bloque())
    } catch (e: kotlinx.coroutines.CancellationException) {
        throw e
    } catch (e: Throwable) {
        Result.failure(e.aErrorApp())
    }
