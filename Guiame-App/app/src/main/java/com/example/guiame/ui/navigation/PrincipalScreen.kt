package com.example.guiame.ui.navigation

import androidx.annotation.StringRes
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.MenuBook
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.example.guiame.R
import com.example.guiame.ui.screens.informacion.InformacionScreen
import com.example.guiame.ui.screens.informacion.TemaInfo
import com.example.guiame.ui.screens.inicio.InicioScreen
import com.example.guiame.ui.screens.perfil.PerfilScreen
import com.example.guiame.ui.theme.Blanco
import com.example.guiame.ui.theme.RosaBorde
import com.example.guiame.ui.theme.RosaFondo
import com.example.guiame.ui.theme.RosaPrincipal
import com.example.guiame.ui.theme.TextoSecundario
import com.example.guiame.ui.viewmodel.AuthViewModel

enum class Pestana(@StringRes val etiqueta: Int, val icono: ImageVector) {
    INICIO(R.string.tab_inicio, Icons.Outlined.Home),
    INFORMACION(R.string.tab_informacion, Icons.AutoMirrored.Outlined.MenuBook),
    PERFIL(R.string.tab_perfil, Icons.Outlined.Person)
}

/** Pantalla con la barra inferior de 3 pestañas: Inicio, Información y Perfil. */
@Composable
fun PrincipalScreen(
    authViewModel: AuthViewModel,
    onIniciarAutoexamen: () -> Unit,
    onTemaClick: (TemaInfo) -> Unit,
    onCrearCuenta: () -> Unit,
    onMisAutoexamenes: () -> Unit,
    onRecordatorios: () -> Unit,
    onIdioma: () -> Unit
) {
    var pestanaIndex by rememberSaveable { mutableIntStateOf(Pestana.INICIO.ordinal) }
    val pestana = Pestana.entries[pestanaIndex]

    Scaffold(
        containerColor = Blanco,
        bottomBar = {
            NavigationBar(
                containerColor = Blanco,
                tonalElevation = 0.dp,
                modifier = Modifier.drawBehind {
                    // Borde superior rosa fino
                    drawLine(RosaBorde, Offset(0f, 0f), Offset(size.width, 0f), strokeWidth = 1.dp.toPx())
                }
            ) {
                Pestana.entries.forEach { item ->
                    NavigationBarItem(
                        selected = item == pestana,
                        onClick = { pestanaIndex = item.ordinal },
                        icon = { Icon(item.icono, contentDescription = null) },
                        label = { Text(stringResource(item.etiqueta)) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = RosaPrincipal,
                            selectedTextColor = RosaPrincipal,
                            indicatorColor = RosaFondo,
                            unselectedIconColor = TextoSecundario,
                            unselectedTextColor = TextoSecundario
                        )
                    )
                }
            }
        }
    ) { padding ->
        Box(
            Modifier
                .padding(padding)
                .fillMaxSize()
        ) {
            when (pestana) {
                Pestana.INICIO -> InicioScreen(onIniciarAutoexamen = onIniciarAutoexamen)
                Pestana.INFORMACION -> InformacionScreen(onTemaClick = onTemaClick)
                Pestana.PERFIL -> PerfilScreen(
                    viewModel = authViewModel,
                    onCrearCuenta = onCrearCuenta,
                    onMisAutoexamenes = onMisAutoexamenes,
                    onRecordatorios = onRecordatorios,
                    onIdioma = onIdioma
                )
            }
        }
    }
}
