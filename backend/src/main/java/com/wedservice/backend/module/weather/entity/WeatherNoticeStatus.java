package com.wedservice.backend.module.weather.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum WeatherNoticeStatus {
    DRAFT("draft"),
    PUBLISHED("published"),
    EXPIRED("expired");

    private final String value;

    @JsonValue
    public String getJsonValue() {
        return value;
    }

    @JsonCreator
    public static WeatherNoticeStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(item -> item.value.equalsIgnoreCase(value) || item.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown weather notice status: " + value));
    }
}
