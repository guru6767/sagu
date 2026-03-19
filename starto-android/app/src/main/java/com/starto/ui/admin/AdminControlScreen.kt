package com.starto.ui.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun AdminControlScreen() {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F4F0))
            .verticalScroll(scrollState)
            .padding(24.dp)
    ) {
        Surface(
            color = Color(0xFFEF4444),
            shape = RoundedCornerShape(100.dp)
        ) {
            Text(
                text = "ADMIN ACCESS",
                color = Color.White,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
            )
        }

        Text(
            text = "System Control",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            modifier = Modifier.padding(top = 16.dp, bottom = 32.dp)
        )

        Row(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            AdminStatCard("Users", "14.2k", Color(0xFF3B82F6), Modifier.weight(1f))
            AdminStatCard("Revenue", "₹4.8L", Color(0xFF22C55E), Modifier.weight(1f))
        }

        Surface(
            color = Color.White,
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Terminal, contentDescription = null, size = 18.dp, tint = Color.Gray)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("RECENT LOGS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                (1..3).forEach { i ->
                    Row(modifier = Modifier.padding(vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(6.dp).background(Color(0xFF3B82F6), RoundedCornerShape(3.dp)))
                        Spacer(modifier = Modifier.width(12.dp))
                        Text("Node $i signal raised in Pune", fontSize = 13.sp, color = Color.Black)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Surface(
            color = Color(0xFFEF4444).copy(alpha = 0.05f),
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEF4444).copy(alpha = 0.1f))
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Shield, contentDescription = null, size = 18.dp, tint = Color(0xFFEF4444))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("SECURITY ALERTS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFFEF4444))
                }
                Text("2 Active Threats detected in Indiranagar subnet.", fontSize = 14.sp, color = Color.Black, modifier = Modifier.padding(top = 16.dp))
                Button(
                    onClick = { /* Moderate */ },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444)),
                    modifier = Modifier.padding(top = 16.dp).height(40.dp),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Review Threats", fontSize = 12.sp)
                }
            }
        }
        
        Spacer(modifier = Modifier.height(40.dp))
    }
}

@Composable
fun AdminStatCard(label: String, value: String, color: Color, modifier: Modifier) {
    Surface(
        modifier = modifier,
        color = Color.White,
        shape = RoundedCornerShape(20.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(label.uppercase(), fontSize = 10.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.Black, modifier = Modifier.padding(top = 4.dp))
            Box(modifier = Modifier.padding(top = 12.dp).width(24.dp).height(4.dp).background(color, RoundedCornerShape(2.dp)))
        }
    }
}
