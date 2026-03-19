package com.starto.ui.feed

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
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
import com.starto.ui.components.SignalCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeFeedScreen() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Feed", fontWeight = FontWeight.Bold, fontSize = 24.sp) },
                actions = {
                    IconButton(onClick = { /* Search */ }) {
                        Icon(Icons.Default.Search, contentDescription = null)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF5F4F0))
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { /* Raise Signal */ },
                containerColor = Color(0xFF0A0A0A),
                contentColor = Color.White,
                shape = CircleShape
            ) {
                Icon(Icons.Default.Add, contentDescription = null)
            }
        },
        containerColor = Color(0xFFF5F4F0)
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item { Spacer(modifier = Modifier.height(8.dp)) }
            
            items(mockSignals) { signal ->
                SignalCard(signal = signal)
            }
            
            item { Spacer(modifier = Modifier.height(80.dp)) }
        }
    }
}

data class Signal(
    val title: String,
    val username: String,
    val timeAgo: String,
    val category: String,
    val description: String,
    val strength: String,
    val responses: Int,
    val offers: Int,
    val views: Int
)

val mockSignals = listOf(
    Signal("Need Full-stack Developer for AgriTech MVP", "arjun_startup", "2h ago", "Talent", "Looking for someone with React and Node.js experience to help build our core platform.", "High", 14, 3, 420),
    Signal("Seeking Mentor for SaaS GTM Strategy", "rahul_founder", "4h ago", "Mentor", "We have hit $1k MRR and need guidance on scaling our outbound sales process.", "Normal", 8, 1, 215),
    Signal("Critical: Server Outage - Need AWS Expert", "devops_pro", "15m ago", "Instant Help", "Our production database is unresponsive after a migration. Need urgent help.", "Critical", 2, 0, 88)
)
