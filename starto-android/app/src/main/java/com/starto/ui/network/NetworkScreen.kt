package com.starto.ui.network

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Search
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
fun NetworkScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F4F0))
            .padding(24.dp)
    ) {
        Text(
            text = "My Network",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            modifier = Modifier.padding(top = 40.dp)
        )
        Text(
            text = "Manage connections and discover new nodes.",
            fontSize = 14.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 4.dp, bottom = 32.dp)
        )

        Surface(
            color = Color.White,
            shape = RoundedCornerShape(12.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
        ) {
            Row(modifier = Modifier.fillMaxWidth()) {
                TabItem("Connections (428)", true, Modifier.weight(1f))
                TabItem("Requests (12)", false, Modifier.weight(1f))
            }
        }

        OutlinedTextField(
            value = "",
            onValueChange = {},
            placeholder = { Text("Search my network...", fontSize = 14.sp) },
            modifier = Modifier.fillMaxWidth().padding(vertical = 24.dp),
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, size = 18.dp) },
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = Color.White, unfocusedContainerColor = Color.White)
        )

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items((1..5).toList()) { i ->
                ConnectionItem(i)
            }
            item { Spacer(modifier = Modifier.height(32.dp)) }
        }
    }
}

@Composable
fun TabItem(label: String, active: Boolean, modifier: Modifier) {
    Surface(
        modifier = modifier,
        color = if (active) Color(0xFF0A0A0A) else Color.Transparent,
        onClick = { /* Switch */ }
    ) {
        Text(
            text = label.uppercase(),
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = if (active) Color.White else Color.Gray,
            modifier = Modifier.padding(vertical = 16.dp),
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )
    }
}

@Composable
fun ConnectionItem(i: Int) {
    Surface(
        color = Color.White,
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(48.dp).clip(CircleShape).background(Color(0xFFF0EFEB)))
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text("Node Connection $i", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text("Engineering Lead • Mumbai", fontSize = 12.sp, color = Color.Gray)
            }
            IconButton(onClick = { /* Chat */ }) {
                Icon(Icons.Default.Message, contentDescription = null, modifier = Modifier.size(20.dp), tint = Color.Black)
            }
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.LightGray)
        }
    }
}
