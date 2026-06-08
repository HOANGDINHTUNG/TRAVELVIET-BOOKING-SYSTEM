package com.wedservice.backend.module.hotels.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class HotelRoomTypeDto {
    private String name;
    private BigDecimal pricePerNight;
    private Integer maxOccupancy;
    private Integer totalRooms;
    private String status;
}
