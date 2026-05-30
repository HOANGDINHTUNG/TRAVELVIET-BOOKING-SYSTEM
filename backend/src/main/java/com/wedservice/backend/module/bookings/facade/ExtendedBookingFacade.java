package com.wedservice.backend.module.bookings.facade;

import com.wedservice.backend.module.bookings.dto.request.CreateComboBookingRequest;
import com.wedservice.backend.module.bookings.dto.request.CreateFlightBookingRequest;
import com.wedservice.backend.module.bookings.dto.request.CreateHotelBookingRequest;
import com.wedservice.backend.module.bookings.dto.response.ExtendedBookingResponse;
import com.wedservice.backend.module.bookings.service.ExtendedBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExtendedBookingFacade {
    private final ExtendedBookingService extendedBookingService;

    public ExtendedBookingResponse createHotelBooking(CreateHotelBookingRequest request) {
        return extendedBookingService.createHotelBooking(request);
    }

    public ExtendedBookingResponse createFlightBooking(CreateFlightBookingRequest request) {
        return extendedBookingService.createFlightBooking(request);
    }

    public ExtendedBookingResponse createComboBooking(CreateComboBookingRequest request) {
        return extendedBookingService.createComboBooking(request);
    }
}

