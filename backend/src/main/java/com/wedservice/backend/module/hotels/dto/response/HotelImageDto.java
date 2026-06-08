package com.wedservice.backend.module.hotels.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HotelImageDto {
    private Long id;
    private String mediaUrl;
    private String altText;
    private Boolean isCover;
}
