package com.example.guiame.util

import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import java.util.Locale

/** Idiomas de la app: español (por defecto, res/values) e inglés (res/values-en). */
enum class Idioma(val tag: String) {
    ESPANOL("es"),
    INGLES("en")
}

object IdiomaManager {

    fun idiomaActual(): Idioma {
        // Si la usuaria aún no eligió idioma, la app sigue el idioma del teléfono
        val tag = AppCompatDelegate.getApplicationLocales().toLanguageTags()
            .ifEmpty { Locale.getDefault().language }
        return if (tag.startsWith(Idioma.INGLES.tag)) Idioma.INGLES else Idioma.ESPANOL
    }

    /** Cambia el idioma de la app; la Activity se recrea sola. */
    fun cambiar(idioma: Idioma) {
        AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(idioma.tag))
    }
}