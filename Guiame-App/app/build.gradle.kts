import java.util.Properties

// La URL del backend se lee de local.properties (no se sube a Git). Debe terminar en "/":
//   guiame.api.url=https://guiame-api-xxxxx-ue.a.run.app/api/    (mientras desarrollas: URL de Cloud Run)
//   guiame.api.url=https://TU-DOMINIO/api/                       (al final: Cloud Load Balancing)
// Los GIF e imágenes NO se piden directo a Cloud Storage (el bucket es privado):
// la app los pide al backend en <api>/media/... y el backend los entrega desde guiameapp-media.
val localProperties = Properties()
val localPropertiesFile = rootProject.file("local.properties")
if (localPropertiesFile.exists()) {
    localProperties.load(localPropertiesFile.inputStream())
}
// 10.0.2.2 es tu computadora vista desde el emulador (backend corriendo local en el puerto 8080)
val apiUrl = localProperties.getProperty("guiame.api.url") ?: "http://10.0.2.2:8080/"
val mediaUrl = apiUrl + "media/"

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.guiame"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.guiame"
        minSdk = 24
        targetSdk = 36
        versionCode = 2
        versionName = "2.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        buildConfigField("String", "API_BASE_URL", "\"$apiUrl\"")
        buildConfigField("String", "MEDIA_BASE_URL", "\"$mediaUrl\"")
    }

    androidResources {
        // Genera la lista de idiomas (es, quc) para el selector de idioma por app
        generateLocaleConfig = true
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.work.runtime.ktx)

    // API REST (Cloud Run detrás de Cloud Load Balancing)
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.gson)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)

    // Imágenes y GIF desde Cloud Storage
    implementation(libs.coil.compose)
    implementation(libs.coil.network.okhttp)
    implementation(libs.coil.gif)

    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
