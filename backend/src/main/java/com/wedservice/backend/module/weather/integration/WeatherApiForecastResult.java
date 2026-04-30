package com.wedservice.backend.module.weather.integration;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tools.jackson.databind.JsonNode;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherApiForecastResult {

    private String query;
    private JsonNode payload;
    private String rawPayload;
    private LocalDateTime fetchedAt;
}
