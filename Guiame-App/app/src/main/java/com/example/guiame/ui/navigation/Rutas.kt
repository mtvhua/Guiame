package com.example.guiame.ui.navigation

object Rutas {
    const val PRINCIPAL = "principal"
    const val AUTOEXAMEN = "autoexamen"
    const val INFO = "info/{tema}"
    const val REGISTRO = "registro"
    const val MIS_AUTOEXAMENES = "mis_autoexamenes"
    const val RECORDATORIOS = "recordatorios"
    const val IDIOMA = "idioma"

    fun info(temaId: String) = "info/$temaId"
}
