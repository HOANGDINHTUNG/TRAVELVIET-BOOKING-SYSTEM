package com.wedservice.backend.module.flights.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class FlightSearchRequest {
    private Long originDestinationId;
    private Long destinationId;
    /** Mã IATA sân bay khởi hành (vd: HAN, SGN). Frontend dùng thay cho originDestinationId. */
    private String originCode;
    /** Mã IATA sân bay đến (vd: DAD, DLI). Frontend dùng thay cho destinationId. */
    private String destinationCode;
    private LocalDate departureDate;
    private String cabinClass;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    @Min(1)
    private Integer passengers = 1;
    @Min(0)
    private int page = 0;
    @Min(1)
    @Max(100)
    private int size = 12;
}

