package com.wedservice.backend.module.hotels.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class RoomRatePlanResponse {
    private String planId;
    private List<String> inclusionTags;
    private List<String> cancellationTags;
    private Boolean isBreakfastIncluded;
    private Boolean isNonRefundable;
    private BigDecimal defaultPrice;
    private BigDecimal originalPrice;
    private BigDecimal discountPrice;
    private String promoTag;
    private Integer remainingRooms;
}
