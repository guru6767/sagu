package com.starto.repository;

import com.starto.model.Signal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SignalRepository extends JpaRepository<Signal, UUID> {
    List<Signal> findByCity(String city);

    List<Signal> findByType(String type);

    List<Signal> findByStatus(String status);

    List<Signal> findByUserId(UUID userId);
}
