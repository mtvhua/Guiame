package com.example.guiame.util

import java.util.Calendar
import java.util.GregorianCalendar
import java.util.Locale

/**
 * Convierte día, mes y año escritos por la usuaria en "AAAA-MM-DD".
 * Devuelve null si la fecha no existe (31 de febrero), es futura o la edad no está entre 10 y 110 años.
 * Usa Calendar (no java.time) para funcionar en Android 7 sin configuración extra.
 */
fun fechaNacimientoIso(dia: String, mes: String, anio: String): String? {
    val d = dia.trim().toIntOrNull() ?: return null
    val m = mes.trim().toIntOrNull() ?: return null
    val a = anio.trim().toIntOrNull() ?: return null
    if (anio.trim().length != 4 || m !in 1..12 || d < 1) return null

    val diasDelMes = intArrayOf(
        31, if (GregorianCalendar().isLeapYear(a)) 29 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    )[m - 1]
    if (d > diasDelMes) return null

    val hoy = Calendar.getInstance()
    var edad = hoy.get(Calendar.YEAR) - a
    val mesHoy = hoy.get(Calendar.MONTH) + 1
    val diaHoy = hoy.get(Calendar.DAY_OF_MONTH)
    if (mesHoy < m || (mesHoy == m && diaHoy < d)) edad -= 1
    if (edad !in 10..110) return null

    return String.format(Locale.US, "%04d-%02d-%02d", a, m, d)
}