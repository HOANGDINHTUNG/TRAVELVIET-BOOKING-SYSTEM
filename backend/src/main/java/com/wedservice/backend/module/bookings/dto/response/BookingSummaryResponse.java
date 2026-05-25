package com.wedservice.backend.module.bookings.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Slim list-card DTO for {@code GET /bookings/me}. Detail fields live in {@link BookingResponse}.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingSummaryResponse {

    private Long id;
    private String bookingCode;
    private String tourTitle;
    private BigDecimal totalPrice;
    private String currency;
    private String status;
    /** Compact payment state for list actions (pay / badge); detail fields stay on {@link BookingResponse}. */
    private String paymentStatus;
    private LocalDateTime createdAt;
    /** Departure time of the linked schedule, when available. */
    private LocalDateTime travelDate;
}
