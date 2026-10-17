package com.example.guiame.ui.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.guiame.ui.screens.autoexamen.AutoexamenFlowScreen
import com.example.guiame.ui.screens.informacion.InfoDetalleScreen
import com.example.guiame.ui.screens.informacion.TemaInfo
import com.example.guiame.ui.screens.perfil.IdiomaScreen
import com.example.guiame.ui.screens.perfil.MisAutoexamenesScreen
import com.example.guiame.ui.screens.perfil.RecordatoriosScreen
import com.example.guiame.ui.screens.perfil.RegistroScreen
import com.example.guiame.ui.viewmodel.AuthViewModel

/**
 * La app abre directo en Inicio; ya no hace falta iniciar sesión para usarla.
 * La sesión solo se pide en la pestaña Perfil para guardar el historial.
 */
@Composable
fun GuiameNavHost() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = Rutas.PRINCIPAL) {

        composable(Rutas.PRINCIPAL) {
            val authViewModel: AuthViewModel = viewModel(factory = AuthViewModel.Factory)
            PrincipalScreen(
                authViewModel = authViewModel,
                onIniciarAutoexamen = { navController.navigate(Rutas.AUTOEXAMEN) },
                onTemaClick = { navController.navigate(Rutas.info(it.id)) },
                onCrearCuenta = { navController.navigate(Rutas.REGISTRO) },
                onMisAutoexamenes = { navController.navigate(Rutas.MIS_AUTOEXAMENES) },
                onRecordatorios = { navController.navigate(Rutas.RECORDATORIOS) },
                onIdioma = { navController.navigate(Rutas.IDIOMA) }
            )
        }

        composable(Rutas.AUTOEXAMEN) {
            AutoexamenFlowScreen(
                onSalir = { navController.popBackStack() },
                onDondeAcudir = {
                    navController.navigate(Rutas.info(TemaInfo.DONDE_ACUDIR.id)) {
                        popUpTo(Rutas.PRINCIPAL)
                    }
                }
            )
        }

        composable(
            route = Rutas.INFO,
            arguments = listOf(navArgument("tema") { type = NavType.StringType })
        ) { entry ->
            InfoDetalleScreen(
                tema = TemaInfo.desdeId(entry.arguments?.getString("tema")),
                onBack = { navController.popBackStack() }
            )
        }

        composable(Rutas.REGISTRO) {
            val authViewModel: AuthViewModel = viewModel(factory = AuthViewModel.Factory)
            RegistroScreen(viewModel = authViewModel, onBack = { navController.popBackStack() })
        }

        composable(Rutas.MIS_AUTOEXAMENES) {
            MisAutoexamenesScreen(onBack = { navController.popBackStack() })
        }

        composable(Rutas.RECORDATORIOS) {
            RecordatoriosScreen(onBack = { navController.popBackStack() })
        }

        composable(Rutas.IDIOMA) {
            IdiomaScreen(onBack = { navController.popBackStack() })
        }
    }
}
