package com.wedservice.backend.module.tours.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourNextScheduleSummaryResponse {
    private Long scheduleId;
    private String scheduleCode;
    private LocalDateTime departureAt;
    private LocalDateTime returnAt;
    private Integer remainingSeats;
    private Integer capacityTotal;
    private String meetingPointName;
    private BigDecimal adultPrice;
}
