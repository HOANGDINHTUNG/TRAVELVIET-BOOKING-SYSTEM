package com.wedservice.backend.module.hotels.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.hotels.dto.request.HotelRequest;
import com.wedservice.backend.module.hotels.dto.response.HotelResponse;
import com.wedservice.backend.module.hotels.facade.HotelFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/hotels")
@RequiredArgsConstructor
public class AdminHotelController {

    private final HotelFacade hotelFacade;

    @PostMapping
    @PreAuthorize("hasAuthority('tour.create')")
    public ApiResponse<HotelResponse> create(@Valid @RequestBody HotelRequest request) {
        return ApiResponse.success(hotelFacade.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('tour.update')")
    public ApiResponse<HotelResponse> update(@PathVariable Long id, @Valid @RequestBody HotelRequest request) {
        return ApiResponse.success(hotelFacade.update(id, request));
    }
}

