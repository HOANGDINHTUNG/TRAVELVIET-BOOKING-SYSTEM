package com.wedservice.backend.module.destinations.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DestinationStatus {
    PENDING("pending"),
    APPROVED("approved"),
    REJECTED("rejected");

    private final String value;

    public static DestinationStatus fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (DestinationStatus status : DestinationStatus.values()) {
            if (status.value.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid destination status: " + value);
    }
}
