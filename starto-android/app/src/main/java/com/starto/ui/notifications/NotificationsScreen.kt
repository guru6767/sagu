package com.starto.ui.notifications

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Zap
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Message
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun NotificationsScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F4F0))
            .padding(24.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth().padding(top = 40.dp, bottom = 32.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text("Notifications", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color.Black)
            Text("Mark all read", fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            items(notifs) { notif ->
                NotificationItem(notif)
            }
        }
    }
}

@Composable
fun NotificationItem(notif: Notif) {
    Surface(
        color = Color.White,
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier.size(48.dp).clip(CircleShape).background(notif.color.copy(alpha = 0.1f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(notif.icon, contentDescription = null, size = 20.dp, tint = notif.color)
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(notif.text, fontSize = 14.sp, fontWeight = FontWeight.Medium, lineHeight = 20.sp)
                Text(notif.time, fontSize = 10.sp, color = Color.Gray, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 4.dp))
            }
        }
    }
}

data class Notif(val icon: androidx.compose.ui.graphics.vector.ImageVector, val color: Color, val text: String, val time: String)
val notifs = listOf(
    Notif(Icons.Default.Zap, Color(0xFFEAB308), "Arjun Sharma responded to your signal: \"Need Full-stack Developer...\"", "10m ago"),
    Notif(Icons.Default.PersonAdd, Color(0xFF3B82F6), "Rahul M. sent you a connection request.", "2h ago"),
    Notif(Icons.Default.Message, Color(0xFF0A0A0A), "You have a new message from Node Connection 1.", "4h ago")
)
