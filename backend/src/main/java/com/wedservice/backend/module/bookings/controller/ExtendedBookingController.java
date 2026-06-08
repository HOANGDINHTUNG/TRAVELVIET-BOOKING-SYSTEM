package com.wedservice.backend.module.bookings.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.bookings.dto.request.CreateComboBookingRequest;
import com.wedservice.backend.module.bookings.dto.request.CreateFlightBookingRequest;
import com.wedservice.backend.module.bookings.dto.request.CreateHotelBookingRequest;
import com.wedservice.backend.module.bookings.dto.response.ExtendedBookingResponse;
import com.wedservice.backend.module.bookings.facade.ExtendedBookingFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class ExtendedBookingController {

    private final ExtendedBookingFacade extendedBookingFacade;

    @PostMapping("/hotels")
    public ApiResponse<ExtendedBookingResponse> createHotelBooking(@Valid @RequestBody CreateHotelBookingRequest request) {
        return ApiResponse.success(extendedBookingFacade.createHotelBooking(request));
    }

    @PostMapping("/flights")
    public ApiResponse<ExtendedBookingResponse> createFlightBooking(@Valid @RequestBody CreateFlightBookingRequest request) {
        return ApiResponse.success(extendedBookingFacade.createFlightBooking(request));
    }

    @PostMapping("/combos")
    public ApiResponse<ExtendedBookingResponse> createComboBooking(@Valid @RequestBody CreateComboBookingRequest request) {
        return ApiResponse.success(extendedBookingFacade.createComboBooking(request));
    }
}

