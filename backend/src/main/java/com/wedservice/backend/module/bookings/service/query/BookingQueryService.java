package com.wedservice.backend.module.bookings.service.query;

import com.wedservice.backend.module.bookings.dto.request.BookingAdminSearchRequest;
import com.wedservice.backend.module.bookings.dto.response.BookingResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingStatusHistoryResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BookingQueryService {
    BookingResponse getBooking(Long id);

    List<BookingResponse> getMyBookings();

    Page<BookingResponse> searchAdminBookings(BookingAdminSearchRequest request);

    List<BookingStatusHistoryResponse> getBookingStatusHistory(Long id);
}
