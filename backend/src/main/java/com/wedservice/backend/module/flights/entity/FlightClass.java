package com.wedservice.backend.module.flights.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "cabin_class", nullable = false, length = 20)
    private String cabinClass;

    @Column(name = "fare_family", nullable = false, length = 80)
    @Builder.Default
    private String fareFamily = "standard";

    @Column(name = "base_price", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal basePrice = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "VND";

    @Column(name = "seat_total", nullable = false)
    @Builder.Default
    private Integer seatTotal = 0;

    @Column(name = "seat_available", nullable = false)
    @Builder.Default
    private Integer seatAvailable = 0;

    @Column(name = "baggage_rule_json", columnDefinition = "JSON")
    private String baggageRuleJson;

    @Column(name = "change_refund_rule_json", columnDefinition = "JSON")
    private String changeRefundRuleJson;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

