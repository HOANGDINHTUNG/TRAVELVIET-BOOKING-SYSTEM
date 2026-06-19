package com.wedservice.backend.module.hotels.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class HotelDetailResponse {
    private HotelResponse basicInfo;
    private List<String> amenities;
    private List<HotelImageDto> images;
    private List<RoomTypeResponse> roomTypes;
}
