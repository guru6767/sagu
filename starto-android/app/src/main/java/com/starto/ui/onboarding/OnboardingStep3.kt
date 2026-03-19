package com.starto.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

val industries = listOf(
    "AgriTech", "EdTech", "FinTech", "HealthTech", "RetailTech", "LogiTech",
    "CleanTech", "FoodTech", "PropTech", "HRTech", "LegalTech", "GovTech",
    "SpaceTech", "DeepTech", "SaaS", "eCommerce", "Manufacturing", "Other"
)

@Composable
fun OnboardingStep3() {
    var query by remember { mutableStateOf("") }
    var selectedIndustry by remember { mutableStateOf("") }

    val filteredIndustries = industries.filter { it.contains(query, ignoreCase = true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F4F0))
            .padding(24.dp)
    ) {
        Text(
            text = "What is your industry?",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            modifier = Modifier.padding(top = 40.dp)
        )

        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            placeholder = { Text("Search industry...") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 32.dp, bottom = 16.dp),
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                focusedBorderColor = Color.Black,
                unfocusedBorderColor = Color(0xFFE0DFDB)
            )
        )

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .background(Color.White, RoundedCornerShape(12.dp))
                .padding(8.dp)
        ) {
            items(filteredIndustries) { industry ->
                val isSelected = selectedIndustry == industry
                Surface(
                    onClick = { selectedIndustry = industry },
                    shape = RoundedCornerShape(8.dp),
                    color = if (isSelected) Color(0xFF0A0A0A) else Color.Transparent,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = industry,
                        color = if (isSelected) Color.White else Color.Black,
                        modifier = Modifier.padding(16.dp),
                        fontSize = 16.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = { /* Navigate to Step 4 */ },
            enabled = selectedIndustry.isNotEmpty(),
            modifier = Modifier.fillMaxWidth().height(56.dp).padding(bottom = 8.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0A0A0A)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Continue", color = Color.White)
        }
    }
}
