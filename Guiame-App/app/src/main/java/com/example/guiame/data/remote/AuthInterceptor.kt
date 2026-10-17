package com.example.guiame.data.remote

import com.example.guiame.data.local.TokenStore
import okhttp3.Interceptor
import okhttp3.Response

/** Agrega "Authorization: Bearer <token>" a cada petición cuando hay sesión. */
class AuthInterceptor(private val tokenStore: TokenStore) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val token = tokenStore.sesionActual()?.accessToken
        if (token == null || request.url.encodedPath.contains("/auth/")) {
            return chain.proceed(request)
        }
        return chain.proceed(
            request.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
        )
    }
}
