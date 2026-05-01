package com.wedservice.backend.module.weather.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.weather.facade.WeatherFacade;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.JsonNode;

@RestController
@RequestMapping("/weather")
@RequiredArgsConstructor
@Validated
public class WeatherApiController {

    private final WeatherFacade weatherFacade;

    @GetMapping("/realtime")
    public ApiResponse<JsonNode> getRealtime(
            @RequestParam @NotBlank String q,
            @RequestParam(defaultValue = "no") String aqi
    ) {
        return ApiResponse.<JsonNode>builder()
                .success(true)
                .message("Realtime weather fetched successfully")
                .data(weatherFacade.getRealtime(q, aqi))
                .build();
    }

    @GetMapping("/forecast")
    public ApiResponse<JsonNode> getForecast(
            @RequestParam @NotBlank String q,
            @RequestParam(defaultValue = "1") @Min(1) @Max(14) int days,
            @RequestParam(defaultValue = "no") String aqi,
            @RequestParam(defaultValue = "no") String alerts
    ) {
        return ApiResponse.<JsonNode>builder()
                .success(true)
                .message("Weather forecast fetched successfully")
                .data(weatherFacade.getForecast(q, days, aqi, alerts))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<JsonNode> searchLocations(@RequestParam @NotBlank String q) {
        return ApiResponse.<JsonNode>builder()
                .success(true)
                .message("Weather locations fetched successfully")
                .data(weatherFacade.searchLocations(q))
                .build();
    }

    @GetMapping("/ip")
    public ApiResponse<JsonNode> lookupIp(@RequestParam @NotBlank String q) {
        return ApiResponse.<JsonNode>builder()
                .success(true)
                .message("Weather IP lookup fetched successfully")
                .data(weatherFacade.lookupIp(q))
                .build();
    }
}
