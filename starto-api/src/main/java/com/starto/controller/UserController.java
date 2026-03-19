package com.starto.controller;

import com.starto.model.User;
import com.starto.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam String username) {
        boolean available = userService.isUsernameAvailable(username);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal String firebaseUid,
            @RequestBody User profileUpdates) {
        return userService.getUserByFirebaseUid(firebaseUid)
                .map(user -> {
                    // Update allowed fields
                    user.setName(profileUpdates.getName());
                    user.setUsername(profileUpdates.getUsername());
                    user.setBio(profileUpdates.getBio());
                    user.setIndustry(profileUpdates.getIndustry());
                    user.setCity(profileUpdates.getCity());
                    return ResponseEntity.ok(userService.updateProfile(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
