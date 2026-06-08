package com.wedservice.backend.module.hotels.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class HotelResponse {
    private Long id;
    private Long destinationId;
    private String destinationName;
    private String code;
    private String name;
    private String slug;
    private String description;
    private BigDecimal starRating;
    private BigDecimal reviewScore;
    private String phone;
    private String email;
    private String province;
    private String district;
    private String address;
    private String status;
    private BigDecimal minRoomPrice;
    private Boolean available;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<HotelRoomTypeDto> roomTypes;
}

