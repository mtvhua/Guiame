package com.example.guiame.worker

import android.content.Context
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

/** Programa (o cancela) el recordatorio mensual del autoexamen. */
class ReminderScheduler(private val context: Context) {

    fun activar() {
        val request = PeriodicWorkRequestBuilder<ReminderWorker>(30, TimeUnit.DAYS).build()
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            NOMBRE,
            ExistingPeriodicWorkPolicy.UPDATE,
            request
        )
    }

    fun desactivar() {
        WorkManager.getInstance(context).cancelUniqueWork(NOMBRE)
    }

    private companion object {
        const val NOMBRE = "AutoexamenReminder"
    }
}
