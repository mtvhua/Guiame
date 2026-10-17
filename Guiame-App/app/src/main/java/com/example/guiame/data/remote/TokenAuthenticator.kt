package com.example.guiame.data.remote

import com.example.guiame.data.local.Sesion
import com.example.guiame.data.local.TokenStore
import com.example.guiame.data.remote.dto.RefreshRequest
import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

/**
 * Cuando el backend responde 401 (access token vencido), pide uno nuevo con el refresh token
 * y repite la petición. Si el refresh también falla, cierra la sesión local.
 */
class TokenAuthenticator(
    private val tokenStore: TokenStore,
    private val refreshApi: RefreshApi
) : Authenticator {

    override fun authenticate(route: Route?, response: Response): Request? {
        if (response.request.url.encodedPath.contains("/auth/")) return null
        if (responseCount(response) >= 2) return null

        synchronized(this) {
            val sesion = tokenStore.sesionActual() ?: return null
            val tokenEnviado = response.request.header("Authorization")?.removePrefix("Bearer ")

            // Otro hilo ya refrescó el token mientras esperábamos
            if (tokenEnviado != null && tokenEnviado != sesion.accessToken) {
                return response.request.newBuilder()
                    .header("Authorization", "Bearer ${sesion.accessToken}")
                    .build()
            }

            val nueva = try {
                val r = refreshApi.refrescar(RefreshRequest(sesion.refreshToken)).execute()
                r.body()?.takeIf { r.isSuccessful }
            } catch (e: Exception) {
                null
            }

            val access = nueva?.accessToken
            if (access.isNullOrBlank()) {
                tokenStore.borrar()
                return null
            }
            tokenStore.guardar(
                Sesion(
                    accessToken = access,
                    refreshToken = nueva?.refreshToken ?: sesion.refreshToken,
                    usuario = nueva?.usuario?.toDomain() ?: sesion.usuario
                )
            )
            return response.request.newBuilder()
                .header("Authorization", "Bearer $access")
                .build()
        }
    }

    private fun responseCount(response: Response): Int {
        var r: Response? = response
        var count = 1
        while (r?.priorResponse != null) {
            count++
            r = r.priorResponse
        }
        return count
    }
}
