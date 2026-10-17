package com.example.guiame.di

import android.content.Context
import com.example.guiame.BuildConfig
import com.example.guiame.data.local.PreferenciasStore
import com.example.guiame.data.local.TokenStore
import com.example.guiame.data.remote.AuthInterceptor
import com.example.guiame.data.remote.GuiameApi
import com.example.guiame.data.remote.RefreshApi
import com.example.guiame.data.remote.TokenAuthenticator
import com.example.guiame.data.repository.AuthRepository
import com.example.guiame.data.repository.ExamenRepository
import com.example.guiame.domain.repository.IAuthRepository
import com.example.guiame.domain.repository.IExamenRepository
import com.example.guiame.worker.ReminderScheduler
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Inyección de dependencias manual: se crea una sola vez en [com.example.guiame.GuiameApplication]
 * y los ViewModels reciben solo interfaces (MVVM).
 */
class AppContainer(context: Context) {

    val tokenStore = TokenStore(context)
    val preferencias = PreferenciasStore(context)
    val reminderScheduler = ReminderScheduler(context)

    private val logging = HttpLoggingInterceptor().apply {
        // Nunca registrar cuerpos: llevan contraseñas y datos de salud
        level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BASIC else HttpLoggingInterceptor.Level.NONE
    }

    private val baseClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        // Vertex AI puede tardar varios segundos en generar el reporte
        .readTimeout(45, TimeUnit.SECONDS)
        .addInterceptor(logging)
        .build()

    private val refreshApi: RefreshApi = Retrofit.Builder()
        .baseUrl(BuildConfig.API_BASE_URL)
        .client(baseClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(RefreshApi::class.java)

    private val apiClient = baseClient.newBuilder()
        .addInterceptor(AuthInterceptor(tokenStore))
        .authenticator(TokenAuthenticator(tokenStore, refreshApi))
        .build()

    private val api: GuiameApi = Retrofit.Builder()
        .baseUrl(BuildConfig.API_BASE_URL)
        .client(apiClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(GuiameApi::class.java)

    val authRepository: IAuthRepository = AuthRepository(api, tokenStore)
    val examenRepository: IExamenRepository = ExamenRepository(api)
}
