package com.wedservice.backend.module.bookings.service.query.impl;

import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.module.bookings.dto.request.BookingAdminSearchRequest;
import com.wedservice.backend.module.bookings.dto.response.BookingResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingStatusHistoryResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingSummaryResponse;
import com.wedservice.backend.module.bookings.entity.Booking;
import com.wedservice.backend.module.bookings.entity.BookingPaymentStatus;
import com.wedservice.backend.module.bookings.entity.BookingStatus;
import com.wedservice.backend.module.bookings.entity.BookingStatusHistory;
import com.wedservice.backend.module.bookings.repository.BookingRepository;
import com.wedservice.backend.module.bookings.repository.BookingStatusHistoryRepository;
import com.wedservice.backend.module.bookings.service.query.BookingQueryService;
import com.wedservice.backend.module.tours.entity.Tour;
import com.wedservice.backend.module.tours.entity.TourSchedule;
import com.wedservice.backend.module.tours.repository.TourRepository;
import com.wedservice.backend.module.tours.repository.TourScheduleRepository;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingQueryServiceImpl implements BookingQueryService {

    private static final int MY_BOOKINGS_DEFAULT_SIZE = 50;
    private static final int MY_BOOKINGS_MAX_SIZE = 100;

    private final BookingRepository bookingRepository;
    private final BookingStatusHistoryRepository bookingStatusHistoryRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private final TourRepository tourRepository;
    private final TourScheduleRepository tourScheduleRepository;

    @Override
    public BookingResponse getBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        ensureCanAccessBooking(booking);

        return toResponse(booking);
    }

    @Override
    public List<BookingSummaryResponse> getMyBookings() {
        return getMyBookings(MY_BOOKINGS_DEFAULT_SIZE, null, null);
    }

    @Override
    public List<BookingSummaryResponse> getMyBookings(Integer size, LocalDateTime cursorCreatedAt, Long cursorId) {
        int pageSize = size == null ? MY_BOOKINGS_DEFAULT_SIZE : Math.min(Math.max(size, 1), MY_BOOKINGS_MAX_SIZE);
        UUID userId = authenticatedUserProvider.getRequiredCurrentUserId();
        List<Booking> rows = bookingRepository.findMyBookingsKeyset(
                userId,
                cursorCreatedAt,
                cursorId,
                PageRequest.of(0, pageSize)
        );
        return toSummaryList(rows);
    }

    private List<BookingSummaryResponse> toSummaryList(List<Booking> bookings) {
        if (bookings == null || bookings.isEmpty()) {
            return List.of();
        }
        List<Long> tourIds = bookings.stream()
                .map(Booking::getTourId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        List<Long> scheduleIds = bookings.stream()
                .map(Booking::getScheduleId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        Map<Long, Tour> toursById = tourIds.isEmpty()
                ? Map.of()
                : tourRepository.findAllById(tourIds).stream()
                        .collect(Collectors.toMap(Tour::getId, t -> t, (a, b) -> a));
        Map<Long, TourSchedule> schedulesById = new HashMap<>();
        if (!scheduleIds.isEmpty()) {
            for (TourSchedule schedule : tourScheduleRepository.findAllById(scheduleIds)) {
                schedulesById.put(schedule.getId(), schedule);
            }
        }

        return bookings.stream()
                .map(booking -> toSummaryResponse(
                        booking,
                        toursById.get(booking.getTourId()),
                        schedulesById.get(booking.getScheduleId())
                ))
                .toList();
    }

    private BookingSummaryResponse toSummaryResponse(Booking booking, Tour tour, TourSchedule schedule) {
        LocalDateTime travelDate = schedule != null ? schedule.getDepartureAt() : null;
        String tourTitle = tour != null ? tour.getName() : null;
        return BookingSummaryResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .tourTitle(tourTitle)
                .totalPrice(booking.getFinalAmount())
                .currency(booking.getCurrency())
                .status(booking.getStatus().getValue())
                .paymentStatus(booking.getPaymentStatus().getValue())
                .createdAt(booking.getCreatedAt())
                .travelDate(travelDate)
                .build();
    }

    @Override
    public PageResponse<BookingResponse> searchAdminBookings(BookingAdminSearchRequest request) {
        if (!authenticatedUserProvider.isCurrentUserBackoffice()) {
            throw new AccessDeniedException("Admin booking search requires backoffice access");
        }

        boolean useKeyset = request.getCursorCreatedAt() != null && request.getCursorId() != null;
        if (useKeyset) {
            return searchAdminBookingsKeyset(request);
        }

        int page = request.getPage() == null ? 0 : request.getPage();
        int size = request.getSize() == null ? 20 : request.getSize();
        String sortBy = request.getSortBy() == null ? "createdAt" : request.getSortBy();
        String sortDir = request.getSortDir() == null ? "desc" : request.getSortDir();
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);

        Specification<Booking> spec = buildAdminSpecification(request);
        Page<Booking> result = bookingRepository.findAll(spec, PageRequest.of(page, size, sort));
        return PageResponse.of(result.map(this::toResponse));
    }

    private PageResponse<BookingResponse> searchAdminBookingsKeyset(BookingAdminSearchRequest request) {
        int size = request.getSize() == null ? 20 : request.getSize();
        Specification<Booking> spec = buildAdminSpecification(request)
                .and(keysetCursorSpec(request.getCursorCreatedAt(), request.getCursorId()));

        List<Booking> fetched = bookingRepository.findAll(
                spec,
                PageRequest.of(0, size + 1, Sort.by(Sort.Direction.DESC, "createdAt", "id"))
        ).getContent();

        boolean hasNext = fetched.size() > size;
        List<Booking> pageRows = hasNext ? fetched.subList(0, size) : fetched;
        List<BookingResponse> content = pageRows.stream().map(this::toResponse).toList();

        PageResponse<BookingResponse> response = PageResponse.<BookingResponse>builder()
                .content(content)
                .page(0)
                .size(size)
                .totalElements(-1L)
                .totalPages(-1)
                .last(!hasNext)
                .build();

        if (hasNext && !pageRows.isEmpty()) {
            Booking last = pageRows.get(pageRows.size() - 1);
            response.setNextCursorCreatedAt(last.getCreatedAt());
            response.setNextCursorId(last.getId());
        }
        return response;
    }

    private static Specification<Booking> keysetCursorSpec(LocalDateTime cursorCreatedAt, Long cursorId) {
        return (root, query, cb) -> cb.or(
                cb.lessThan(root.get("createdAt"), cursorCreatedAt),
                cb.and(
                        cb.equal(root.get("createdAt"), cursorCreatedAt),
                        cb.lessThan(root.get("id"), cursorId)
                )
        );
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
