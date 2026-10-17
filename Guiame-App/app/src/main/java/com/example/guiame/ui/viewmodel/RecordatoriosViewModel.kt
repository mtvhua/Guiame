package com.example.guiame.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory.Companion.APPLICATION_KEY
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.guiame.GuiameApplication
import com.example.guiame.data.local.PreferenciasStore
import com.example.guiame.worker.ReminderScheduler
import kotlinx.coroutines.flow.StateFlow

class RecordatoriosViewModel(
    private val preferencias: PreferenciasStore,
    private val scheduler: ReminderScheduler
) : ViewModel() {

    val activo: StateFlow<Boolean> = preferencias.recordatorioActivo

    fun cambiar(activar: Boolean) {
        if (activar) scheduler.activar() else scheduler.desactivar()
        preferencias.guardarRecordatorio(activar)
    }

    companion object {
        val Factory = viewModelFactory {
            initializer {
                val app = this[APPLICATION_KEY] as GuiameApplication
                RecordatoriosViewModel(app.container.preferencias, app.container.reminderScheduler)
            }
        }
    }
}
