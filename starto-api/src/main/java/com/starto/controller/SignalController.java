package com.starto.controller;

import com.starto.model.Signal;
import com.starto.model.User;
import com.starto.service.SignalService;
import com.starto.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/signals")
@RequiredArgsConstructor
public class SignalController {

    private final SignalService signalService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Signal> createSignal(@AuthenticationPrincipal String firebaseUid,
            @RequestBody Signal signal) {
        return userService.getUserByFirebaseUid(firebaseUid)
                .map(user -> {
                    signal.setUser(user);
                    return ResponseEntity.ok(signalService.createSignal(signal));
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping
    public ResponseEntity<List<Signal>> getSignals(@RequestParam(required = false) String city) {
        if (city != null) {
            return ResponseEntity.ok(signalService.getSignalsByCity(city));
        }
        return ResponseEntity.ok(signalService.getActiveSignals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Signal> getSignal(@PathVariable UUID id) {
        signalService.incrementViewCount(id);
        return ResponseEntity.ok(signalService.getSignalById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Signal>> getMySignals(@AuthenticationPrincipal String firebaseUid) {
        return userService.getUserByFirebaseUid(firebaseUid)
                .map(user -> ResponseEntity.ok(signalService.getSignalsByUser(user.getId())))
                .orElse(ResponseEntity.status(401).build());
    }
}
