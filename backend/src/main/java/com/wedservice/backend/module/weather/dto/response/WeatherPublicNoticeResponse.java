package com.wedservice.backend.module.weather.dto.response;

import com.wedservice.backend.module.weather.entity.WeatherNoticeStatus;
import com.wedservice.backend.module.weather.entity.WeatherSeverity;
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
public class WeatherPublicNoticeResponse {

    private Long id;
    private Long destinationId;
    private Long sourceAlertId;
    private WeatherSeverity severity;
    private String title;
    private String summary;
    private String detail;
    private String actionAdvice;
    private LocalDateTime displayFrom;
    private LocalDateTime displayTo;
    private WeatherNoticeStatus status;
    private Boolean pinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
