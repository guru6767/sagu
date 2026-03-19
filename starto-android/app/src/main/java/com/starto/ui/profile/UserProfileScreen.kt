package com.starto.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Zap
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
fun UserProfileScreen() {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F4F0))
            .verticalScroll(scrollState)
    ) {
        Box(modifier = Modifier.fillMaxWidth().height(160.dp).background(Color(0xFF0A0A0A))) {
            Box(
                modifier = Modifier
                    .padding(start = 24.dp)
                    .align(Alignment.BottomStart)
                    .offset(y = 48.dp)
                    .size(96.dp)
                    .background(Color.White, RoundedCornerShape(20.dp))
                    .padding(4.dp)
            ) {
                Box(modifier = Modifier.fillMaxSize().background(Color(0xFFF0EFEB), RoundedCornerShape(16.dp)))
            }
        }

        Spacer(modifier = Modifier.height(64.dp))

        Column(modifier = Modifier.padding(horizontal = 24.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.Top) {
                Column {
                    Text("Krishna K.", fontWeight = FontWeight.Bold, fontSize = 28.sp)
                    Text("@krish_startup", color = Color.Gray, fontSize = 14.sp)
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(onClick = { /* Edit */ }, modifier = Modifier.border(1.dp, Color(0xFFE0DFDB), RoundedCornerShape(8.dp))) {
                        Icon(Icons.Default.Edit, contentDescription = null, size = 18.dp)
                    }
                    IconButton(onClick = { /* Boost */ }, modifier = Modifier.background(Color(0xFF0A0A0A), RoundedCornerShape(8.dp))) {
                        Icon(Icons.Default.Zap, contentDescription = null, tint = Color.White, size = 18.dp)
                    }
                }
            }

            Row(modifier = Modifier.padding(top = 24.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Place, contentDescription = null, size = 14.dp, tint = Color.Gray)
                    Text("Bangalore, IN", fontSize = 12.sp, color = Color.Gray, modifier = Modifier.padding(start = 4.dp))
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Language, contentDescription = null, size = 14.dp, tint = Color.Gray)
                    Text("krishnak.dev", fontSize = 12.sp, color = Color.Gray, modifier = Modifier.padding(start = 4.dp))
                }
            }

            Text(
                "Building Starto V2 to democratize ecosystem intelligence for Indian founders. Focused on AI system orchestration and real-world signal exchange.",
                fontSize = 14.sp,
                color = Color.Black,
                lineHeight = 20.sp,
                modifier = Modifier.padding(top = 24.dp, bottom = 32.dp)
            )

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                ProfileStat("12", "Signals")
                ProfileStat("428", "Nodes")
                ProfileStat("92%", "Help Rate")
            }

            Divider(modifier = Modifier.padding(vertical = 32.dp), color = Color(0xFFE0DFDB))

            Text("ACTIVE SIGNALS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Gray, modifier = Modifier.padding(bottom = 16.dp))
            
            // Re-using simplified SignalCard logic
            Surface(
                color = Color.White,
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Surface(color = Color(0xFF0A0A0A), shape = RoundedCornerShape(100.dp)) {
                        Text("TALENT", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp))
                    }
                    Text("Building high-performance API for Starto", fontWeight = FontWeight.Bold, fontSize = 15.sp, modifier = Modifier.padding(top = 12.dp))
                    Text("Looking for senior devops expert to help with Railway deployment.", fontSize = 12.sp, color = Color.Gray, modifier = Modifier.padding(top = 4.dp))
                }
            }
        }
        
        Spacer(modifier = Modifier.height(40.dp))
    }
}

@Composable
fun ProfileStat(value: String, label: String) {
    Column {
        Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.Black)
        Text(label.uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
    }
}
