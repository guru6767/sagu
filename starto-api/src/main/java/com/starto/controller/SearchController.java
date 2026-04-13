package com.starto.controller;

import com.starto.dto.SearchResponseDTO;
import com.starto.repository.SignalRepository;
import com.starto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@CrossOrigin("*")
@RequiredArgsConstructor
public class SearchController {

    private final UserRepository userRepository;
    private final SignalRepository signalRepository;

    @GetMapping
    public ResponseEntity<SearchResponseDTO> search(@RequestParam("q") String query) {
        System.out.println("=== SEARCHING FOR: " + query + " ===");
        if (query == null || query.trim().length() < 2) {
            return ResponseEntity.ok(SearchResponseDTO.builder()
                    .profiles(java.util.Collections.emptyList())
                    .signals(java.util.Collections.emptyList())
                    .build());
        }

        String searchStr = query.trim();
        
        var users = userRepository.findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(searchStr, searchStr);
        var signals = signalRepository.findByTitleDescriptionOrOwner(searchStr);

        System.out.println("FOUND: " + users.size() + " users, " + signals.size() + " signals");

        return ResponseEntity.ok(SearchResponseDTO.builder()
                .profiles(users)
                .signals(signals)
                .build());
    }
}
