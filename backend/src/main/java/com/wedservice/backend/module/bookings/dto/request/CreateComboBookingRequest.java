package com.wedservice.backend.module.bookings.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateComboBookingRequest {
    @NotNull
    private Long comboId;
    private LocalDate travelStartDate;
    private LocalDate travelEndDate;
    private String selectionSnapshotJson;
    @NotBlank
    private String contactName;
    @NotBlank
    private String contactPhone;
    private String contactEmail;
    private String specialRequests;
}

