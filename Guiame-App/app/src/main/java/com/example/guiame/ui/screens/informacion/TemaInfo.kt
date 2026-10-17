package com.example.guiame.ui.screens.informacion

import androidx.annotation.StringRes
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.HelpOutline
import androidx.compose.material.icons.outlined.Event
import androidx.compose.material.icons.outlined.Insights
import androidx.compose.material.icons.outlined.Lightbulb
import androidx.compose.material.icons.outlined.LocalHospital
import androidx.compose.material.icons.outlined.WarningAmber
import androidx.compose.ui.graphics.vector.ImageVector
import com.example.guiame.BuildConfig
import com.example.guiame.R

/**
 * Temas de la pestaña Información. [id] se usa en la ruta de navegación y para buscar
 * una imagen opcional: bucket guiameapp-media, info/<id>.jpg (se pide vía <api>/media/info/<id>.jpg)
 */
enum class TemaInfo(
    val id: String,
    @StringRes val titulo: Int,
    @StringRes val cuerpo: Int,
    val icono: ImageVector
) {
    QUE_ES("que_es", R.string.tema_que_es, R.string.tema_que_es_cuerpo, Icons.AutoMirrored.Outlined.HelpOutline),
    CUANDO("cuando", R.string.tema_cuando, R.string.tema_cuando_cuerpo, Icons.Outlined.Event),
    SENALES("senales", R.string.tema_senales, R.string.tema_senales_cuerpo, Icons.Outlined.WarningAmber),
    RIESGO("riesgo", R.string.tema_riesgo, R.string.tema_riesgo_cuerpo, Icons.Outlined.Insights),
    MITOS("mitos", R.string.tema_mitos, R.string.tema_mitos_cuerpo, Icons.Outlined.Lightbulb),
    DONDE_ACUDIR("donde_acudir", R.string.tema_donde, R.string.tema_donde_cuerpo, Icons.Outlined.LocalHospital);

    val urlImagen: String get() = "${BuildConfig.MEDIA_BASE_URL}info/$id.jpg"

    companion object {
        fun desdeId(id: String?): TemaInfo = entries.firstOrNull { it.id == id } ?: QUE_ES
    }
}
