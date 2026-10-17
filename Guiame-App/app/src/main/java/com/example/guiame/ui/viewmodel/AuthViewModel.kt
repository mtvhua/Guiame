package com.example.guiame.ui.viewmodel

import android.util.Patterns
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory.Companion.APPLICATION_KEY
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.guiame.GuiameApplication
import com.example.guiame.domain.model.AppException
import com.example.guiame.domain.model.AuthState
import com.example.guiame.domain.model.ErrorApp
import com.example.guiame.domain.repository.IAuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class FormularioUiState(
    val cargando: Boolean = false,
    val error: ErrorApp? = null
)

class AuthViewModel(
    private val authRepository: IAuthRepository
) : ViewModel() {

    val authState: StateFlow<AuthState> = authRepository.authState
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), AuthState.Loading)

    private val _formulario = MutableStateFlow(FormularioUiState())
    val formulario: StateFlow<FormularioUiState> = _formulario.asStateFlow()

    init {
        // Actualiza nombre/edad desde Cloud SQL si ya había sesión guardada
        viewModelScope.launch { authRepository.refrescarPerfil() }
    }

    fun iniciarSesion(email: String, password: String) {
        val error = when {
            email.isBlank() || password.isBlank() -> ErrorApp.CAMPOS_INCOMPLETOS
            !esCorreoValido(email) -> ErrorApp.CORREO_INVALIDO
            else -> null
        }
        if (error != null) {
            _formulario.update { it.copy(error = error) }
            return
        }
        ejecutar { authRepository.iniciarSesion(email, password).map { } }
    }

    fun registrar(nombre: String, edadTexto: String, email: String, password: String) {
        val edad = edadTexto.trim().toIntOrNull()
        val error = when {
            nombre.isBlank() || edadTexto.isBlank() || email.isBlank() || password.isBlank() ->
                ErrorApp.CAMPOS_INCOMPLETOS
            edad == null || edad !in 10..110 -> ErrorApp.EDAD_INVALIDA
            !esCorreoValido(email) -> ErrorApp.CORREO_INVALIDO
            password.length < 8 -> ErrorApp.CONTRASENA_CORTA
            else -> null
        }
        if (error != null || edad == null) {
            _formulario.update { it.copy(error = error) }
            return
        }
        ejecutar { authRepository.registrar(nombre, edad, email, password).map { } }
    }

    fun cerrarSesion() {
        viewModelScope.launch { authRepository.cerrarSesion() }
    }

    fun limpiarError() {
        _formulario.update { it.copy(error = null) }
    }

    private fun ejecutar(accion: suspend () -> Result<Unit>) {
        viewModelScope.launch {
            _formulario.value = FormularioUiState(cargando = true)
            val resultado = accion()
            _formulario.value = FormularioUiState(
                cargando = false,
                error = (resultado.exceptionOrNull() as? AppException)?.tipo
                    ?: if (resultado.isFailure) ErrorApp.SERVIDOR else null
            )
        }
    }

    private fun esCorreoValido(email: String) =
        Patterns.EMAIL_ADDRESS.matcher(email.trim()).matches()

    companion object {
        val Factory = viewModelFactory {
            initializer {
                val app = this[APPLICATION_KEY] as GuiameApplication
                AuthViewModel(app.container.authRepository)
            }
        }
    }
}
