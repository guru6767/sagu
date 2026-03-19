package com.starto.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF0A0A0A),
    onPrimary = Color.White,
    secondary = Color(0xFFF0EFEB),
    background = Color(0xFFF5F4F0),
    surface = Color.White,
    onSurface = Color(0xFF0A0A0A),
    error = Color(0xFFEF4444)
)

@Composable
fun StartoTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    // Force Light Theme for Premium B&W Aesthetic as per Master Prompt
    val colorScheme = LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}
