package com.wedservice.backend.module.bookings.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private String bookingCode;
    private Long tourId;
    private Long scheduleId;
    private String status;
    private String paymentStatus;
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private Integer adults;
    private Integer children;
    private Integer infants;
    private Integer seniors;
    private BigDecimal subtotalAmount;
    private BigDecimal discountAmount;
    private BigDecimal voucherDiscountAmount;
    private BigDecimal loyaltyDiscountAmount;
    private BigDecimal addonAmount;
    private BigDecimal taxAmount;
    private BigDecimal finalAmount;
    private Long voucherId;
    private Long comboId;
    private String currency;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
