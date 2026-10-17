package com.example.guiame.domain.model

sealed interface AuthState {
    data object Loading : AuthState
    data class Authenticated(val usuario: Usuario) : AuthState
    data object Unauthenticated : AuthState
}
