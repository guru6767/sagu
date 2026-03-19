package com.starto.controller;

import com.starto.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/webhook/razorpay")
    public ResponseEntity<Void> handleRazorpayWebhook(@RequestBody Map<String, Object> payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        // Step 1: Verify signature
        // Step 2: Extract payment/subscription info
        // Step 3: Upgrade user plan
        return ResponseEntity.ok().build();
    }

    @PostMapping("/webhook/stripe")
    public ResponseEntity<Void> handleStripeWebhook(@RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        // Step 1: Verify signature
        // Step 2: Extract payment info
        // Step 3: Upgrade user plan
        return ResponseEntity.ok().build();
    }
}
