package com.example.guiame.ui.screens.autoexamen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.LocalHospital
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.guiame.R
import com.example.guiame.ui.components.BotonPrincipal
import com.example.guiame.ui.components.BotonSecundario
import com.example.guiame.ui.components.IconoCircular
import com.example.guiame.ui.components.TarjetaRosa
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoPrincipal
import com.example.guiame.ui.theme.TextoSecundario
import com.example.guiame.ui.viewmodel.AutoexamenUiState

@Composable
fun ResultadoScreen(
    estado: AutoexamenUiState,
    onVolverInicio: () -> Unit,
    onDondeAcudir: () -> Unit,
    onReintentar: () -> Unit
) {
    Column(
        Modifier
            .fillMaxSize()
            .background(Blanco)
            .systemBarsPadding()
    ) {
        Column(
            Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            IconoCircular(
                if (estado.hayCambios) Icons.Outlined.LocalHospital else Icons.Outlined.CheckCircle,
                tamano = 112.dp
            )
            Text(
                stringResource(R.string.resultado_titulo),
                style = MaterialTheme.typography.headlineSmall,
                color = TextoPrincipal,
                textAlign = TextAlign.Center
            )
            Text(
                stringResource(if (estado.hayCambios) R.string.resultado_con_cambios else R.string.resultado_sin_cambios),
                style = MaterialTheme.typography.bodyLarge,
                color = TextoSecundario,
                textAlign = TextAlign.Center
            )

            if (estado.hayCambios) {
                BotonSecundario(
                    texto = stringResource(R.string.ver_donde_acudir),
                    onClick = onDondeAcudir,
                    icono = Icons.Outlined.LocalHospital
                )
            }

            Spacer(Modifier.height(4.dp))

            // Reporte generado por Vertex AI en el backend
            TarjetaRosa {
                Text(stringResource(R.string.reporte_titulo), style = MaterialTheme.typography.titleMedium, color = TextoPrincipal)
                Spacer(Modifier.height(8.dp))
                val reporte = estado.resultado?.reporte
                val guardado = estado.resultado?.guardado == true
                when {
                    estado.enviando -> Row(verticalAlignment = Alignment.CenterVertically) {
                        CircularProgressIndicator(color = RosaPrincipal, strokeWidth = 2.dp, modifier = Modifier.size(20.dp))
                        Spacer(Modifier.width(12.dp))
                        Text(stringResource(R.string.reporte_cargando), color = TextoSecundario)
                    }
                    reporte != null -> {
                        Text(reporte, style = MaterialTheme.typography.bodyMedium, color = TextoPrincipal)
                        Spacer(Modifier.height(8.dp))
                        Text(
                            stringResource(if (guardado) R.string.reporte_guardado else R.string.reporte_sin_sesion),
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextoSecundario
                        )
                    }
                    else -> {
                        Text(stringResource(R.string.reporte_error), color = TextoSecundario)
                        TextButton(onClick = onReintentar) {
                            Text(stringResource(R.string.reintentar), color = RosaPrincipal)
                        }
                    }
                }
            }

            Text(
                stringResource(R.string.aviso_medico),
                style = MaterialTheme.typography.bodyMedium,
                color = TextoSecundario,
                textAlign = TextAlign.Center
            )
        }

        BotonPrincipal(
            texto = stringResource(R.string.volver_inicio),
            onClick = onVolverInicio,
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 16.dp)
        )
    }
}
