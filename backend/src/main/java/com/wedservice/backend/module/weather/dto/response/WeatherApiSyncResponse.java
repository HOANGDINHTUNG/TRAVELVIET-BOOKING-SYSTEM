package com.wedservice.backend.module.weather.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherApiSyncResponse {

    private Long destinationId;
    private String query;
    private String locationName;
    private String region;
    private String country;
    private LocalDateTime fetchedAt;
    private int forecastsSaved;
    private int alertsSaved;
    private List<WeatherForecastResponse> forecasts;
    private List<WeatherAlertResponse> alerts;
}
