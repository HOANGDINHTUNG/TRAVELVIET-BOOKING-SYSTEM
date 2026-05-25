package com.wedservice.backend.module.bookings.service.query;

import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.bookings.dto.request.BookingAdminSearchRequest;
import com.wedservice.backend.module.bookings.dto.response.BookingResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingSummaryResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingStatusHistoryResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingQueryService {
    BookingResponse getBooking(Long id);

    List<BookingSummaryResponse> getMyBookings();

    List<BookingSummaryResponse> getMyBookings(Integer size, LocalDateTime cursorCreatedAt, Long cursorId);

    PageResponse<BookingResponse> searchAdminBookings(BookingAdminSearchRequest request);

    List<BookingStatusHistoryResponse> getBookingStatusHistory(Long id);
}
