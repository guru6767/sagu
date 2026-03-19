package com.starto.service;

import com.starto.model.User;
import com.starto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> getUserByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid);
    }

    @Transactional
    public User createOrUpdateUser(String firebaseUid, String email, String name) {
        return userRepository.findByFirebaseUid(firebaseUid)
                .map(user -> {
                    user.setLastSeen(OffsetDateTime.now());
                    user.setIsOnline(true);
                    return userRepository.save(user);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .firebaseUid(firebaseUid)
                            .email(email)
                            .name(name)
                            .role("Founder") // Default role, should be updated in onboarding
                            .plan("free")
                            .lastSeen(OffsetDateTime.now())
                            .isOnline(true)
                            .build();
                    return userRepository.save(newUser);
                });
    }

    @Transactional
    public User updateProfile(User user) {
        user.setUpdatedAt(OffsetDateTime.now());
        return userRepository.save(user);
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }
}
