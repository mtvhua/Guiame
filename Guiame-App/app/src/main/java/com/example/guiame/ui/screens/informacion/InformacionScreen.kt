package com.example.guiame.ui.screens.informacion

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.example.guiame.R
import com.example.guiame.ui.components.BordeRosa
import com.example.guiame.ui.components.EncabezadoPantalla
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoPrincipal

@Composable
fun InformacionScreen(onTemaClick: (TemaInfo) -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp, vertical = 32.dp)
    ) {
        EncabezadoPantalla(
            titulo = stringResource(R.string.info_titulo),
            subtitulo = stringResource(R.string.info_subtitulo)
        )
        Spacer(Modifier.height(28.dp))

        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            TemaInfo.entries.filter { it.enLista }.forEach { tema ->
                PillTema(tema = tema, onClick = { onTemaClick(tema) })
            }
        }
    }
}

@Composable
private fun PillTema(tema: TemaInfo, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = CircleShape,
        color = Blanco,
        border = BordeRosa
    ) {
        Row(
            Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(tema.icono, contentDescription = null, tint = RosaPrincipal, modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(8.dp))
            Text(stringResource(tema.titulo), style = MaterialTheme.typography.bodyMedium, color = TextoPrincipal)
        }
    }
}