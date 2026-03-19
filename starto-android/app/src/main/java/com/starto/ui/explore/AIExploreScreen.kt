package com.starto.ui.explore

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun AIExploreScreen() {
    var isAnalyzing by remember { mutableStateOf(false) }
    var showResults by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F4F0))
            .verticalScroll(scrollState)
            .padding(24.dp)
    ) {
        Surface(
            color = Color(0xFF0A0A0A),
            shape = RoundedCornerShape(100.dp)
        ) {
            Text(
                text = "POWERED BY GPT-4O + GEMINI",
                color = Color.White,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
            )
        }

        Text(
            text = "Starto AI Explore",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            modifier = Modifier.padding(top = 16.dp, bottom = 8.dp)
        )
        Text(
            text = "Real Market Intelligence. No Assumptions. No Hallucinations.",
            fontSize = 14.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        if (!showResults) {
            Surface(
                color = Color.White,
                shape = RoundedCornerShape(20.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
            ) {
                Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
                    ExploreInput("Where are you launching?", "e.g. Pune, Maharashtra", Icons.Default.Map)
                    ExploreInput("What sector are you in?", "AgriTech", Icons.Default.BarChart)
                    ExploreInput("Initial budget?", "₹1L - ₹5L", Icons.Default.TrendingUp)

                    Button(
                        onClick = {
                            if (!isAnalyzing) {
                                isAnalyzing = true
                                scope.launch {
                                    delay(2000)
                                    isAnalyzing = false
                                    showResults = true
                                }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp)
                            .padding(top = 12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0A0A0A)),
                        shape = RoundedCornerShape(8.dp),
                        enabled = !isAnalyzing
                    ) {
                        Text(if (isAnalyzing) "Analyzing Market..." else "Analyze My Market →", fontWeight = FontWeight.Bold)
                    }
                }
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                MarketDemandCard()
                RiskAnalysisCard()
            }
        }
        
        Spacer(modifier = Modifier.height(40.dp))
    }
}

@Composable
fun ExploreInput(label: String, placeholder: String, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Column {
        Text(label.uppercase(), fontSize = 10.sp, color = Color.Gray, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
        OutlinedTextField(
            value = "",
            onValueChange = {},
            placeholder = { Text(placeholder, fontSize = 14.sp) },
            modifier = Modifier.fillMaxWidth(),
            leadingIcon = { Icon(icon, contentDescription = null, modifier = Modifier.size(18.dp)) },
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = Color(0xFFF0EFEB), unfocusedContainerColor = Color(0xFFF0EFEB))
        )
    }
}

@Composable
fun MarketDemandCard() {
    Surface(
        color = Color.White,
        shape = RoundedCornerShape(20.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Market Demand", fontWeight = FontWeight.Bold, fontSize = 20.sp)
                Text("8.4", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color(0xFF22C55E))
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                "The AgriTech sector in Pune shows strong growth indicators due to its proximity to Nashik and Ahmednagar supply chains.",
                fontSize = 14.sp,
                color = Color.Black,
                lineHeight = 20.sp
            )
        }
    }
}

@Composable
fun RiskAnalysisCard() {
    Surface(
        color = Color.White,
        shape = RoundedCornerShape(20.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0DFDB))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text("Risk Analysis", fontWeight = FontWeight.Bold, fontSize = 20.sp, modifier = Modifier.padding(bottom = 16.dp))
            listOf("Supply chain fragmentation", "Low digital literacy", "Regulatory uncertainty").forEach { risk ->
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(risk, fontSize = 14.sp, color = Color.Black)
                    Surface(color = Color(0xFFEAB308).copy(alpha = 0.1f), shape = RoundedCornerShape(4.dp)) {
                        Text("MEDIUM", color = Color(0xFFEAB308), fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp))
                    }
                }
            }
        }
    }
}
