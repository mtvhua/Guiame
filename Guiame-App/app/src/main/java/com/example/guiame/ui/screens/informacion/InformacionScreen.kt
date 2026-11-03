package com.example.guiame.ui.screens.informacion

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
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

        // Dos botones por fila, de lado a lado (6 temas = 3 filas)
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            TemaInfo.entries.filter { it.enLista }.chunked(2).forEach { fila ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    fila.forEach { tema ->
                        TarjetaTema(
                            tema = tema,
                            onClick = { onTemaClick(tema) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                    // Si la última fila queda con un solo botón, deja el espacio vacío
                    if (fila.size == 1) Spacer(Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun TarjetaTema(tema: TemaInfo, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Surface(
        onClick = onClick,
        modifier = modifier.height(132.dp),
        shape = RoundedCornerShape(24.dp),
        color = Blanco,
        border = BordeRosa
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 12.dp, vertical = 14.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                tema.icono,
                contentDescription = null,
                tint = RosaPrincipal,
                modifier = Modifier.size(40.dp)
            )
            Spacer(Modifier.height(10.dp))
            Text(
                stringResource(tema.titulo),
                style = MaterialTheme.typography.bodyMedium,
                color = TextoPrincipal,
                textAlign = TextAlign.Center,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}