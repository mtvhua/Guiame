package com.example.guiame.data.local

import android.content.Context
import com.example.guiame.domain.model.Usuario
import com.google.gson.Gson
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class Sesion(
    val accessToken: String,
    val refreshToken: String,
    val usuario: Usuario
)

/**
 * Guarda la sesión (JWT de acceso, refresh token y datos básicos de la usuaria)
 * cifrada con [KeystoreCipher].
 */
class TokenStore(context: Context) {

    private val prefs = context.getSharedPreferences("guiame_sesion", Context.MODE_PRIVATE)
    private val gson = Gson()
    private val _sesion = MutableStateFlow(leer())
    val sesion: StateFlow<Sesion?> = _sesion.asStateFlow()

    fun sesionActual(): Sesion? = _sesion.value

    @Synchronized
    fun guardar(sesion: Sesion) {
        prefs.edit().putString(CLAVE, KeystoreCipher.cifrar(gson.toJson(sesion))).apply()
        _sesion.value = sesion
    }

    @Synchronized
    fun actualizarUsuario(usuario: Usuario) {
        _sesion.value?.let { guardar(it.copy(usuario = usuario)) }
    }

    @Synchronized
    fun borrar() {
        prefs.edit().remove(CLAVE).apply()
        _sesion.value = null
    }

    private fun leer(): Sesion? {
        val guardado = prefs.getString(CLAVE, null) ?: return null
        val json = KeystoreCipher.descifrar(guardado) ?: return null
        return try {
            gson.fromJson(json, Sesion::class.java)
                ?.takeIf { !it.accessToken.isNullOrBlank() && it.usuario != null }
        } catch (e: Exception) {
            null
        }
    }

    private companion object {
        const val CLAVE = "sesion"
    }
}
