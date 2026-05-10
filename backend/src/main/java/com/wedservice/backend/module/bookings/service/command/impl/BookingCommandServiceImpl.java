package com.wedservice.backend.module.bookings.service.command.impl;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.util.DataNormalizer;
import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.module.bookings.service.BookingStatusHistoryRecorder;
import com.wedservice.backend.module.bookings.dto.request.CreateBookingRequest;
import com.wedservice.backend.module.bookings.dto.request.BookingQuoteRequest;
import com.wedservice.backend.module.bookings.dto.request.CreatePassengerRequest;
import com.wedservice.backend.module.bookings.dto.response.BookingQuoteResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingResponse;
import com.wedservice.backend.module.bookings.entity.Booking;
import com.wedservice.backend.module.bookings.dto.response.AppliedProductQuoteResponse;
import com.wedservice.backend.module.bookings.entity.BookingComboItem;
import com.wedservice.backend.module.bookings.entity.BookingProduct;
import com.wedservice.backend.module.bookings.entity.BookingPaymentStatus;
import com.wedservice.backend.module.bookings.entity.BookingPassenger;
import com.wedservice.backend.module.bookings.entity.BookingStatus;
import com.wedservice.backend.module.bookings.repository.BookingComboItemRepository;
import com.wedservice.backend.module.bookings.repository.BookingProductRepository;
import com.wedservice.backend.module.bookings.repository.BookingPassengerRepository;
import com.wedservice.backend.module.bookings.repository.BookingRepository;
import com.wedservice.backend.module.bookings.service.BookingPricingService;
import com.wedservice.backend.module.bookings.service.command.BookingCommandService;
import com.wedservice.backend.module.bookings.validator.BookingValidator;
import com.wedservice.backend.module.loyalty.service.MissionTrackerService;
import com.wedservice.backend.module.loyalty.service.UserPassportService;
import com.wedservice.backend.module.orders.entity.Order;
import com.wedservice.backend.module.orders.entity.OrderItem;
import com.wedservice.backend.module.orders.entity.OrderItemType;
import com.wedservice.backend.module.orders.entity.OrderStatus;
import com.wedservice.backend.module.orders.repository.OrderItemRepository;
import com.wedservice.backend.module.orders.repository.OrderRepository;
import com.wedservice.backend.module.commerce.repository.ProductRepository;
import com.wedservice.backend.module.tours.entity.Tour;
import com.wedservice.backend.module.tours.repository.TourRepository;
import com.wedservice.backend.module.tours.service.TourRuntimeStatsSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingCommandServiceImpl implements BookingCommandService {

    private final BookingRepository bookingRepository;
    private final BookingComboItemRepository bookingComboItemRepository;
    private final BookingProductRepository bookingProductRepository;
    private final ProductRepository productRepository;
    private final BookingPassengerRepository passengerRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private final BookingValidator bookingValidator;
    private final BookingPricingService bookingPricingService;
    private final BookingStatusHistoryRecorder bookingStatusHistoryRecorder;
    private final TourRuntimeStatsSyncService tourRuntimeStatsSyncService;
    private final UserPassportService userPassportService;
    private final MissionTrackerService missionTrackerService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final TourRepository tourRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        bookingValidator.validateCreateRequest(request);
        UUID ownerId = resolveBookingOwnerId(request.getUserId());
        BookingQuoteResponse quote = bookingPricingService.quoteBookingForUser(ownerId, toQuoteRequest(request));

        String bookingSource = resolveBookingSource(request.getBookingSource());
        String specialRequests = DataNormalizer.normalize(request.getSpecialRequests());

        Order order = Order.builder()
                .orderCode("ORD" + System.currentTimeMillis())
                .userId(ownerId)
                .status(OrderStatus.PENDING_PAYMENT)
                .paymentStatus(BookingPaymentStatus.UNPAID)
                .orderSource(bookingSource)
                .currency(quote.getCurrency())
                .subtotalAmount(quote.getSubtotalAmount())
                .discountAmount(quote.getDiscountAmount())
                .voucherDiscountAmount(quote.getVoucherDiscountAmount())
                .loyaltyDiscountAmount(quote.getLoyaltyDiscountAmount())
                .addonAmount(quote.getAddonAmount())
                .taxAmount(quote.getTaxAmount())
                .finalAmount(quote.getFinalAmount())
                .note(specialRequests)
                .build();
        order = orderRepository.save(order);

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found"));

        Booking booking = Booking.builder()
                .bookingCode("BK" + System.currentTimeMillis())
                .userId(ownerId)
                .orderId(order.getId())
                .tourId(request.getTourId())
                .scheduleId(request.getScheduleId())
                .contactName(DataNormalizer.normalize(request.getContactName()))
                .contactPhone(DataNormalizer.normalizePhone(request.getContactPhone()))
                .contactEmail(DataNormalizer.normalizeEmail(request.getContactEmail()))
                .adults(request.getAdults())
                .children(request.getChildren())
                .infants(request.getInfants())
                .seniors(request.getSeniors())
                .status(BookingStatus.PENDING_PAYMENT)
                .paymentStatus(BookingPaymentStatus.UNPAID)
                .subtotalAmount(quote.getSubtotalAmount())
                .discountAmount(quote.getDiscountAmount())
                .voucherDiscountAmount(quote.getVoucherDiscountAmount())
                .loyaltyDiscountAmount(quote.getLoyaltyDiscountAmount())
                .addonAmount(quote.getAddonAmount())
                .taxAmount(quote.getTaxAmount())
                .finalAmount(quote.getFinalAmount())
                .currency(quote.getCurrency())
                .voucherId(quote.getAppliedVoucher() == null ? null : quote.getAppliedVoucher().getVoucherId())
                .comboId(quote.getAppliedCombo() == null ? null : quote.getAppliedCombo().getComboId())
                .bookingSource(bookingSource)
                .specialRequests(specialRequests)
                .build();

        booking = bookingRepository.save(booking);

        BigDecimal lineDiscounts = quote.getDiscountAmount()
                .add(quote.getVoucherDiscountAmount())
                .add(quote.getLoyaltyDiscountAmount());
        orderItemRepository.save(OrderItem.builder()
                .orderId(order.getId())
                .itemType(OrderItemType.BOOKING)
                .itemRefId(booking.getId())
                .itemName(truncateItemName(tour.getName()))
                .quantity(1)
                .unitPrice(quote.getSubtotalAmount())
                .discountAmount(lineDiscounts)
                .lineTotal(quote.getFinalAmount())
                .build());

        saveComboSnapshotIfPresent(booking, quote);
        saveProductLinesAndDecrementStock(booking, quote);
        tourRuntimeStatsSyncService.syncScheduleState(booking.getScheduleId());
        tourRuntimeStatsSyncService.syncTourBookingStats(booking.getTourId());
        bookingStatusHistoryRecorder.record(
                booking.getId(),
                null,
                booking.getStatus(),
                authenticatedUserProvider.getRequiredCurrentUserId(),
                "Booking created"
        );

        if (request.getPassengers() != null) {
            for (CreatePassengerRequest p : request.getPassengers()) {
                BookingPassenger bp = BookingPassenger.builder()
                        .bookingId(booking.getId())
                        .fullName(DataNormalizer.normalize(p.getFullName()))
                        .passengerType(bookingValidator.normalizePassengerType(p.getPassengerType()))
                        .gender(bookingValidator.normalizePassengerGender(p.getGender()))
                        .dateOfBirth(bookingValidator.parsePassengerDateOfBirth(p.getDateOfBirth()))
                        .identityNo(DataNormalizer.normalize(p.getIdentityNo()))
                        .passportNo(DataNormalizer.normalize(p.getPassportNo()))
                        .phone(DataNormalizer.normalizePhone(p.getPhone()))
                        .email(DataNormalizer.normalizeEmail(p.getEmail()))
                        .build();

                passengerRepository.save(bp);
            }
        }

        return toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id, String reason) {
        Booking booking = findAccessibleBooking(id);
        BookingStatus targetStatus = determineCancellationStatus(booking);
        return updateBookingStatus(booking, targetStatus, reason);
    }

    @Override
    @Transactional
    public BookingResponse checkInBooking(Long id, String reason) {
        Booking booking = findAccessibleBooking(id);
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw BadRequestException.i18n("api.error.booking.checkInRequiresConfirmed");
        }
        if (booking.getPaymentStatus() != BookingPaymentStatus.PAID) {
            throw BadRequestException.i18n("api.error.booking.checkInRequiresPaid");
        }
        BookingResponse response = updateBookingStatus(booking, BookingStatus.CHECKED_IN, reason);
        userPassportService.recordBookingCheckIn(booking, reason);
        return response;
    }

    @Override
    @Transactional
    public BookingResponse completeBooking(Long id, String reason) {
        Booking booking = findAccessibleBooking(id);
        if (booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw BadRequestException.i18n("api.error.booking.completeRequiresCheckedIn");
        }
        BookingResponse response = updateBookingStatus(booking, BookingStatus.COMPLETED, reason);
        missionTrackerService.incrementProgress(booking.getUserId(), "TOTAL_BOOKINGS", java.math.BigDecimal.ONE);
        return response;
    }

    private UUID resolveBookingOwnerId(String requestedUserId) {
        UUID currentUserId = authenticatedUserProvider.getRequiredCurrentUserId();
        if (!authenticatedUserProvider.isCurrentUserBackoffice()) {
            return currentUserId;
        }
        if (!StringUtils.hasText(requestedUserId)) {
            return currentUserId;
        }
        try {
            return UUID.fromString(requestedUserId);
        } catch (IllegalArgumentException ex) {
            throw BadRequestException.i18n("api.error.common.userIdUuid");
        }
    }

    private Booking findAccessibleBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (authenticatedUserProvider.isCurrentUserBackoffice()) {
            return booking;
        }
        if (!authenticatedUserProvider.getRequiredCurrentUserId().equals(booking.getUserId())) {
            throw new AccessDeniedException("You do not have permission to access this booking");
        }
        return booking;
    }

    private BookingStatus determineCancellationStatus(Booking booking) {
        if (booking.getStatus() == BookingStatus.PENDING_PAYMENT || booking.getStatus() == BookingStatus.CONFIRMED) {
            if (booking.getPaymentStatus() == BookingPaymentStatus.PAID) {
                return BookingStatus.CANCEL_REQUESTED;
            }
            return BookingStatus.CANCELLED;
        }
        throw BadRequestException.i18n("api.error.booking.cancelInvalidStatus");
    }

    private BookingResponse updateBookingStatus(Booking booking, BookingStatus newStatus, String reason) {
        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(newStatus);
        if (newStatus == BookingStatus.CANCEL_REQUESTED || newStatus == BookingStatus.CANCELLED) {
            if (StringUtils.hasText(reason)) {
                booking.setCancelReason(reason);
            }
            booking.setCancelledAt(LocalDateTime.now());
        }
        if (newStatus == BookingStatus.COMPLETED) {
            booking.setCompletedAt(LocalDateTime.now());
        }
        bookingRepository.save(booking);
        syncLinkedOrder(booking, newStatus);
        tourRuntimeStatsSyncService.syncScheduleState(booking.getScheduleId());
        tourRuntimeStatsSyncService.syncTourBookingStats(booking.getTourId());
        bookingStatusHistoryRecorder.record(
                booking.getId(),
                oldStatus,
                newStatus,
                authenticatedUserProvider.getRequiredCurrentUserId(),
                reason
        );
        return toResponse(booking);
    }

    private void syncLinkedOrder(Booking booking, BookingStatus newStatus) {
        if (booking.getOrderId() == null) {
            return;
        }
        orderRepository.findById(booking.getOrderId()).ifPresent(order -> {
            if (newStatus == BookingStatus.CANCEL_REQUESTED || newStatus == BookingStatus.CANCELLED) {
                order.setStatus(OrderStatus.CANCELLED);
                order.setCancelledAt(LocalDateTime.now());
            } else if (newStatus == BookingStatus.COMPLETED) {
                order.setStatus(OrderStatus.COMPLETED);
                order.setCompletedAt(LocalDateTime.now());
            }
            orderRepository.save(order);
        });
    }

    private String resolveBookingSource(String raw) {
        if (!StringUtils.hasText(raw)) {
            return "app";
        }
        return raw.trim();
    }

    private String truncateItemName(String name) {
        if (name == null) {
            return "Booking";
        }
        return name.length() <= 255 ? name : name.substring(0, 255);
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

    private void saveComboSnapshotIfPresent(Booking booking, BookingQuoteResponse quote) {
        if (quote.getAppliedCombo() == null) {
            return;
        }

        bookingComboItemRepository.save(BookingComboItem.builder()
                .bookingId(booking.getId())
                .comboId(quote.getAppliedCombo().getComboId())
                .unitPrice(quote.getAppliedCombo().getUnitPrice())
                .discountAmount(quote.getAppliedCombo().getDiscountAmount())
                .finalPrice(quote.getAppliedCombo().getFinalPrice())
                .build());
    }

    private void saveProductLinesAndDecrementStock(Booking booking, BookingQuoteResponse quote) {
        List<AppliedProductQuoteResponse> lines = quote.getAppliedProducts();
        if (lines == null || lines.isEmpty()) {
            return;
        }

        for (AppliedProductQuoteResponse line : lines) {
            bookingProductRepository.save(BookingProduct.builder()
                    .bookingId(booking.getId())
                    .productId(line.getProductId())
                    .quantity(line.getQuantity())
                    .unitPrice(line.getUnitPrice())
                    .lineTotal(line.getLineTotal())
                    .isFreeGift(false)
                    .build());

            int updated = productRepository.decrementStockIfEnough(line.getProductId(), line.getQuantity());
            if (updated != 1) {
                throw BadRequestException.i18n("api.error.product.out_of_stock");
            }
        }
    }

    private BookingQuoteRequest toQuoteRequest(CreateBookingRequest request) {
        return BookingQuoteRequest.builder()
                .tourId(request.getTourId())
                .scheduleId(request.getScheduleId())
                .adults(request.getAdults())
                .children(request.getChildren())
                .infants(request.getInfants())
                .seniors(request.getSeniors())
                .voucherCode(request.getVoucherCode())
                .comboId(request.getComboId())
                .bookingProducts(request.getBookingProducts())
                .build();
    }
}
