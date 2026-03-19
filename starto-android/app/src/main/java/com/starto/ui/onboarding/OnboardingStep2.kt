package com.starto.ui.onboarding

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class Role(val id: String, val title: String, val desc: String, val icon: ImageVector)

val roles = listOf(
    Role("founder", "Founder", "Building something", Icons.Default.Star),
    Role("mentor", "Mentor", "Guiding others", Icons.Default.Email),
    Role("investor", "Investor", "Funding growth", Icons.Default.Build),
    Role("talent", "Talent", "Ready to contribute", Icons.Default.Person)
)

@Composable
fun OnboardingStep2() {
    var selectedRole by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F4F0))
            .padding(24.dp)
    ) {
        Text(
            text = "What best describes you?",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            lineHeight = 40.sp,
            modifier = Modifier.padding(top = 40.dp)
        )
        Text(
            text = "Select one role to continue.",
            fontSize = 16.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 8.dp, bottom = 32.dp)
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(roles) { role ->
                val isSelected = selectedRole == role.id
                Card(
                    modifier = Modifier
                        .height(180.dp)
                        .clickable { selectedRole = role.id },
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) Color(0xFF0A0A0A) else Color.White
                    ),
                    border = if (!isSelected) BorderStroke(1.dp, Color(0xFFE0DFDB)) else null,
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize().padding(16.dp),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = role.icon,
                            contentDescription = null,
                            tint = if (isSelected) Color.White else Color.Black,
                            modifier = Modifier.size(32.dp).padding(bottom = 12.dp)
                        )
                        Text(
                            text = role.title,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color.White else Color.Black
                        )
                        Text(
                            text = role.desc,
                            fontSize = 12.sp,
                            color = if (isSelected) Color.LightGray else Color.Gray,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        }

        Button(
            onClick = { /* Navigate to Step 3 */ },
            enabled = selectedRole.isNotEmpty(),
            modifier = Modifier.fillMaxWidth().height(56.dp).padding(bottom = 8.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0A0A0A)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Continue", color = Color.White)
        }
    }
}
