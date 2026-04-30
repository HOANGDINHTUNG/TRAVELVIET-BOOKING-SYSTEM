package com.wedservice.backend.module.weather.dto.request;

import com.wedservice.backend.module.weather.entity.WeatherNoticeStatus;
import com.wedservice.backend.module.weather.entity.WeatherSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class AdminWeatherPublicNoticeRequest {

    private Long sourceAlertId;

    @NotNull
    private WeatherSeverity severity;

    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    @Size(max = 500)
    private String summary;

    private String detail;
    private String actionAdvice;

    @NotNull
    private LocalDateTime displayFrom;

    @NotNull
    private LocalDateTime displayTo;

    private WeatherNoticeStatus status;
    private Boolean pinned;
}
