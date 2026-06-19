package com.wedservice.backend.module.hotels.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class RoomTypeResponse {
    private Long id;
    private String code;
    private String name;
    private String bedType;
    private Integer maxAdults;
    private Integer maxChildren;
    private Integer maxOccupancy;
    private Integer roomAreaSize;
    private String roomView;
    private Boolean isRefundable;
    private String imageUrl;
    
    private List<RoomRatePlanResponse> ratePlans;
}
