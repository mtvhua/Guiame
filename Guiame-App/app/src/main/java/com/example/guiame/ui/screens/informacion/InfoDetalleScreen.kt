package com.example.guiame.ui.screens.informacion

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.example.guiame.R
import com.example.guiame.ui.components.BarraRegreso
import com.example.guiame.ui.components.IconoCircular
import com.example.guiame.ui.components.RecuadroMultimedia
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.TextoPrincipal
import com.example.guiame.ui.theme.TextoSecundario

@Composable
fun InfoDetalleScreen(tema: TemaInfo, onBack: () -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .background(Blanco)
            .systemBarsPadding()
    ) {
        BarraRegreso(titulo = stringResource(R.string.info_titulo), onBack = onBack)

        Column(
            Modifier
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            IconoCircular(tema.icono)
            Text(stringResource(tema.titulo), style = MaterialTheme.typography.headlineSmall, color = TextoPrincipal)
            // Imagen opcional desde Cloud Storage; si no existe, no se muestra el recuadro
            RecuadroMultimedia(url = tema.urlImagen, descripcion = stringResource(tema.titulo))
            Text(stringResource(tema.cuerpo), style = MaterialTheme.typography.bodyLarge, color = TextoPrincipal)
            Text(
                stringResource(R.string.aviso_medico),
                style = MaterialTheme.typography.bodyMedium,
                color = TextoSecundario,
                modifier = Modifier.padding(bottom = 24.dp)
            )
        }
    }
}
