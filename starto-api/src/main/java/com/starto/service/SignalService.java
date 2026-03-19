package com.starto.service;

import com.starto.model.Signal;
import com.starto.model.User;
import com.starto.repository.SignalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SignalService {

    private final SignalRepository signalRepository;

    @Transactional
    public Signal createSignal(Signal signal) {
        if (signal.getExpiresAt() == null) {
            signal.setExpiresAt(OffsetDateTime.now().plusDays(7));
        }
        return signalRepository.save(signal);
    }

    public List<Signal> getActiveSignals() {
        return signalRepository.findByStatus("open");
    }

    public List<Signal> getSignalsByCity(String city) {
        return signalRepository.findByCity(city);
    }

    public List<Signal> getSignalsByUser(UUID userId) {
        return signalRepository.findByUserId(userId);
    }

    public Signal getSignalById(UUID id) {
        return signalRepository.findById(id).orElseThrow(() -> new RuntimeException("Signal not found"));
    }

    @Transactional
    public void incrementViewCount(UUID signalId) {
        signalRepository.findById(signalId).ifPresent(signal -> {
            signal.setViewCount(signal.getViewCount() + 1);
            signalRepository.save(signal);
        });
    }
}
