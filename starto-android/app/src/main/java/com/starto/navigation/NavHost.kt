package com.starto.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.starto.ui.onboarding.*
import com.starto.ui.feed.*
import com.starto.ui.explore.*
import com.starto.ui.nearby.*
import com.starto.ui.instant.*
import com.starto.ui.network.*
import com.starto.ui.profile.*
import com.starto.ui.chat.*
import com.starto.ui.notifications.*
import com.starto.ui.studio.*
import com.starto.ui.admin.*

@Composable
fun StartoNavHost(navController: NavHostController) {
    NavHost(navController = navController, startDestination = "onboarding_step1") {
        // Onboarding
        composable("onboarding_step1") { OnboardingStep1() }
        composable("onboarding_step2") { OnboardingStep2() }
        composable("onboarding_step3") { OnboardingStep3() }
        composable("onboarding_step4") { OnboardingStep4() }
        composable("onboarding_step5") { OnboardingStep5() }

        // Core
        composable("home_feed") { HomeFeedScreen() }
        composable("signal_detail/{id}") { backStackEntry -> 
            val id = backStackEntry.arguments?.getString("id") ?: ""
            SignalDetailScreen(id) 
        }
        composable("my_signals") { MySignalsScreen() }
        
        // Explore & Geospatial
        composable("ai_explore") { AIExploreScreen() }
        composable("nearby") { NearbyEcosystemScreen() }
        composable("instant_help") { InstantHelpScreen() }

        // Social
        composable("network") { NetworkScreen() }
        composable("profile") { UserProfileScreen() }
        composable("chat/{id}") { backStackEntry -> 
            val id = backStackEntry.arguments?.getString("id") ?: ""
            ChatScreen(id) 
        }
        composable("notifications") { NotificationsScreen() }

        // Monetization & Admin
        composable("studio_pricing") { StudioPricingScreen() }
        composable("admin_control") { AdminControlScreen() }
    }
}
