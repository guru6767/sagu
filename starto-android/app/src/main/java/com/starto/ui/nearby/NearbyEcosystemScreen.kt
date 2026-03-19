package com.starto.ui.nearby

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NearbyEcosystemScreen() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Column {
                        Text("Nearby Ecosystem", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("Within 25km radius", fontSize = 12.sp, color = Color.Gray)
                    }
                },
                actions = {
                    IconButton(onClick = { /* Filter */ }) {
                        Icon(Icons.Default.FilterList, contentDescription = null)
                    }
                    IconButton(onClick = { /* My Location */ }) {
                        Icon(Icons.Default.Navigation, contentDescription = null, tint = Color(0xFF0A0A0A))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding)) {
            // Mock Map View
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .background(Color(0xFFE5E3DF)),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
                    Icon(Icons.Default.Map, contentDescription = null, size = 64.dp, tint = Color.Gray.copy(alpha = 0.4f))
                    Text(
                        "Google Maps SDK Integration Placeholder", 
                        fontSize = 16.sp, 
                        fontWeight = FontWeight.Bold, 
                        color = Color.Gray, 
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                        modifier = Modifier.padding(top = 16.dp)
                    )
                }

                // Map UI Overlay (Filters)
                LazyRow(
                    modifier = Modifier.align(Alignment.BottomStart).padding(bottom = 24.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(listOf("Founders", "Mentors", "Investors", "Talent", "Office")) { filter ->
                        Surface(
                            shape = RoundedCornerShape(100.dp),
                            color = Color.White,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB)),
                            onClick = { /* Select */ }
                        ) {
                            Text(
                                text = filter.uppercase(),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)
                            )
                        }
                    }
                }
            }

            // Bottom List Panel
            Column(
                modifier = Modifier
                    .height(280.dp)
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(24.dp)
            ) {
                Text("Nearby Nodes (42)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Gray, modifier = Modifier.padding(bottom = 20.dp))
                
                Row(modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(48.dp).clip(CircleShape).background(Color(0xFFF0EFEB)))
                    Spacer(modifier = Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Node Founder 1", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Founder • 1.2km away", fontSize = 12.sp, color = Color.Gray)
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 4.dp)) {
                            Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color(0xFF22C55E)))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Online", fontSize = 10.sp, color = Color(0xFF22C55E), fontWeight = FontWeight.Bold)
                        }
                    }
                }
                
                Divider(color = Color(0xFFF0EFEB), thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
                
                Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(48.dp).clip(CircleShape).background(Color(0xFFF0EFEB)))
                    Spacer(modifier = Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Node Mentor 4", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Mentor • 2.4km away", fontSize = 12.sp, color = Color.Gray)
                    }
                }
            }
        }
    }
}
