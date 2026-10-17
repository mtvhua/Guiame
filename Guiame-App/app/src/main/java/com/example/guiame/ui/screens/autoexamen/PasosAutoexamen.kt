package com.example.guiame.ui.screens.autoexamen

import androidx.annotation.DrawableRes
import androidx.annotation.StringRes
import com.example.guiame.BuildConfig
import com.example.guiame.R

/**
 * Contenido de cada paso. El GIF vive en el bucket privado guiameapp-media:
 *   pasos/paso1.gif ... paso7.gif
 * La app lo pide al backend (GET <api>/media/pasos/paso1.gif) y el backend responde con una
 * redirección a una URL firmada de Cloud Storage de corta duración.
 * Las imágenes locales paso1..paso6 se muestran mientras carga o si no hay internet.
 */
data class PasoAutoexamen(
    val numero: Int,
    @StringRes val titulo: Int,
    @StringRes val instruccion: Int,
    @StringRes val pregunta: Int,
    @DrawableRes val imagenRespaldo: Int?
) {
    val urlMedia: String get() = "${BuildConfig.MEDIA_BASE_URL}pasos/paso$numero.gif"
}

val PasosAutoexamen = listOf(
    PasoAutoexamen(1, R.string.paso1_titulo, R.string.paso1_instruccion, R.string.paso1_pregunta, R.drawable.paso1),
    PasoAutoexamen(2, R.string.paso2_titulo, R.string.paso2_instruccion, R.string.paso2_pregunta, R.drawable.paso2),
    PasoAutoexamen(3, R.string.paso3_titulo, R.string.paso3_instruccion, R.string.paso3_pregunta, R.drawable.paso3),
    PasoAutoexamen(4, R.string.paso4_titulo, R.string.paso4_instruccion, R.string.paso4_pregunta, R.drawable.paso4),
    PasoAutoexamen(5, R.string.paso5_titulo, R.string.paso5_instruccion, R.string.paso5_pregunta, R.drawable.paso5),
    PasoAutoexamen(6, R.string.paso6_titulo, R.string.paso6_instruccion, R.string.paso6_pregunta, R.drawable.paso6),
    PasoAutoexamen(7, R.string.paso7_titulo, R.string.paso7_instruccion, R.string.paso7_pregunta, null)
)
