package com.example.guiame.ui.screens.perfil

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.guiame.R
import com.example.guiame.ui.components.BarraRegreso
import com.example.guiame.ui.components.TarjetaRosa
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.RosaBorde
import com.example.guiame.ui.theme.RosaFondo
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoPrincipal
import com.example.guiame.ui.theme.TextoSecundario
import com.example.guiame.ui.viewmodel.RecordatoriosViewModel

@Composable
fun RecordatoriosScreen(
    onBack: () -> Unit,
    viewModel: RecordatoriosViewModel = viewModel(factory = RecordatoriosViewModel.Factory)
) {
    val context = LocalContext.current
    val activo by viewModel.activo.collectAsState()
    var permisoNegado by rememberSaveable { mutableStateOf(false) }

    val pedirPermiso = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { concedido ->
        permisoNegado = !concedido
        if (concedido) viewModel.cambiar(true)
    }

    fun activar() {
        val necesitaPermiso = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) !=
            PackageManager.PERMISSION_GRANTED
        if (necesitaPermiso) {
            pedirPermiso.launch(Manifest.permission.POST_NOTIFICATIONS)
        } else {
            viewModel.cambiar(true)
        }
    }

    Column(
        Modifier
            .fillMaxSize()
            .background(Blanco)
            .systemBarsPadding()
    ) {
        BarraRegreso(titulo = stringResource(R.string.opcion_recordatorios), onBack = onBack)
        Column(
            Modifier.padding(horizontal = 24.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            TarjetaRosa {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Outlined.Notifications, contentDescription = null, tint = RosaPrincipal)
                    Spacer(Modifier.width(16.dp))
                    Text(
                        stringResource(R.string.recordatorio_mensual),
                        style = MaterialTheme.typography.titleMedium,
                        color = TextoPrincipal,
                        modifier = Modifier.weight(1f)
                    )
                    Switch(
                        checked = activo,
                        onCheckedChange = { if (it) activar() else viewModel.cambiar(false) },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Blanco,
                            checkedTrackColor = RosaPrincipal,
                            uncheckedThumbColor = RosaBorde,
                            uncheckedTrackColor = Blanco,
                            uncheckedBorderColor = RosaBorde
                        )
                    )
                }
                Spacer(Modifier.height(8.dp))
                Text(stringResource(R.string.recordatorio_descripcion), style = MaterialTheme.typography.bodyMedium, color = TextoSecundario)
            }
            TarjetaRosa(fondo = RosaFondo) {
                Text(stringResource(R.string.inicio_recordatorio), style = MaterialTheme.typography.bodyMedium, color = TextoPrincipal)
            }
            if (permisoNegado) {
                Text(stringResource(R.string.recordatorio_sin_permiso), style = MaterialTheme.typography.bodyMedium, color = TextoSecundario)
            }
        }
    }
}
