package com.wedservice.backend.module.weather.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherDisplayPolicyResponse {

    private Long id;
    private Long destinationId;
    private Boolean showForecastSummary;
    private Boolean showTemperature;
    private Boolean showRainProbability;
    private Boolean showWindSpeed;
    private Boolean showHumidity;
    private Boolean showAqi;
    private Boolean showHourlyForecast;
    private Boolean showAlerts;
    private Boolean showAlertDetail;
    private LocalDateTime updatedAt;
}
