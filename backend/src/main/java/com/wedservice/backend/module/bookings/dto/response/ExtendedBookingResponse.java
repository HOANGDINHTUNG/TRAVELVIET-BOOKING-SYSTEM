package com.wedservice.backend.module.bookings.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ExtendedBookingResponse {
    private Long orderId;
    private String orderCode;
    private String bookingType;
    private Long bookingId;
    private String bookingCode;
    private String status;
    private String paymentStatus;
    private BigDecimal finalAmount;
    private String currency;
}

