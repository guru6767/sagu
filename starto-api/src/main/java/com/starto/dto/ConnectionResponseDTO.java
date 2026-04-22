package com.starto.dto;

import com.starto.model.Connection;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class ConnectionResponseDTO {

    private UUID id;
    private String status;
    private String message;
    private OffsetDateTime createdAt;

    // Nested user info — avoid exposing full User entity
    private UUID requesterId;
    private String requesterName;
    private String requesterUsername;
    private String requesterAvatarUrl;
    private String requesterRole;

    private UUID receiverId;
    private String receiverName;
    private String receiverUsername;
    private String receiverAvatarUrl;
    private String receiverRole;

    private UUID signalId; // nullable if from profile

    public static ConnectionResponseDTO from(Connection connection) {
        return ConnectionResponseDTO.builder()
                .id(connection.getId())
                .status(connection.getStatus())
                .message(connection.getMessage())
                .createdAt(connection.getCreatedAt())
                .requesterId(connection.getRequester().getId())
                .requesterName(connection.getRequester().getName())
                .requesterUsername(connection.getRequester().getUsername())
                .requesterAvatarUrl(connection.getRequester().getAvatarUrl())
                .requesterRole(connection.getRequester().getRole())
                .receiverId(connection.getReceiver().getId())
                .receiverName(connection.getReceiver().getName())
                .receiverUsername(connection.getReceiver().getUsername())
                .receiverAvatarUrl(connection.getReceiver().getAvatarUrl())
                .receiverRole(connection.getReceiver().getRole())
                .signalId(connection.getSignalId())
                .build();
    }
}