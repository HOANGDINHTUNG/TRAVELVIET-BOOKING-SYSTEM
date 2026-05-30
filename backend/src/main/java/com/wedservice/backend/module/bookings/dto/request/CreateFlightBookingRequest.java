package com.wedservice.backend.module.bookings.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateFlightBookingRequest {
    @NotNull
    private Long flightId;
    @NotNull
    private Long flightClassId;
    @NotNull
    private LocalDate departureDate;
    private String tripType = "one_way";
    private Long returnFlightId;
    private LocalDate returnDepartureDate;
    @Min(1)
    private Integer passengerCount = 1;
    @NotBlank
    private String contactName;
    @NotBlank
    private String contactPhone;
    private String contactEmail;
    private String specialRequests;
}

