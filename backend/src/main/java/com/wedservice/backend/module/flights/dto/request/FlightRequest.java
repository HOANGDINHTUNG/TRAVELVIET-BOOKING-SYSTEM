package com.wedservice.backend.module.flights.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FlightRequest {
    @NotNull
    private Long airlineId;
    @NotBlank
    private String flightNo;
    @NotNull
    private Long originAirportId;
    @NotNull
    private Long destinationAirportId;
    @NotNull
    private LocalDateTime departureTimeLocal;
    @NotNull
    private LocalDateTime arrivalTimeLocal;
    @NotNull
    private Integer durationMinutes;
    private String status;
}

