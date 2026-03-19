package com.starto.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "nearby_spaces")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearbySpace {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String city;
    private String state;
    private BigDecimal lat;
    private BigDecimal lng;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String contact;
    private String website;
    private Boolean verified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}
