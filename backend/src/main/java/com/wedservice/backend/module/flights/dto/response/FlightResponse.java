package com.wedservice.backend.module.flights.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class FlightResponse {
    private Long id;
    private String flightNo;
    private String status;
    private Long airlineId;
    private String airlineCode;
    private String airlineName;
    private Long originAirportId;
    private String originAirportCode;
    private String originAirportName;
    private Long destinationAirportId;
    private String destinationAirportCode;
    private String destinationAirportName;
    private LocalDateTime departureTimeLocal;
    private LocalDateTime arrivalTimeLocal;
    private Integer durationMinutes;
    private String recommendedCabinClass;
    private BigDecimal minPrice;
    private Integer availableSeats;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

