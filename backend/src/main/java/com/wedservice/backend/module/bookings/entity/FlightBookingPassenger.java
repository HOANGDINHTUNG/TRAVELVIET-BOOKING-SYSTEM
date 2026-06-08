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
@Table(name = "flight_booking_passengers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightBookingPassenger extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_booking_id", nullable = false)
    private Long flightBookingId;

    @Column(name = "passenger_type", nullable = false, length = 20)
    @Builder.Default
    private String passengerType = "adult";

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "gender", nullable = false, length = 20)
    @Builder.Default
    private String gender = "unknown";

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "passport_no", length = 50)
    private String passportNo;

    @Column(name = "identity_no", length = 50)
    private String identityNo;
}

