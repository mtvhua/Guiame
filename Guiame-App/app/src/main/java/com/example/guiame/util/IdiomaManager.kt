package com.example.guiame.util

import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat

/** Idiomas de la app. "quc" es el código ISO 639-3 de K'iche' (recursos en values-b+quc). */
enum class Idioma(val tag: String) {
    ESPANOL("es"),
    KICHE("quc")
}

object IdiomaManager {

    fun idiomaActual(): Idioma {
        val tag = AppCompatDelegate.getApplicationLocales().toLanguageTags()
        return if (tag.startsWith(Idioma.KICHE.tag)) Idioma.KICHE else Idioma.ESPANOL
    }

    /** Cambia el idioma de la app; la Activity se recrea sola. */
    fun cambiar(idioma: Idioma) {
        AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(idioma.tag))
    }
}
