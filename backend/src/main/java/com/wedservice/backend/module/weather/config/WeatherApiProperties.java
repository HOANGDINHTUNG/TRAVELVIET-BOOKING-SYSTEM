package com.wedservice.backend.module.weather.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "weather-api")
@Getter
@Setter
public class WeatherApiProperties {

    private String baseUrl = "https://api.weatherapi.com/v1";
    private String apiKey;
    private int forecastDays = 3;
    private String lang = "vi";
    private String aqi = "yes";
    private String alerts = "yes";
    private int timeoutSeconds = 12;
}
