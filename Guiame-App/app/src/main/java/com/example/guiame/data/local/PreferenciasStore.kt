package com.example.guiame.data.local

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/** Preferencias locales que no necesitan ir a la nube. */
class PreferenciasStore(context: Context) {

    private val prefs = context.getSharedPreferences("guiame_preferencias", Context.MODE_PRIVATE)
    private val _recordatorioActivo = MutableStateFlow(prefs.getBoolean(RECORDATORIO, false))
    val recordatorioActivo: StateFlow<Boolean> = _recordatorioActivo.asStateFlow()

    fun guardarRecordatorio(activo: Boolean) {
        prefs.edit().putBoolean(RECORDATORIO, activo).apply()
        _recordatorioActivo.value = activo
    }

    private companion object {
        const val RECORDATORIO = "recordatorio_activo"
    }
}
