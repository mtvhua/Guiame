package com.example.guiame.ui.screens.autoexamen

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.guiame.R
import com.example.guiame.domain.model.Respuesta
import com.example.guiame.ui.components.BarraProgreso
import com.example.guiame.ui.components.BotonPrincipal
import com.example.guiame.ui.components.OpcionPill
import com.example.guiame.ui.components.RecuadroMultimedia
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoPrincipal
import com.example.guiame.ui.theme.TextoSecundario
import com.example.guiame.ui.viewmodel.AutoexamenViewModel
import com.example.guiame.ui.viewmodel.TOTAL_PASOS
import com.example.guiame.util.IdiomaManager

/** Flujo de pantalla completa, un paso por pantalla (estilo Duolingo). */
@Composable
fun AutoexamenFlowScreen(
    onSalir: () -> Unit,
    onDondeAcudir: () -> Unit,
    viewModel: AutoexamenViewModel = viewModel(factory = AutoexamenViewModel.Factory)
) {
    val estado by viewModel.uiState.collectAsState()
    val idioma = IdiomaManager.idiomaActual().tag

    BackHandler {
        if (!viewModel.regresar()) onSalir()
    }

    if (estado.terminado) {
        ResultadoScreen(
            estado = estado,
            onVolverInicio = onSalir,
            onDondeAcudir = onDondeAcudir,
            onReintentar = { viewModel.reintentarReporte(idioma) }
        )
        return
    }

    val paso = PasosAutoexamen[estado.pasoActual - 1]
    val scroll = rememberScrollState()
    LaunchedEffect(estado.pasoActual) { scroll.scrollTo(0) }

    Column(
        Modifier
            .fillMaxSize()
            .background(Blanco)
            .systemBarsPadding()
    ) {
        // Barra superior: salir, progreso y contador
        Row(
            Modifier
                .fillMaxWidth()
                .padding(start = 8.dp, end = 20.dp, top = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onSalir) {
                Icon(Icons.Outlined.Close, contentDescription = stringResource(R.string.salir), tint = TextoSecundario)
            }
            BarraProgreso(estado.progreso, Modifier.weight(1f))
            Spacer(Modifier.width(12.dp))
            Text(
                stringResource(R.string.contador_pasos, estado.pasoActual, TOTAL_PASOS),
                style = MaterialTheme.typography.labelLarge,
                color = TextoSecundario
            )
        }

        Column(
            Modifier
                .weight(1f)
                .verticalScroll(scroll)
                .padding(horizontal = 24.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                stringResource(R.string.etiqueta_paso, paso.numero),
                style = MaterialTheme.typography.labelMedium,
                color = RosaPrincipal
            )
            Text(stringResource(paso.titulo), style = MaterialTheme.typography.headlineSmall, color = TextoPrincipal)
            RecuadroMultimedia(
                url = paso.urlMedia,
                descripcion = stringResource(paso.titulo),
                respaldo = paso.imagenRespaldo
            )
            Text(stringResource(paso.instruccion), style = MaterialTheme.typography.bodyLarge, color = TextoPrincipal)
            Text(stringResource(paso.pregunta), style = MaterialTheme.typography.titleMedium, color = TextoPrincipal)

            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OpcionPill(stringResource(R.string.respuesta_no), estado.respuestaActual == Respuesta.NO, { viewModel.seleccionar(Respuesta.NO) })
                OpcionPill(stringResource(R.string.respuesta_si), estado.respuestaActual == Respuesta.SI, { viewModel.seleccionar(Respuesta.SI) })
                OpcionPill(stringResource(R.string.respuesta_no_segura), estado.respuestaActual == Respuesta.NO_SEGURA, { viewModel.seleccionar(Respuesta.NO_SEGURA) })
            }
        }

        BotonPrincipal(
            texto = stringResource(if (estado.pasoActual == TOTAL_PASOS) R.string.terminar else R.string.continuar),
            onClick = { viewModel.continuar(idioma) },
            enabled = estado.respuestaActual != null,
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 16.dp)
        )
    }
}
