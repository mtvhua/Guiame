package com.example.guiame.ui.screens.perfil

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.guiame.R
import com.example.guiame.domain.model.ReporteExamen
import com.example.guiame.ui.components.BarraRegreso
import com.example.guiame.ui.components.TarjetaRosa
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.RosaFondo
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoPrincipal
import com.example.guiame.ui.theme.TextoSecundario
import com.example.guiame.ui.util.texto
import com.example.guiame.ui.viewmodel.HistorialViewModel
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.Locale

@Composable
fun MisAutoexamenesScreen(
    onBack: () -> Unit,
    viewModel: HistorialViewModel = viewModel(factory = HistorialViewModel.Factory)
) {
    val estado by viewModel.uiState.collectAsState()

    Column(
        Modifier
            .fillMaxSize()
            .background(Blanco)
            .systemBarsPadding()
    ) {
        BarraRegreso(titulo = stringResource(R.string.opcion_mis_autoexamenes), onBack = onBack)

        val error = estado.error
        when {
            estado.cargando -> Centrado { CircularProgressIndicator(color = RosaPrincipal) }
            error != null -> Centrado {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(stringResource(error.texto()), color = TextoSecundario, textAlign = TextAlign.Center)
                    TextButton(onClick = viewModel::cargar) {
                        Text(stringResource(R.string.reintentar), color = RosaPrincipal)
                    }
                }
            }
            estado.examenes.isEmpty() -> Centrado {
                Text(stringResource(R.string.historial_vacio), color = TextoSecundario, textAlign = TextAlign.Center)
            }
            else -> LazyColumn(
                contentPadding = PaddingValues(horizontal = 24.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(estado.examenes, key = { it.id }) { examen -> TarjetaExamen(examen) }
            }
        }
    }
}

@Composable
private fun Centrado(contenido: @Composable () -> Unit) {
    Box(
        Modifier
            .fillMaxSize()
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) { contenido() }
}

@Composable
private fun TarjetaExamen(examen: ReporteExamen) {
    var expandida by rememberSaveable(examen.id) { mutableStateOf(false) }
    TarjetaRosa(onClick = { expandida = !expandida }) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                formatearFecha(examen.fecha),
                style = MaterialTheme.typography.titleMedium,
                color = TextoPrincipal,
                modifier = Modifier.weight(1f)
            )
            Text(
                stringResource(if (examen.tieneAlertas) R.string.historial_con_cambios else R.string.historial_sin_cambios),
                style = MaterialTheme.typography.bodyMedium,
                color = if (examen.tieneAlertas) RosaPrincipal else TextoSecundario,
                modifier = Modifier
                    .background(if (examen.tieneAlertas) RosaFondo else Blanco, CircleShape)
                    .padding(horizontal = 12.dp, vertical = 4.dp)
            )
        }
        if (examen.reporte.isNotBlank()) {
            Spacer(Modifier.height(10.dp))
            Text(
                examen.reporte,
                style = MaterialTheme.typography.bodyMedium,
                color = TextoSecundario,
                maxLines = if (expandida) Int.MAX_VALUE else 3,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

/** "2026-10-15T16:00:00Z" -> "15 oct. 2026" (según el idioma del teléfono). */
private fun formatearFecha(iso: String): String = try {
    val fecha = SimpleDateFormat("yyyy-MM-dd", Locale.US).parse(iso.take(10))
    if (fecha != null) DateFormat.getDateInstance(DateFormat.MEDIUM).format(fecha) else iso
} catch (e: Exception) {
    iso
}
