package com.starto.repository;

import com.starto.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ConnectionRepository extends JpaRepository<Connection, UUID> {
    List<Connection> findByRequesterIdOrReceiverId(UUID requesterId, UUID receiverId);
}
