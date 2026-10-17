package com.example.guiame.data.remote

import com.example.guiame.data.remote.dto.ExamenDto
import com.example.guiame.data.remote.dto.ExamenRequest
import com.example.guiame.data.remote.dto.ExamenResponse
import com.example.guiame.data.remote.dto.LoginRequest
import com.example.guiame.data.remote.dto.RefreshRequest
import com.example.guiame.data.remote.dto.RegistroRequest
import com.example.guiame.data.remote.dto.TokenResponse
import com.example.guiame.data.remote.dto.UsuarioDto
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

/** API del backend en Cloud Run (se accede por Cloud Load Balancing). */
interface GuiameApi {

    @POST("auth/register")
    suspend fun registrar(@Body body: RegistroRequest): TokenResponse

    @POST("auth/login")
    suspend fun iniciarSesion(@Body body: LoginRequest): TokenResponse

    @POST("auth/logout")
    suspend fun cerrarSesion(@Body body: RefreshRequest): Response<Unit>

    @GET("usuarios/me")
    suspend fun obtenerPerfil(): UsuarioDto

    @POST("examenes")
    suspend fun enviarExamen(@Body body: ExamenRequest): ExamenResponse

    @GET("examenes")
    suspend fun obtenerExamenes(): List<ExamenDto>
}

/** Se usa solo desde [TokenAuthenticator]; es síncrona porque OkHttp ya corre en un hilo de red. */
interface RefreshApi {
    @POST("auth/refresh")
    fun refrescar(@Body body: RefreshRequest): Call<TokenResponse>
}
