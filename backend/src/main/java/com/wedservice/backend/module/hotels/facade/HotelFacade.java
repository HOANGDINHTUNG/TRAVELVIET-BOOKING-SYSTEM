package com.wedservice.backend.module.hotels.facade;

import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.hotels.dto.request.HotelRequest;
import com.wedservice.backend.module.hotels.dto.request.HotelSearchRequest;
import com.wedservice.backend.module.hotels.dto.response.HotelResponse;
import com.wedservice.backend.module.hotels.dto.response.HotelDetailResponse;
import com.wedservice.backend.module.hotels.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class HotelFacade {
    private final HotelService hotelService;

    public PageResponse<HotelResponse> search(HotelSearchRequest request) {
        return hotelService.search(request);
    }

    public HotelResponse getById(Long id, LocalDate checkinDate, LocalDate checkoutDate) {
        return hotelService.getById(id, checkinDate, checkoutDate);
    }

    public HotelDetailResponse getDetailById(Long id, LocalDate checkinDate, LocalDate checkoutDate) {
        return hotelService.getDetailById(id, checkinDate, checkoutDate);
    }

    public HotelResponse create(HotelRequest request) {
        return hotelService.create(request);
    }

    public HotelResponse update(Long id, HotelRequest request) {
        return hotelService.update(id, request);
    }
}

