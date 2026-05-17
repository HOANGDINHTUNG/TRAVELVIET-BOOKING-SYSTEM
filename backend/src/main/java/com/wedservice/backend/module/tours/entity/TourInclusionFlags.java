package com.wedservice.backend.module.tours.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tour_inclusion_flags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourInclusionFlags {

    @Id
    @Column(name = "tour_id")
    private Long tourId;

    @Column(name = "has_flight", nullable = false)
    @Builder.Default
    private Boolean hasFlight = false;

    @Column(name = "has_hotel", nullable = false)
    @Builder.Default
    private Boolean hasHotel = false;

    @Column(name = "has_meals", nullable = false)
    @Builder.Default
    private Boolean hasMeals = false;

    @Column(name = "has_tickets", nullable = false)
    @Builder.Default
    private Boolean hasTickets = false;

    @Column(name = "has_guide", nullable = false)
    @Builder.Default
    private Boolean hasGuide = false;

    @Column(name = "has_insurance", nullable = false)
    @Builder.Default
    private Boolean hasInsurance = false;

    @Column(name = "has_transport", nullable = false)
    @Builder.Default
    private Boolean hasTransport = false;

    @Column(name = "hotel_stars")
    private Integer hotelStars;

    @Enumerated(EnumType.STRING)
    @Column(name = "flight_type", nullable = false, length = 20)
    @Builder.Default
    private TourFlightType flightType = TourFlightType.none;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
