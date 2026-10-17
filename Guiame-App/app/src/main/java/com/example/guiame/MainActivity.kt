package com.example.guiame

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.example.guiame.ui.navigation.GuiameNavHost
import com.example.guiame.ui.theme.GuiameTheme

// AppCompatActivity (en vez de ComponentActivity) para poder cambiar el idioma dentro de la app
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            GuiameTheme {
                GuiameNavHost()
            }
        }
    }
}
