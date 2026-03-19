package com.starto.repository;

import com.starto.model.NearbySpace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NearbySpaceRepository extends JpaRepository<NearbySpace, UUID> {
    List<NearbySpace> findByCity(String city);
}
