package com.example.guiame.ui.screens.perfil

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Cake
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.guiame.R
import com.example.guiame.domain.model.AuthState
import com.example.guiame.ui.components.BarraRegreso
import com.example.guiame.ui.components.BotonPrincipal
import com.example.guiame.ui.components.CampoTexto
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.ErrorSuave
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoSecundario
import com.example.guiame.ui.util.texto
import com.example.guiame.ui.viewmodel.AuthViewModel

@Composable
fun RegistroScreen(viewModel: AuthViewModel, onBack: () -> Unit) {
    val authState by viewModel.authState.collectAsState()
    val formulario by viewModel.formulario.collectAsState()
    var nombre by rememberSaveable { mutableStateOf("") }
    var edad by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }

    // Al crear la cuenta la sesión queda iniciada: regresar a Perfil
    LaunchedEffect(authState) {
        if (authState is AuthState.Authenticated) onBack()
    }

    Column(
        Modifier
            .fillMaxSize()
            .background(Blanco)
            .systemBarsPadding()
            .imePadding()
    ) {
        BarraRegreso(titulo = stringResource(R.string.crear_cuenta), onBack = onBack)
        Column(
            Modifier
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(stringResource(R.string.registro_subtitulo), style = MaterialTheme.typography.bodyMedium, color = TextoSecundario)
            CampoTexto(nombre, { nombre = it }, stringResource(R.string.campo_nombre), Icons.Outlined.Person)
            CampoTexto(edad, { edad = it.filter(Char::isDigit).take(3) }, stringResource(R.string.campo_edad), Icons.Outlined.Cake, tipoTeclado = KeyboardType.Number)
            CampoTexto(email, { email = it }, stringResource(R.string.campo_correo), Icons.Outlined.Email, tipoTeclado = KeyboardType.Email)
            CampoTexto(password, { password = it }, stringResource(R.string.campo_contrasena), Icons.Outlined.Lock, tipoTeclado = KeyboardType.Password, esContrasena = true)
            Text(stringResource(R.string.registro_nota_contrasena), style = MaterialTheme.typography.bodyMedium, color = TextoSecundario)

            formulario.error?.let {
                Text(stringResource(it.texto()), color = ErrorSuave, style = MaterialTheme.typography.bodyMedium)
            }

            Spacer(Modifier.height(4.dp))
            if (formulario.cargando) {
                Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = RosaPrincipal)
                }
            } else {
                BotonPrincipal(
                    stringResource(R.string.crear_cuenta),
                    onClick = { viewModel.registrar(nombre, edad, email, password) },
                    modifier = Modifier.padding(bottom = 24.dp)
                )
            }
        }
    }
}
