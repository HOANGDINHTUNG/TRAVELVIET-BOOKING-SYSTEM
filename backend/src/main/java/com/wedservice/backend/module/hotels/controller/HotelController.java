package com.wedservice.backend.module.hotels.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.hotels.dto.request.HotelSearchRequest;
import com.wedservice.backend.module.hotels.dto.response.HotelResponse;
import com.wedservice.backend.module.hotels.dto.response.HotelDetailResponse;
import com.wedservice.backend.module.hotels.facade.HotelFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelFacade hotelFacade;

    @GetMapping
    public ApiResponse<PageResponse<HotelResponse>> searchHotels(@Valid @ModelAttribute HotelSearchRequest request) {
        return ApiResponse.success(hotelFacade.search(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<HotelResponse> getHotel(
            @PathVariable Long id,
            @RequestParam(required = false) LocalDate checkinDate,
            @RequestParam(required = false) LocalDate checkoutDate
    ) {
        return ApiResponse.success(hotelFacade.getById(id, checkinDate, checkoutDate));
    }

    @GetMapping("/{id}/detail")
    public ApiResponse<HotelDetailResponse> getHotelDetail(
            @PathVariable Long id,
            @RequestParam(required = false) LocalDate checkinDate,
            @RequestParam(required = false) LocalDate checkoutDate
    ) {
        return ApiResponse.success(hotelFacade.getDetailById(id, checkinDate, checkoutDate));
    }
}

