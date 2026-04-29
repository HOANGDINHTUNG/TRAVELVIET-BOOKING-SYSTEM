package com.wedservice.backend.module.bookings.service.query.impl;

import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.module.bookings.dto.response.BookingResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingStatusHistoryResponse;
import com.wedservice.backend.module.bookings.entity.Booking;
import com.wedservice.backend.module.bookings.entity.BookingStatusHistory;
import com.wedservice.backend.module.bookings.repository.BookingRepository;
import com.wedservice.backend.module.bookings.repository.BookingStatusHistoryRepository;
import com.wedservice.backend.module.bookings.service.query.BookingQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingQueryServiceImpl implements BookingQueryService {

    private final BookingRepository bookingRepository;
    private final BookingStatusHistoryRepository bookingStatusHistoryRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @Override
    public BookingResponse getBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        ensureCanAccessBooking(booking);

        return toResponse(booking);
    }

    @Override
    public List<BookingResponse> getMyBookings() {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(authenticatedUserProvider.getRequiredCurrentUserId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .tourId(booking.getTourId())
                .scheduleId(booking.getScheduleId())
                .status(booking.getStatus().getValue())
                .paymentStatus(booking.getPaymentStatus().getValue())
                .contactName(booking.getContactName())
                .contactPhone(booking.getContactPhone())
                .contactEmail(booking.getContactEmail())
                .adults(booking.getAdults())
                .children(booking.getChildren())
                .infants(booking.getInfants())
                .seniors(booking.getSeniors())
                .subtotalAmount(booking.getSubtotalAmount())
                .discountAmount(booking.getDiscountAmount())
                .voucherDiscountAmount(booking.getVoucherDiscountAmount())
                .loyaltyDiscountAmount(booking.getLoyaltyDiscountAmount())
                .addonAmount(booking.getAddonAmount())
                .taxAmount(booking.getTaxAmount())
                .finalAmount(booking.getFinalAmount())
                .voucherId(booking.getVoucherId())
                .comboId(booking.getComboId())
                .currency(booking.getCurrency())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    @Override
    public List<BookingStatusHistoryResponse> getBookingStatusHistory(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        ensureCanAccessBooking(booking);

        return bookingStatusHistoryRepository.findByBookingIdOrderByCreatedAtAsc(id).stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    private BookingStatusHistoryResponse toHistoryResponse(BookingStatusHistory history) {
        return BookingStatusHistoryResponse.builder()
                .id(history.getId())
                .oldStatus(history.getOldStatus() == null ? null : history.getOldStatus().getValue())
                .newStatus(history.getNewStatus().getValue())
                .changedBy(history.getChangedBy() == null ? null : history.getChangedBy().toString())
                .changeReason(history.getChangeReason())
                .createdAt(history.getCreatedAt())
                .build();
    }

    private void ensureCanAccessBooking(Booking booking) {
        if (authenticatedUserProvider.isCurrentUserBackoffice()) {
            return;
        }
        if (!authenticatedUserProvider.getRequiredCurrentUserId().equals(booking.getUserId())) {
            throw new AccessDeniedException("You do not have permission to access this booking");
        }
    }
}
