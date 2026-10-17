package com.example.guiame.data.repository

import com.example.guiame.data.local.Sesion
import com.example.guiame.data.local.TokenStore
import com.example.guiame.data.remote.GuiameApi
import com.example.guiame.data.remote.dto.LoginRequest
import com.example.guiame.data.remote.dto.RefreshRequest
import com.example.guiame.data.remote.dto.RegistroRequest
import com.example.guiame.data.remote.dto.TokenResponse
import com.example.guiame.data.remote.llamarApi
import com.example.guiame.domain.model.AppException
import com.example.guiame.domain.model.AuthState
import com.example.guiame.domain.model.ErrorApp
import com.example.guiame.domain.model.Usuario
import com.example.guiame.domain.repository.IAuthRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

/** Autenticación propia contra el backend (JWT firmado con una clave de Secret Manager). */
class AuthRepository(
    private val api: GuiameApi,
    private val tokenStore: TokenStore
) : IAuthRepository {

    override val authState: Flow<AuthState> = tokenStore.sesion.map { sesion ->
        if (sesion != null) AuthState.Authenticated(sesion.usuario) else AuthState.Unauthenticated
    }

    override suspend fun iniciarSesion(email: String, password: String): Result<Usuario> =
        llamarApi { api.iniciarSesion(LoginRequest(email.trim(), password)) }
            .mapCatching { guardarSesion(it) }

    override suspend fun registrar(
        nombre: String,
        edad: Int,
        email: String,
        password: String
    ): Result<Usuario> =
        llamarApi { api.registrar(RegistroRequest(nombre.trim(), edad, email.trim(), password)) }
            .mapCatching { guardarSesion(it) }

    override suspend fun refrescarPerfil(): Result<Usuario> {
        if (tokenStore.sesionActual() == null) return Result.failure(AppException(ErrorApp.SESION_EXPIRADA))
        return llamarApi { api.obtenerPerfil().toDomain() }
            .onSuccess { tokenStore.actualizarUsuario(it) }
    }

    override suspend fun cerrarSesion() {
        val refresh = tokenStore.sesionActual()?.refreshToken
        // Primero se borra local para que la UI responda aunque no haya internet
        tokenStore.borrar()
        if (refresh != null) {
            llamarApi { api.cerrarSesion(RefreshRequest(refresh)) }
        }
    }

    private fun guardarSesion(respuesta: TokenResponse): Usuario {
        val access = respuesta.accessToken
        val refresh = respuesta.refreshToken
        val usuario = respuesta.usuario?.toDomain()
        if (access.isNullOrBlank() || refresh.isNullOrBlank() || usuario == null) {
            throw AppException(ErrorApp.SERVIDOR)
        }
        tokenStore.guardar(Sesion(access, refresh, usuario))
        return usuario
    }
}
