package com.wedservice.backend.module.hotels.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class HotelRequest {
    @NotNull
    private Long destinationId;
    @NotBlank
    private String code;
    @NotBlank
    private String name;
    private String slug;
    private String description;
    private BigDecimal starRating;
    private String phone;
    private String email;
    private String province;
    private String district;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String status;
}

