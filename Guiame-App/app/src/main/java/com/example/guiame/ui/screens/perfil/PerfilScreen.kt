package com.example.guiame.ui.screens.perfil

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.KeyboardArrowRight
import androidx.compose.material.icons.automirrored.outlined.Logout
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.History
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Translate
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.guiame.R
import com.example.guiame.domain.model.AuthState
import com.example.guiame.domain.model.Usuario
import com.example.guiame.ui.components.BotonPrincipal
import com.example.guiame.ui.components.BotonSecundario
import com.example.guiame.ui.components.CampoTexto
import com.example.guiame.ui.components.EncabezadoPantalla
import com.example.guiame.ui.components.TarjetaRosa
import com.example.guiame.ui.theme.ErrorSuave
import com.example.guiame.ui.theme.RosaBorde
import com.example.guiame.ui.theme.RosaFondo
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoPrincipal
import com.example.guiame.ui.theme.TextoSecundario
import com.example.guiame.ui.util.texto
import com.example.guiame.ui.viewmodel.AuthViewModel

@Composable
fun PerfilScreen(
    viewModel: AuthViewModel,
    onCrearCuenta: () -> Unit,
    onMisAutoexamenes: () -> Unit,
    onRecordatorios: () -> Unit,
    onIdioma: () -> Unit
) {
    val authState by viewModel.authState.collectAsState()

    when (val estado = authState) {
        AuthState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = RosaPrincipal)
        }
        AuthState.Unauthenticated -> FormularioLogin(viewModel, onCrearCuenta)
        is AuthState.Authenticated -> PerfilConSesion(
            usuario = estado.usuario,
            onMisAutoexamenes = onMisAutoexamenes,
            onRecordatorios = onRecordatorios,
            onIdioma = onIdioma,
            onCerrarSesion = viewModel::cerrarSesion
        )
    }
}

@Composable
private fun FormularioLogin(viewModel: AuthViewModel, onCrearCuenta: () -> Unit) {
    val formulario by viewModel.formulario.collectAsState()
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }

    LaunchedEffect(Unit) { viewModel.limpiarError() }

    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .imePadding()
            .padding(horizontal = 24.dp, vertical = 32.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        EncabezadoPantalla(
            titulo = stringResource(R.string.perfil_titulo),
            subtitulo = stringResource(R.string.perfil_subtitulo_login)
        )
        Spacer(Modifier.height(8.dp))
        CampoTexto(email, { email = it }, stringResource(R.string.campo_correo), Icons.Outlined.Email, tipoTeclado = KeyboardType.Email)
        CampoTexto(password, { password = it }, stringResource(R.string.campo_contrasena), Icons.Outlined.Lock, tipoTeclado = KeyboardType.Password, esContrasena = true)

        formulario.error?.let {
            Text(stringResource(it.texto()), color = ErrorSuave, style = MaterialTheme.typography.bodyMedium)
        }

        Spacer(Modifier.height(4.dp))
        if (formulario.cargando) {
            Box(Modifier.align(Alignment.CenterHorizontally)) { CircularProgressIndicator(color = RosaPrincipal) }
        } else {
            BotonPrincipal(stringResource(R.string.entrar), onClick = { viewModel.iniciarSesion(email, password) })
        }
        BotonSecundario(stringResource(R.string.crear_cuenta), onClick = onCrearCuenta)
    }
}

@Composable
private fun PerfilConSesion(
    usuario: Usuario,
    onMisAutoexamenes: () -> Unit,
    onRecordatorios: () -> Unit,
    onIdioma: () -> Unit,
    onCerrarSesion: () -> Unit
) {
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp, vertical = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Avatar circular con borde rosa
        Box(
            Modifier
                .size(104.dp)
                .border(3.dp, RosaBorde, CircleShape)
                .padding(6.dp)
                .background(RosaFondo, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Outlined.Person, contentDescription = null, tint = RosaPrincipal, modifier = Modifier.size(52.dp))
        }
        Text(usuario.nombre, style = MaterialTheme.typography.headlineSmall, color = TextoPrincipal)
        Text(usuario.email, style = MaterialTheme.typography.bodyMedium, color = TextoSecundario)
        Spacer(Modifier.height(16.dp))

        OpcionPerfil(Icons.Outlined.History, stringResource(R.string.opcion_mis_autoexamenes), onMisAutoexamenes)
        OpcionPerfil(Icons.Outlined.Notifications, stringResource(R.string.opcion_recordatorios), onRecordatorios)
        OpcionPerfil(Icons.Outlined.Translate, stringResource(R.string.opcion_idioma), onIdioma)
        OpcionPerfil(Icons.AutoMirrored.Outlined.Logout, stringResource(R.string.opcion_cerrar_sesion), onCerrarSesion, mostrarFlecha = false)
    }
}

@Composable
private fun OpcionPerfil(
    icono: ImageVector,
    texto: String,
    onClick: () -> Unit,
    mostrarFlecha: Boolean = true
) {
    TarjetaRosa(onClick = onClick) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(icono, contentDescription = null, tint = RosaPrincipal)
            Spacer(Modifier.width(16.dp))
            Text(texto, style = MaterialTheme.typography.titleMedium, color = TextoPrincipal, modifier = Modifier.weight(1f))
            if (mostrarFlecha) {
                Icon(Icons.AutoMirrored.Outlined.KeyboardArrowRight, contentDescription = null, tint = TextoSecundario)
            }
        }
    }
}
