package com.example.guiame.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

// Siempre claro: el diseño pide fondo completamente blanco
private val GuiameColors = lightColorScheme(
    primary = RosaPrincipal,
    onPrimary = Blanco,
    primaryContainer = RosaFondo,
    onPrimaryContainer = TextoPrincipal,
    secondary = RosaPrincipal,
    onSecondary = Blanco,
    background = Blanco,
    onBackground = TextoPrincipal,
    surface = Blanco,
    onSurface = TextoPrincipal,
    surfaceVariant = RosaFondo,
    onSurfaceVariant = TextoSecundario,
    surfaceContainer = Blanco,
    surfaceContainerLow = Blanco,
    surfaceContainerHigh = Blanco,
    outline = RosaBorde,
    outlineVariant = RosaBorde,
    error = ErrorSuave
)

@Composable
fun GuiameTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = GuiameColors,
        typography = Typography,
        content = content
    )
}
