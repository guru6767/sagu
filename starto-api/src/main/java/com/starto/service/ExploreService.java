package com.starto.service;

import com.starto.dto.ExploreRequest;
import com.starto.dto.ExploreResponse;
import com.starto.repository.ExploreReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExploreService {

    private final ExploreReportRepository exploreReportRepository;

    @Value("${openai.api-key}")
    private String openAiKey;

    @Value("${google.ai.api-key}")
    private String geminiKey;

    public ExploreResponse analyzeMarket(ExploreRequest request) {
        log.info("Analyzing market for: {} in {}", request.getIndustry(), request.getLocation());

        // Step 1: Call GPT-4o for primary analysis
        // String gptResponse = callGpt4o(request);

        // Step 2: Call Gemini Pro for validation
        // String geminiResponse = callGemini(gptResponse);

        // Step 3: Merge and parse
        // ExploreResponse finalResponse = mergeAndParse(gptResponse, geminiResponse);

        // For now, returning a mock to satisfy structure
        return ExploreResponse.builder()
                .confidenceScore(0.85)
                .build();
    }

    // Mock implementations for API calls - to be replaced with real client logic
}
