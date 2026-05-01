package com.wedservice.backend.module.weather.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "weatherapi")
@Getter
@Setter
public class WeatherApiProperties {

    private String baseUrl = "https://api.weatherapi.com/v1";
    private String apiKey;
    private int forecastDays = 1;
    private String aqi = "no";
    private String alerts = "no";
}
