package com.wedservice.backend.module.bookings.entity;

import com.wedservice.backend.common.entity.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "hotel_booking_guests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelBookingGuest extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hotel_booking_id", nullable = false)
    private Long hotelBookingId;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "guest_type", nullable = false, length = 20)
    @Builder.Default
    private String guestType = "adult";

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "identity_no", length = 50)
    private String identityNo;
}

