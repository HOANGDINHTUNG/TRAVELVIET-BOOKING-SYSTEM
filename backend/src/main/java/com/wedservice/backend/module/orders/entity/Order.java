package com.wedservice.backend.module.orders.entity;

import com.wedservice.backend.module.bookings.entity.BookingPaymentStatus;
import com.wedservice.backend.module.bookings.entity.converter.BookingPaymentStatusConverter;
import com.wedservice.backend.module.orders.entity.converter.OrderStatusConverter;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_code", nullable = false, unique = true, length = 50)
    private String orderCode;

    @Column(name = "user_id", nullable = false, length = 36)
    private UUID userId;

    @Convert(converter = OrderStatusConverter.class)
    @Column(name = "status", length = 30, nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.DRAFT;

    @Convert(converter = BookingPaymentStatusConverter.class)
    @Column(name = "payment_status", length = 30, nullable = false)
    @Builder.Default
    private BookingPaymentStatus paymentStatus = BookingPaymentStatus.UNPAID;

    @Column(name = "order_source", nullable = false, length = 30)
    @Builder.Default
    private String orderSource = "app";

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "VND";

    @Column(name = "subtotal_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal subtotalAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "voucher_discount_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal voucherDiscountAmount = BigDecimal.ZERO;

    @Column(name = "loyalty_discount_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal loyaltyDiscountAmount = BigDecimal.ZERO;

    @Column(name = "addon_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal addonAmount = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "final_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal finalAmount = BigDecimal.ZERO;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "placed_at")
    private LocalDateTime placedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
