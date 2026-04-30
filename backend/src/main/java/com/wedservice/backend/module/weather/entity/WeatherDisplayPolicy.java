package com.wedservice.backend.module.weather.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "weather_display_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherDisplayPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "destination_id", nullable = false)
    private Long destinationId;

    @Column(name = "show_forecast_summary", nullable = false)
    @Builder.Default
    private Boolean showForecastSummary = true;

    @Column(name = "show_temperature", nullable = false)
    @Builder.Default
    private Boolean showTemperature = true;

    @Column(name = "show_rain_probability", nullable = false)
    @Builder.Default
    private Boolean showRainProbability = true;

    @Column(name = "show_wind_speed", nullable = false)
    @Builder.Default
    private Boolean showWindSpeed = true;

    @Column(name = "show_humidity", nullable = false)
    @Builder.Default
    private Boolean showHumidity = false;

    @Column(name = "show_aqi", nullable = false)
    @Builder.Default
    private Boolean showAqi = false;

    @Column(name = "show_hourly_forecast", nullable = false)
    @Builder.Default
    private Boolean showHourlyForecast = false;

    @Column(name = "show_alerts", nullable = false)
    @Builder.Default
    private Boolean showAlerts = true;

    @Column(name = "show_alert_detail", nullable = false)
    @Builder.Default
    private Boolean showAlertDetail = true;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        if (showForecastSummary == null) {
            showForecastSummary = true;
        }
        if (showTemperature == null) {
            showTemperature = true;
        }
        if (showRainProbability == null) {
            showRainProbability = true;
        }
        if (showWindSpeed == null) {
            showWindSpeed = true;
        }
        if (showHumidity == null) {
            showHumidity = false;
        }
        if (showAqi == null) {
            showAqi = false;
        }
        if (showHourlyForecast == null) {
            showHourlyForecast = false;
        }
        if (showAlerts == null) {
            showAlerts = true;
        }
        if (showAlertDetail == null) {
            showAlertDetail = true;
        }
        updatedAt = LocalDateTime.now();
    }
}
