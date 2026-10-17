package com.example.guiame.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory.Companion.APPLICATION_KEY
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.guiame.GuiameApplication
import com.example.guiame.domain.model.Respuesta
import com.example.guiame.domain.model.ResultadoExamen
import com.example.guiame.domain.repository.IExamenRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

const val TOTAL_PASOS = 7

data class AutoexamenUiState(
    val pasoActual: Int = 1,
    val respuestas: Map<Int, Respuesta> = emptyMap(),
    val terminado: Boolean = false,
    val enviando: Boolean = false,
    val resultado: ResultadoExamen? = null,
    val errorReporte: Boolean = false
) {
    val respuestaActual: Respuesta? get() = respuestas[pasoActual]
    val progreso: Float get() = pasoActual / TOTAL_PASOS.toFloat()
    /** Cualquier "Sí" o "No estoy segura" cuenta como cambio a revisar. */
    val hayCambios: Boolean get() = respuestas.values.any { it != Respuesta.NO }
}

class AutoexamenViewModel(
    private val examenRepository: IExamenRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AutoexamenUiState())
    val uiState: StateFlow<AutoexamenUiState> = _uiState.asStateFlow()

    fun seleccionar(respuesta: Respuesta) {
        _uiState.update { it.copy(respuestas = it.respuestas + (it.pasoActual to respuesta)) }
    }

    fun continuar(idioma: String) {
        val estado = _uiState.value
        if (estado.respuestaActual == null) return
        if (estado.pasoActual < TOTAL_PASOS) {
            _uiState.update { it.copy(pasoActual = it.pasoActual + 1) }
        } else {
            _uiState.update { it.copy(terminado = true) }
            enviar(idioma)
        }
    }

    /** Devuelve false si ya está en el primer paso (la pantalla debe cerrarse). */
    fun regresar(): Boolean {
        val estado = _uiState.value
        if (estado.terminado || estado.pasoActual <= 1) return false
        _uiState.update { it.copy(pasoActual = it.pasoActual - 1) }
        return true
    }

    fun reintentarReporte(idioma: String) = enviar(idioma)

    private fun enviar(idioma: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(enviando = true, errorReporte = false) }
            examenRepository.enviarAutoexamen(_uiState.value.respuestas, idioma)
                .onSuccess { r -> _uiState.update { it.copy(enviando = false, resultado = r) } }
                .onFailure { _uiState.update { it.copy(enviando = false, errorReporte = true) } }
        }
    }

    companion object {
        val Factory = viewModelFactory {
            initializer {
                val app = this[APPLICATION_KEY] as GuiameApplication
                AutoexamenViewModel(app.container.examenRepository)
            }
        }
    }
}
