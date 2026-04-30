package com.wedservice.backend.module.weather.dto.request;

import com.wedservice.backend.module.weather.entity.WeatherNoticeStatus;
import jakarta.validation.constraints.NotNull;
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
public class UpdateWeatherPublicNoticeStatusRequest {

    @NotNull
    private WeatherNoticeStatus status;
}
