package com.wedservice.backend.module.bookings.entity;

import com.wedservice.backend.common.entity.AuditableEntity;
import com.wedservice.backend.module.bookings.entity.converter.BookingPaymentStatusConverter;
import com.wedservice.backend.module.bookings.entity.converter.BookingStatusConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "flight_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightBooking extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_code", unique = true, length = 50)
    private String bookingCode;

    @Column(name = "user_id", nullable = false, length = 36)
    private UUID userId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "flight_id", nullable = false)
    private Long flightId;

    @Column(name = "flight_class_id", nullable = false)
    private Long flightClassId;

    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;

    @Column(name = "trip_type", nullable = false, length = 20)
    @Builder.Default
    private String tripType = "one_way";

    @Column(name = "return_flight_id")
    private Long returnFlightId;

    @Column(name = "return_departure_date")
    private LocalDate returnDepartureDate;

    @Column(name = "passenger_count", nullable = false)
    @Builder.Default
    private Integer passengerCount = 1;

    @Convert(converter = BookingStatusConverter.class)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    @Convert(converter = BookingPaymentStatusConverter.class)
    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private BookingPaymentStatus paymentStatus = BookingPaymentStatus.UNPAID;

    @Column(name = "contact_name", nullable = false, length = 150)
    private String contactName;

    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "subtotal_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal subtotalAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "final_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal finalAmount = BigDecimal.ZERO;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "VND";

    @Column(name = "pnr_code", length = 50)
    private String pnrCode;

    @Column(name = "ticketing_time_limit")
    private LocalDateTime ticketingTimeLimit;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "cancel_reason", columnDefinition = "TEXT")
    private String cancelReason;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}

