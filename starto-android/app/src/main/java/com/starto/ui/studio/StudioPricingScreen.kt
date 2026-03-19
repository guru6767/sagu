package com.starto.ui.studio

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun StudioPricingScreen() {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F4F0))
            .verticalScroll(scrollState)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Go Studio.",
            fontSize = 40.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            modifier = Modifier.padding(top = 48.dp, bottom = 8.dp)
        )
        Text(
            text = "Advanced intelligence for ecosystem power nodes.",
            fontSize = 16.sp,
            color = Color.Gray,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            modifier = Modifier.padding(bottom = 48.dp)
        )

        Surface(
            color = Color(0xFF0A0A0A),
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(32.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("STUDIO", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 24.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Icon(Icons.Default.RocketLaunch, contentDescription = null, tint = Color(0xFFEAB308), size = 24.dp)
                }
                
                Row(modifier = Modifier.padding(top = 16.dp), verticalAlignment = Alignment.Bottom) {
                    Text("₹1,499", color = Color.White, fontSize = 48.sp, fontWeight = FontWeight.ExtraBold)
                    Text("/ mo", color = Color.LightGray, fontSize = 16.sp, modifier = Modifier.padding(bottom = 12.dp, start = 4.dp))
                }

                Divider(color = Color.White.copy(alpha = 0.1f), modifier = Modifier.padding(vertical = 24.dp))

                listOf("Unlimited Signals", "AI Market Explore", "Premium Insights", "Boost Priority", "Verified Node Badge").forEach { feature ->
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 8.dp)) {
                        Icon(Icons.Default.Check, contentDescription = null, tint = Color(0xFF22C55E), size = 18.dp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(feature, color = Color.White, fontSize = 14.sp)
                    }
                }

                Spacer(modifier = Modifier.height(32.dp))

                Button(
                    onClick = { /* Upgrade */ },
                    modifier = Modifier.fillMaxWidth().height(64.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Upgrade to Studio", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }
        }
        
        Spacer(modifier = Modifier.height(40.dp))
    }
}
