package com.wedservice.backend.module.bookings.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.bookings.dto.request.BookingAdminSearchRequest;
import com.wedservice.backend.module.bookings.dto.response.BookingResponse;
import com.wedservice.backend.module.bookings.facade.BookingFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final BookingFacade bookingFacade;

    @GetMapping
    @PreAuthorize(
            "hasAuthority('booking.view') and hasAnyRole("
                    + "'SUPER_ADMIN','ADMIN','OPERATOR','FIELD_STAFF','CONTENT_EDITOR'"
                    + ")"
    )
    public ApiResponse<PageResponse<BookingResponse>> searchBookings(
            @Validated BookingAdminSearchRequest request
    ) {
        return ApiResponse.success(PageResponse.of(bookingFacade.searchAdminBookings(request)));
    }
}
