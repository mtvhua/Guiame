package com.example.guiame.ui.components

import androidx.annotation.DrawableRes
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import com.example.guiame.R
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.RosaBorde
import com.example.guiame.ui.theme.RosaFondo
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoPrincipal
import com.example.guiame.ui.theme.TextoSecundario

val FormaTarjeta = RoundedCornerShape(20.dp)
val FormaBoton = RoundedCornerShape(18.dp)
val BordeRosa = BorderStroke(2.dp, RosaBorde)

/** Botón de acción principal: relleno rosa con texto blanco; rosa pálido si está desactivado. */
@Composable
fun BotonPrincipal(
    texto: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        shape = FormaBoton,
        colors = ButtonDefaults.buttonColors(
            containerColor = RosaPrincipal,
            contentColor = Blanco,
            disabledContainerColor = RosaBorde,
            disabledContentColor = Blanco
        ),
        elevation = null,
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
    ) {
        Text(texto, style = MaterialTheme.typography.labelLarge)
    }
}

/** Botón secundario: blanco con borde rosa de 2 dp. */
@Composable
fun BotonSecundario(
    texto: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icono: ImageVector? = null
) {
    OutlinedButton(
        onClick = onClick,
        shape = FormaBoton,
        border = BordeRosa,
        colors = ButtonDefaults.outlinedButtonColors(
            containerColor = Blanco,
            contentColor = TextoPrincipal
        ),
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
    ) {
        if (icono != null) {
            Icon(icono, contentDescription = null, tint = RosaPrincipal, modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(8.dp))
        }
        Text(texto, style = MaterialTheme.typography.labelLarge)
    }
}

/** Tarjeta plana con borde rosa y esquinas de 20 dp. */
@Composable
fun TarjetaRosa(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    fondo: androidx.compose.ui.graphics.Color = Blanco,
    contenido: @Composable ColumnScope.() -> Unit
) {
    if (onClick != null) {
        Surface(
            onClick = onClick,
            shape = FormaTarjeta,
            color = fondo,
            border = BordeRosa,
            modifier = modifier.fillMaxWidth()
        ) {
            Column(Modifier.padding(20.dp), content = contenido)
        }
    } else {
        Surface(
            shape = FormaTarjeta,
            color = fondo,
            border = BordeRosa,
            modifier = modifier.fillMaxWidth()
        ) {
            Column(Modifier.padding(20.dp), content = contenido)
        }
    }
}

/** Opción de respuesta en forma de pill, de ancho completo. */
@Composable
fun OpcionPill(
    texto: String,
    seleccionada: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        shape = CircleShape,
        color = if (seleccionada) RosaFondo else Blanco,
        border = BorderStroke(2.dp, if (seleccionada) RosaPrincipal else RosaBorde),
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(
                texto,
                style = MaterialTheme.typography.labelLarge,
                color = TextoPrincipal
            )
        }
    }
}

/** Campo de texto con bordes rosa y esquinas redondeadas. */
@Composable
fun CampoTexto(
    valor: String,
    onValorChange: (String) -> Unit,
    etiqueta: String,
    icono: ImageVector,
    modifier: Modifier = Modifier,
    tipoTeclado: KeyboardType = KeyboardType.Text,
    esContrasena: Boolean = false
) {
    var mostrar by rememberSaveable { mutableStateOf(false) }
    OutlinedTextField(
        value = valor,
        onValueChange = onValorChange,
        label = { Text(etiqueta) },
        leadingIcon = { Icon(icono, contentDescription = null, tint = RosaPrincipal) },
        trailingIcon = if (esContrasena) {
            {
                IconButton(onClick = { mostrar = !mostrar }) {
                    Icon(
                        if (mostrar) Icons.Outlined.VisibilityOff else Icons.Outlined.Visibility,
                        contentDescription = stringResource(
                            if (mostrar) R.string.ocultar_contrasena else R.string.mostrar_contrasena
                        ),
                        tint = TextoSecundario
                    )
                }
            }
        } else null,
        visualTransformation = if (esContrasena && !mostrar) PasswordVisualTransformation() else VisualTransformation.None,
        keyboardOptions = KeyboardOptions(keyboardType = tipoTeclado),
        singleLine = true,
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = RosaPrincipal,
            unfocusedBorderColor = RosaBorde,
            focusedLabelColor = RosaPrincipal,
            unfocusedLabelColor = TextoSecundario,
            cursorColor = RosaPrincipal,
            focusedContainerColor = Blanco,
            unfocusedContainerColor = Blanco
        ),
        modifier = modifier.fillMaxWidth()
    )
}

/** Barra de progreso gruesa y redondeada: rosa sobre rosa claro. */
@Composable
fun BarraProgreso(progreso: Float, modifier: Modifier = Modifier) {
    val animado by animateFloatAsState(targetValue = progreso.coerceIn(0f, 1f), label = "progreso")
    Box(
        modifier
            .height(14.dp)
            .clip(CircleShape)
            .background(RosaFondo)
    ) {
        Box(
            Modifier
                .fillMaxHeight()
                .fillMaxWidth(animado)
                .clip(CircleShape)
                .background(RosaPrincipal)
        )
    }
}

/** Título grande en negrita con subtítulo gris. */
@Composable
fun EncabezadoPantalla(titulo: String, subtitulo: String, modifier: Modifier = Modifier) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(titulo, style = MaterialTheme.typography.headlineMedium, color = TextoPrincipal)
        Text(subtitulo, style = MaterialTheme.typography.bodyLarge, color = TextoSecundario)
    }
}

/** Barra superior simple con flecha de regreso. */
@Composable
fun BarraRegreso(titulo: String, onBack: () -> Unit, modifier: Modifier = Modifier) {
    Row(
        modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onBack) {
            Icon(
                Icons.AutoMirrored.Outlined.ArrowBack,
                contentDescription = stringResource(R.string.regresar),
                tint = RosaPrincipal
            )
        }
        Text(titulo, style = MaterialTheme.typography.titleLarge, color = TextoPrincipal)
    }
}

/** Icono de línea rosa dentro de un círculo rosa claro. */
@Composable
fun IconoCircular(icono: ImageVector, tamano: Dp = 64.dp, modifier: Modifier = Modifier) {
    Box(
        modifier
            .size(tamano)
            .clip(CircleShape)
            .background(RosaFondo),
        contentAlignment = Alignment.Center
    ) {
        Icon(icono, contentDescription = null, tint = RosaPrincipal, modifier = Modifier.size(tamano * 0.5f))
    }
}

/**
 * Recuadro con borde rosa para GIF o imagen que viene de Cloud Storage.
 * Si no hay internet o el archivo no existe, muestra la imagen local [respaldo].
 */
@Composable
fun RecuadroMultimedia(
    url: String,
    descripcion: String,
    modifier: Modifier = Modifier,
    @DrawableRes respaldo: Int? = null,
    alto: Dp = 200.dp
) {
    val painterRespaldo = respaldo?.let { painterResource(it) }
    var fallo by remember(url) { mutableStateOf(false) }
    if (fallo && painterRespaldo == null) return

    Box(
        modifier
            .fillMaxWidth()
            .height(alto)
            .clip(FormaTarjeta)
            .border(BordeRosa, FormaTarjeta)
            .background(Blanco),
        contentAlignment = Alignment.Center
    ) {
        AsyncImage(
            model = url,
            contentDescription = descripcion,
            placeholder = painterRespaldo,
            error = painterRespaldo,
            onError = { fallo = true },
            contentScale = ContentScale.Fit,
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight()
                .padding(12.dp)
        )
    }
}
