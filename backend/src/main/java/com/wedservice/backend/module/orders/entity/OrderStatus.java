package com.wedservice.backend.module.orders.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderStatus {
    DRAFT("draft"),
    PENDING_PAYMENT("pending_payment"),
    PARTIALLY_PAID("partially_paid"),
    PAID("paid"),
    PROCESSING("processing"),
    COMPLETED("completed"),
    CANCELLED("cancelled"),
    EXPIRED("expired"),
    REFUNDED("refunded");

    private final String value;

    @JsonValue
    public String getJsonValue() {
        return value;
    }

    @JsonCreator
    public static OrderStatus fromValue(String rawValue) {
        if (rawValue == null) {
            return null;
        }
        for (OrderStatus status : values()) {
            if (status.value.equalsIgnoreCase(rawValue) || status.name().equalsIgnoreCase(rawValue)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid order status: " + rawValue);
    }
}
