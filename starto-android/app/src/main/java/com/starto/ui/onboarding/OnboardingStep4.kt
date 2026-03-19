package com.starto.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Place
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun OnboardingStep4() {
    var city by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F4F0))
            .padding(24.dp)
    ) {
        Text(
            text = "Where are you based?",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            modifier = Modifier.padding(top = 40.dp)
        )
        Text(
            text = "This helps us show you nearby ecosystem nodes.",
            fontSize = 16.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 8.dp, bottom = 32.dp)
        )

        OutlinedTextField(
            value = city,
            onValueChange = { city = it },
            placeholder = { Text("Type your city name...") },
            modifier = Modifier.fillMaxWidth(),
            leadingIcon = { Icon(Icons.Default.Place, contentDescription = null) },
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                focusedBorderColor = Color.Black,
                unfocusedBorderColor = Color(0xFFE0DFDB)
            )
        )

        TextButton(
            onClick = { /* Handle Geolocation */ },
            modifier = Modifier.padding(top = 16.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.LocationOn, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Use my current location", color = Color.Black, fontWeight = FontWeight.Medium)
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        Surface(
            color = Color(0xFFF0EFEB),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().padding(bottom = 32.dp)
        ) {
            Text(
                text = "Starto uses your location to connect you with founders, investors, and resources in your immediate vicinity.",
                fontSize = 13.sp,
                color = Color.Gray,
                modifier = Modifier.padding(16.dp)
            )
        }

        Button(
            onClick = { /* Navigate to Step 5 */ },
            enabled = city.isNotEmpty(),
            modifier = Modifier.fillMaxWidth().height(56.dp).padding(bottom = 8.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0A0A0A)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Continue", color = Color.White)
        }
    }
}
