package com.wedservice.backend.module.weather.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminWeatherDisplayPolicyRequest {

    private Boolean showForecastSummary;
    private Boolean showTemperature;
    private Boolean showRainProbability;
    private Boolean showWindSpeed;
    private Boolean showHumidity;
    private Boolean showAqi;
    private Boolean showHourlyForecast;
    private Boolean showAlerts;
    private Boolean showAlertDetail;
}
