package com.starto.service;

import com.starto.model.User;
import com.starto.repository.UserRepository;
import com.starto.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Transactional
    public void upgradeUserPlan(String firebaseUid, String plan, int durationMonths) {
        userRepository.findByFirebaseUid(firebaseUid).ifPresent(user -> {
            user.setPlan(plan);
            user.setPlanExpiresAt(OffsetDateTime.now().plusMonths(durationMonths));
            userRepository.save(user);
            log.info("User {} upgraded to plan: {}", firebaseUid, plan);
        });
    }

    public boolean canPerformAction(User user, String feature) {
        String plan = user.getPlan();
        // Implement feature gating logic based on Phase 2 Step 11 requirements
        if (plan.equals("free")) {
            // Check monthly limits from database/redis
            return true;
        }
        return true;
    }
}
