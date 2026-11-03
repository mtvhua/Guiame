package com.example.guiame.ui.screens.perfil

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.example.guiame.R
import com.example.guiame.ui.components.BarraRegreso
import com.example.guiame.ui.components.OpcionPill
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.TextoSecundario
import com.example.guiame.util.Idioma
import com.example.guiame.util.IdiomaManager

@Composable
fun IdiomaScreen(onBack: () -> Unit) {
    val actual = IdiomaManager.idiomaActual()

    Column(
        Modifier
            .fillMaxSize()
            .background(Blanco)
            .systemBarsPadding()
    ) {
        BarraRegreso(titulo = stringResource(R.string.opcion_idioma), onBack = onBack)
        Column(
            Modifier.padding(horizontal = 24.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OpcionPill(
                texto = stringResource(R.string.idioma_espanol),
                seleccionada = actual == Idioma.ESPANOL,
                onClick = { if (actual != Idioma.ESPANOL) IdiomaManager.cambiar(Idioma.ESPANOL) }
            )
            OpcionPill(
                texto = stringResource(R.string.idioma_ingles),
                seleccionada = actual == Idioma.INGLES,
                onClick = { if (actual != Idioma.INGLES) IdiomaManager.cambiar(Idioma.INGLES) }
            )
            Text(stringResource(R.string.idioma_nota), style = MaterialTheme.typography.bodyMedium, color = TextoSecundario)
        }
    }
}