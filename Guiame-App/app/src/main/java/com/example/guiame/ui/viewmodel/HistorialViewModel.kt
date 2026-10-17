package com.example.guiame.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory.Companion.APPLICATION_KEY
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.guiame.GuiameApplication
import com.example.guiame.domain.model.AppException
import com.example.guiame.domain.model.ErrorApp
import com.example.guiame.domain.model.ReporteExamen
import com.example.guiame.domain.repository.IExamenRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class HistorialUiState(
    val cargando: Boolean = true,
    val examenes: List<ReporteExamen> = emptyList(),
    val error: ErrorApp? = null
)

class HistorialViewModel(
    private val examenRepository: IExamenRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HistorialUiState())
    val uiState: StateFlow<HistorialUiState> = _uiState.asStateFlow()

    init {
        cargar()
    }

    fun cargar() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(cargando = true, error = null)
            examenRepository.obtenerHistorial()
                .onSuccess { _uiState.value = HistorialUiState(cargando = false, examenes = it) }
                .onFailure { e ->
                    _uiState.value = _uiState.value.copy(
                        cargando = false,
                        error = (e as? AppException)?.tipo ?: ErrorApp.SERVIDOR
                    )
                }
        }
    }

    companion object {
        val Factory = viewModelFactory {
            initializer {
                val app = this[APPLICATION_KEY] as GuiameApplication
                HistorialViewModel(app.container.examenRepository)
            }
        }
    }
}
