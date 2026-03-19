package com.starto.ui.feed

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MySignalsScreen() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Signals", fontWeight = FontWeight.Bold) },
                actions = {
                    Button(
                        onClick = { /* New */ },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0A0A0A)),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 0.dp),
                        modifier = Modifier.height(36.dp).padding(end = 16.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("New", fontSize = 12.sp)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF5F4F0))
            )
        },
        containerColor = Color(0xFFF5F4F0)
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding).padding(horizontal = 16.dp)) {
            Row(modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = "",
                    onValueChange = {},
                    placeholder = { Text("Search my signals...", fontSize = 14.sp) },
                    modifier = Modifier.weight(1f).height(48.dp),
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, modifier = Modifier.size(18.dp)) },
                    shape = RoundedCornerShape(8.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = Color.White, unfocusedContainerColor = Color.White)
                )
                IconButton(onClick = { /* Filter */ }, modifier = Modifier.size(48.dp).border(1.dp, Color(0xFFE0DFDB), RoundedCornerShape(8.dp))) {
                    Icon(Icons.Default.FilterList, contentDescription = null)
                }
            }

            LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                items(mySignalsList) { signal ->
                    MySignalItem(signal = signal)
                }
                item { Spacer(modifier = Modifier.height(32.dp)) }
            }
        }
    }
}

@Composable
fun MySignalItem(signal: MySignal) {
    Surface(
        color = Color.White,
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Surface(
                    color = if (signal.status == "Active") Color(0xFF22C55E).copy(alpha = 0.1f) else Color(0xFF3B82F6).copy(alpha = 0.1f),
                    shape = RoundedCornerShape(100.dp)
                ) {
                    Text(
                        text = signal.status.uppercase(),
                        color = if (signal.status == "Active") Color(0xFF22C55E) else Color(0xFF3B82F6),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
                IconButton(onClick = { /* Edit */ }, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Default.Edit, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(16.dp))
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            Text(text = signal.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            
            Spacer(modifier = Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.Bottom) {
                Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                    Column {
                        Text("RESPONSES", fontSize = 10.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                        Text(signal.responses.toString(), fontWeight = FontWeight.Bold)
                    }
                    Column {
                        Text("VIEWS", fontSize = 10.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                        Text(signal.views.toString(), fontWeight = FontWeight.Bold)
                    }
                }
                TextButton(onClick = { /* Details */ }) {
                    Text("View Detail →", color = Color(0xFF0A0A0A), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

data class MySignal(val title: String, val status: String, val responses: Int, val views: Int)
val mySignalsList = listOf(
    MySignal("Need Full-stack Developer for AgriTech MVP", "Active", 14, 420),
    MySignal("Seeking AWS Expert for Server Migration", "Solved", 2, 88)
)
