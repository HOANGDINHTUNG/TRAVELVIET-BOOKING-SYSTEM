package com.wedservice.backend.module.hotels.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class HotelSearchRequest {
    private Long destinationId;
    private String keyword;
    private BigDecimal minStar;
    private BigDecimal maxStar;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;
    @Min(1)
    private Integer rooms = 1;
    @Min(0)
    private Integer adults = 1;
    @Min(0)
    private Integer children = 0;
    @Min(0)
    private int page = 0;
    @Min(1)
    @Max(100)
    private int size = 12;
}

