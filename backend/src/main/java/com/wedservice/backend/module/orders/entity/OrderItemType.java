package com.wedservice.backend.module.orders.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderItemType {
    BOOKING("booking"),
    TOUR_BOOKING("tour_booking"),
    HOTEL_BOOKING("hotel_booking"),
    FLIGHT_BOOKING("flight_booking"),
    COMBO_BOOKING("combo_booking"),
    PRODUCT("product"),
    COMBO("combo"),
    ADDON("addon"),
    INSURANCE("insurance"),
    SERVICE("service");

    private final String value;

    @JsonValue
    public String getJsonValue() {
        return value;
    }

    @JsonCreator
    public static OrderItemType fromValue(String rawValue) {
        if (rawValue == null) {
            return null;
        }
        for (OrderItemType type : values()) {
            if (type.value.equalsIgnoreCase(rawValue) || type.name().equalsIgnoreCase(rawValue)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid order item type: " + rawValue);
    }
}
