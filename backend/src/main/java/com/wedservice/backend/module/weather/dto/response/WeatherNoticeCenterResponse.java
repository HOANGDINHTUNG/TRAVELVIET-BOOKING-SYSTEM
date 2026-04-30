package com.wedservice.backend.module.weather.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherNoticeCenterResponse {

    private Long destinationId;
    private WeatherDisplayPolicyResponse displayPolicy;
    private WeatherForecastResponse currentForecast;
    private List<WeatherPublicNoticeResponse> notices;
    private List<WeatherAlertResponse> activeAlerts;
}
