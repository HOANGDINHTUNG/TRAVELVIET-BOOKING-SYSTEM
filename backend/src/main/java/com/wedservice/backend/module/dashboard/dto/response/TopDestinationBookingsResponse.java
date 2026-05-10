package com.wedservice.backend.module.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopDestinationBookingsResponse {

    private Long destinationId;
    private String destinationName;
    private String destinationCode;
    private long bookingCount;
}
