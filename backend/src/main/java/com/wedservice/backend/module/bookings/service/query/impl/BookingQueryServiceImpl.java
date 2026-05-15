package com.wedservice.backend.module.bookings.service.query.impl;

import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.module.bookings.dto.request.BookingAdminSearchRequest;
import com.wedservice.backend.module.bookings.dto.response.BookingResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingStatusHistoryResponse;
import com.wedservice.backend.module.bookings.entity.Booking;
import com.wedservice.backend.module.bookings.entity.BookingPaymentStatus;
import com.wedservice.backend.module.bookings.entity.BookingStatus;
import com.wedservice.backend.module.bookings.entity.BookingStatusHistory;
import com.wedservice.backend.module.bookings.repository.BookingRepository;
import com.wedservice.backend.module.bookings.repository.BookingStatusHistoryRepository;
import com.wedservice.backend.module.bookings.service.query.BookingQueryService;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
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

    @Override
    public Page<BookingResponse> searchAdminBookings(BookingAdminSearchRequest request) {
        if (!authenticatedUserProvider.isCurrentUserBackoffice()) {
            throw new AccessDeniedException("Admin booking search requires backoffice access");
        }
        int page = request.getPage() == null ? 0 : request.getPage();
        int size = request.getSize() == null ? 20 : request.getSize();
        String sortBy = request.getSortBy() == null ? "createdAt" : request.getSortBy();
        String sortDir = request.getSortDir() == null ? "desc" : request.getSortDir();
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);

        Specification<Booking> spec = buildAdminSpecification(request);
        return bookingRepository
                .findAll(spec, PageRequest.of(page, size, sort))
                .map(this::toResponse);
    }

    private Specification<Booking> buildAdminSpecification(BookingAdminSearchRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isNull(root.get("deletedAt")));

            if (StringUtils.hasText(request.getStatus())) {
                try {
                    BookingStatus st = BookingStatus.fromValue(request.getStatus().trim());
                    predicates.add(cb.equal(root.get("status"), st));
                } catch (IllegalArgumentException ignored) {
                    // bỏ lọc status không hợp lệ
                }
            }
            if (StringUtils.hasText(request.getPaymentStatus())) {
                try {
                    BookingPaymentStatus ps = BookingPaymentStatus.fromValue(request.getPaymentStatus().trim());
                    predicates.add(cb.equal(root.get("paymentStatus"), ps));
                } catch (IllegalArgumentException ignored) {
                    // bỏ lọc payment status không hợp lệ
                }
            }

            if (StringUtils.hasText(request.getKeyword())) {
                String raw = request.getKeyword().trim();
                String like = "%" + raw.toLowerCase() + "%";
                List<Predicate> keywordPredicates = new ArrayList<>();
                Expression<String> bookingCodeExpr = cb.coalesce(root.get("bookingCode"), cb.literal(""));
                Expression<String> contactEmailExpr = cb.coalesce(root.get("contactEmail"), cb.literal(""));
                keywordPredicates.add(cb.like(cb.lower(bookingCodeExpr), like));
                keywordPredicates.add(cb.like(cb.lower(root.get("contactName")), like));
                keywordPredicates.add(cb.like(cb.lower(root.get("contactPhone")), like));
                keywordPredicates.add(cb.like(cb.lower(contactEmailExpr), like));
                try {
                    long idMatch = Long.parseLong(raw);
                    keywordPredicates.add(cb.equal(root.get("id"), idMatch));
                } catch (NumberFormatException ignored) {
                    // không thêm điều kiện id
                }
                predicates.add(cb.or(keywordPredicates.toArray(new Predicate[0])));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .orderId(booking.getOrderId())
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
                .bookingSource(booking.getBookingSource())
                .specialRequests(booking.getSpecialRequests())
                .cancelReason(booking.getCancelReason())
                .cancelledAt(booking.getCancelledAt())
                .completedAt(booking.getCompletedAt())
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
