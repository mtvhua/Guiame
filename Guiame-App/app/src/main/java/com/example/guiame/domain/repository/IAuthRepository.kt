package com.example.guiame.domain.repository

import com.example.guiame.domain.model.AuthState
import com.example.guiame.domain.model.Usuario
import kotlinx.coroutines.flow.Flow

interface IAuthRepository {
    val authState: Flow<AuthState>
    suspend fun iniciarSesion(email: String, password: String): Result<Usuario>
    suspend fun registrar(nombre: String, edad: Int, email: String, password: String): Result<Usuario>
    suspend fun refrescarPerfil(): Result<Usuario>
    suspend fun cerrarSesion()
}
