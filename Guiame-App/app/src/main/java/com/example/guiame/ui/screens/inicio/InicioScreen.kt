package com.example.guiame.ui.screens.inicio

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.guiame.R
import com.example.guiame.ui.components.TarjetaRosa
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.RosaBorde
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoPrincipal
import com.example.guiame.ui.theme.TextoSecundario

@Composable
fun InicioScreen(onIniciarAutoexamen: () -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp, vertical = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            stringResource(R.string.app_name),
            style = MaterialTheme.typography.headlineLarge,
            color = TextoPrincipal
        )
        Spacer(Modifier.height(6.dp))
        Text(
            stringResource(R.string.inicio_subtitulo),
            style = MaterialTheme.typography.bodyLarge,
            color = TextoSecundario,
            textAlign = TextAlign.Center
        )

        Spacer(Modifier.height(56.dp))

        // Botón circular grande
        Surface(
            onClick = onIniciarAutoexamen,
            shape = CircleShape,
            color = Blanco,
            border = BorderStroke(6.dp, RosaBorde),
            modifier = Modifier.size(220.dp)
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Icon(
                    Icons.Outlined.FavoriteBorder,
                    contentDescription = null,
                    tint = RosaPrincipal,
                    modifier = Modifier.size(56.dp)
                )
                Spacer(Modifier.height(10.dp))
                Text(
                    stringResource(R.string.inicio_boton),
                    style = MaterialTheme.typography.titleLarge,
                    color = TextoPrincipal
                )
            }
        }

        Spacer(Modifier.height(16.dp))
        Text(
            stringResource(R.string.inicio_duracion),
            style = MaterialTheme.typography.bodyMedium,
            color = TextoSecundario
        )

        Spacer(Modifier.height(56.dp))

        TarjetaRosa {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Outlined.CalendarMonth, contentDescription = null, tint = RosaPrincipal)
                Spacer(Modifier.width(14.dp))
                Text(
                    stringResource(R.string.inicio_recordatorio),
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextoPrincipal
                )
            }
        }
    }
}
