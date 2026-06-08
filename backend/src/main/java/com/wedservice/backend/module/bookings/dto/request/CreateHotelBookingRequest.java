package com.wedservice.backend.module.bookings.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateHotelBookingRequest {
    @NotNull
    private Long hotelId;
    @NotNull
    private Long roomTypeId;
    @NotNull
    private LocalDate checkinDate;
    @NotNull
    private LocalDate checkoutDate;
    @Min(1)
    private Integer rooms = 1;
    @Min(1)
    private Integer adults = 1;
    @Min(0)
    private Integer children = 0;
    @NotBlank
    private String contactName;
    @NotBlank
    private String contactPhone;
    private String contactEmail;
    private String specialRequests;
}

