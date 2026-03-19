package com.starto.scheduler;

import com.starto.model.Signal;
import com.starto.repository.SignalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SignalExpiryScheduler {

    private final SignalRepository signalRepository;

    @Scheduled(cron = "0 0 * * * *") // Every hour
    @Transactional
    public void checkExpiredSignals() {
        log.info("Checking for expired signals...");
        OffsetDateTime now = OffsetDateTime.now();

        List<Signal> activeSignals = signalRepository.findByStatus("open");

        for (Signal signal : activeSignals) {
            if (signal.getExpiresAt().isBefore(now)) {
                log.info("Expiring signal: {}", signal.getId());
                signal.setStatus("expired");
                signalRepository.save(signal);
            }
        }
    }

    @Scheduled(cron = "0 0 0 * * *") // Every midnight
    @Transactional
    public void checkExpiredBoosts() {
        log.info("Checking for expired boosts...");
        OffsetDateTime now = OffsetDateTime.now();

        // This would require a specialized query in repository
        // For simplicity, we'll mark it as a task to implement further logic if needed
    }
}
