package com.wedservice.backend.module.hotels.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class HotelRoomTypeRequest {
    @NotBlank
    private String name;
    @NotNull
    private BigDecimal pricePerNight;
    @NotNull
    private Integer maxOccupancy;
    @NotNull
    private Integer totalRooms;
    @NotBlank
    private String status;
}
