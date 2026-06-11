package com.wedservice.backend.module.bookings.service.command.impl;

import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.module.bookings.dto.request.BookingProductLineRequest;
import com.wedservice.backend.module.bookings.dto.request.BookingQuoteRequest;
import com.wedservice.backend.module.bookings.dto.request.CreateBookingRequest;
import com.wedservice.backend.module.bookings.dto.request.CreatePassengerRequest;
import com.wedservice.backend.module.bookings.dto.response.AppliedComboQuoteResponse;
import com.wedservice.backend.module.bookings.dto.response.AppliedProductQuoteResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingQuoteResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingResponse;
import com.wedservice.backend.module.bookings.service.BookingPricingService;
import com.wedservice.backend.module.bookings.service.BookingStatusHistoryRecorder;
import com.wedservice.backend.module.bookings.entity.Booking;
import com.wedservice.backend.module.bookings.entity.BookingComboItem;
import com.wedservice.backend.module.bookings.entity.BookingProduct;
import com.wedservice.backend.module.bookings.entity.BookingPassenger;
import com.wedservice.backend.module.bookings.entity.BookingPaymentStatus;
import com.wedservice.backend.module.bookings.entity.BookingStatus;
import com.wedservice.backend.module.bookings.repository.BookingComboItemRepository;
import com.wedservice.backend.module.bookings.repository.BookingProductRepository;
import com.wedservice.backend.module.bookings.repository.BookingPassengerRepository;
import com.wedservice.backend.module.bookings.repository.BookingRepository;
import com.wedservice.backend.module.bookings.validator.BookingValidator;
import com.wedservice.backend.module.commerce.repository.ProductRepository;
import com.wedservice.backend.module.orders.entity.Order;
import com.wedservice.backend.module.orders.repository.OrderItemRepository;
import com.wedservice.backend.module.orders.repository.OrderRepository;
import com.wedservice.backend.module.tours.entity.Tour;
import com.wedservice.backend.module.tours.repository.TourRepository;
import com.wedservice.backend.module.loyalty.service.MissionTrackerService;
import com.wedservice.backend.module.loyalty.service.UserPassportService;
import com.wedservice.backend.module.tours.event.TourStatsSyncPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingCommandServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingPassengerRepository passengerRepository;

    @Mock
    private BookingComboItemRepository bookingComboItemRepository;

    @Mock
    private BookingProductRepository bookingProductRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private BookingPricingService bookingPricingService;

    @Mock
    private AuthenticatedUserProvider authenticatedUserProvider;

    @Mock
    private BookingStatusHistoryRecorder bookingStatusHistoryRecorder;

    @Mock
    private TourStatsSyncPublisher tourStatsSyncPublisher;

    @Mock
    private UserPassportService userPassportService;
 
    @Mock
    private MissionTrackerService missionTrackerService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private TourRepository tourRepository;

    private BookingCommandServiceImpl bookingCommandService;

    @BeforeEach
    void setUp() {
        bookingCommandService = new BookingCommandServiceImpl(
                bookingRepository,
                bookingComboItemRepository,
                bookingProductRepository,
                productRepository,
                passengerRepository,
                authenticatedUserProvider,
                new BookingValidator(bookingRepository),
                bookingPricingService,
                bookingStatusHistoryRecorder,
                tourStatsSyncPublisher,
                userPassportService,
                missionTrackerService,
                orderRepository,
                orderItemRepository,
                tourRepository
        );
    }

    @Test
    void createBooking_withoutUserIdForCustomerUsesCurrentUser() {
        UUID currentUserId = UUID.randomUUID();
        CreateBookingRequest request = CreateBookingRequest.builder()
                .tourId(10L)
                .scheduleId(22L)
                .contactName("Nguyen Van A")
                .contactPhone("0909000000")
                .adults(1)
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(currentUserId);
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(bookingPricingService.quoteBookingForUser(org.mockito.ArgumentMatchers.eq(currentUserId), any(BookingQuoteRequest.class)))
                .thenReturn(BookingQuoteResponse.builder()
                        .tourId(10L)
                        .scheduleId(22L)
                        .subtotalAmount(new BigDecimal("1200000"))
                        .discountAmount(BigDecimal.ZERO)
                        .voucherDiscountAmount(BigDecimal.ZERO)
                        .loyaltyDiscountAmount(BigDecimal.ZERO)
                        .addonAmount(BigDecimal.ZERO)
                        .taxAmount(BigDecimal.ZERO)
                        .finalAmount(new BigDecimal("1200000"))
                        .currency("VND")
                        .build());
        stubTourLookup(10L);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(500L);
            return order;
        });
        when(orderItemRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(100L);
            return booking;
        });

        BookingResponse response = bookingCommandService.createBooking(request);

        ArgumentCaptor<Booking> bookingCaptor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(bookingCaptor.capture());
        assertThat(bookingCaptor.getValue().getUserId()).isEqualTo(currentUserId);
        assertThat(bookingCaptor.getValue().getOrderId()).isEqualTo(500L);
        assertThat(response.getId()).isEqualTo(100L);
        verify(orderRepository).save(any(Order.class));
        verify(orderItemRepository).save(any());
        verify(bookingProductRepository, never()).save(any(BookingProduct.class));
        verify(productRepository, never()).decrementStockIfEnough(any(Long.class), any(Integer.class));
    }

    @Test
    void createBooking_persistsProductLinesAndDecrementsStock() {
        UUID currentUserId = UUID.randomUUID();
        CreateBookingRequest request = CreateBookingRequest.builder()
                .tourId(10L)
                .scheduleId(22L)
                .contactName("Nguyen Van A")
                .contactPhone("0909000000")
                .adults(1)
                .bookingProducts(List.of(
                        BookingProductLineRequest.builder().productId(3L).quantity(2).build()
                ))
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(currentUserId);
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(bookingPricingService.quoteBookingForUser(eq(currentUserId), any(BookingQuoteRequest.class)))
                .thenReturn(BookingQuoteResponse.builder()
                        .tourId(10L)
                        .scheduleId(22L)
                        .subtotalAmount(new BigDecimal("100.00"))
                        .discountAmount(BigDecimal.ZERO)
                        .voucherDiscountAmount(BigDecimal.ZERO)
                        .loyaltyDiscountAmount(BigDecimal.ZERO)
                        .addonAmount(new BigDecimal("30.00"))
                        .productsAmount(new BigDecimal("30.00"))
                        .taxAmount(BigDecimal.ZERO)
                        .finalAmount(new BigDecimal("130.00"))
                        .currency("VND")
                        .appliedProducts(List.of(
                                AppliedProductQuoteResponse.builder()
                                        .productId(3L)
                                        .sku("SKU3")
                                        .name("Hat")
                                        .quantity(2)
                                        .unitPrice(new BigDecimal("15.00"))
                                        .lineTotal(new BigDecimal("30.00"))
                                        .build()
                        ))
                        .build());
        stubTourLookup(10L);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(502L);
            return order;
        });
        when(orderItemRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(101L);
            return booking;
        });
        when(bookingProductRepository.save(any(BookingProduct.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productRepository.decrementStockIfEnough(3L, 2)).thenReturn(1);

        bookingCommandService.createBooking(request);

        ArgumentCaptor<List> productCaptor = ArgumentCaptor.forClass(List.class);
        verify(bookingProductRepository).saveAll(productCaptor.capture());
        BookingProduct savedProduct = (BookingProduct) productCaptor.getValue().get(0);
        assertThat(savedProduct.getBookingId()).isEqualTo(101L);
        assertThat(savedProduct.getProductId()).isEqualTo(3L);
        assertThat(savedProduct.getQuantity()).isEqualTo(2);
        assertThat(savedProduct.getUnitPrice()).isEqualByComparingTo("15.00");
        assertThat(savedProduct.getLineTotal()).isEqualByComparingTo("30.00");
        verify(productRepository).decrementStockIfEnough(3L, 2);
    }

    @Test
    void createBooking_usesCurrentUserCalculatesAmountsAndMapsPassengers() {
        UUID currentUserId = UUID.randomUUID();
        CreateBookingRequest request = CreateBookingRequest.builder()
                .userId(UUID.randomUUID().toString())
                .tourId(10L)
                .scheduleId(22L)
                .contactName("Nguyen Van A")
                .contactPhone("0909000000")
                .contactEmail("a@example.com")
                .adults(2)
                .children(1)
                .infants(1)
                .seniors(1)
                .comboId(6L)
                .passengers(List.of(
                        CreatePassengerRequest.builder()
                                .fullName("Passenger One")
                                .passengerType("adult")
                                .gender("male")
                                .dateOfBirth("1990-01-15")
                                .phone("0909 000 000")
                                .email("PASSENGER1@EXAMPLE.COM")
                                .build(),
                        CreatePassengerRequest.builder()
                                .fullName("Passenger Two")
                                .passengerType("child")
                                .gender("female")
                                .dateOfBirth("2015-06-01")
                                .build()
                ))
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(currentUserId);
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(bookingPricingService.quoteBookingForUser(org.mockito.ArgumentMatchers.eq(currentUserId), any(BookingQuoteRequest.class)))
                .thenReturn(BookingQuoteResponse.builder()
                        .tourId(10L)
                        .scheduleId(22L)
                        .subtotalAmount(new java.math.BigDecimal("350.00"))
                        .discountAmount(new java.math.BigDecimal("70.00"))
                        .voucherDiscountAmount(new java.math.BigDecimal("20.00"))
                        .loyaltyDiscountAmount(java.math.BigDecimal.ZERO)
                        .addonAmount(new java.math.BigDecimal("200.00"))
                        .taxAmount(java.math.BigDecimal.ZERO)
                        .finalAmount(new java.math.BigDecimal("530.00"))
                        .currency("VND")
                        .appliedVoucher(com.wedservice.backend.module.bookings.dto.response.AppliedVoucherQuoteResponse.builder()
                                .voucherId(5L)
                                .build())
                        .appliedCombo(AppliedComboQuoteResponse.builder()
                                .comboId(6L)
                                .comboCode("COMBO-001")
                                .comboName("Adventure Combo")
                                .unitPrice(new java.math.BigDecimal("250.00"))
                                .discountAmount(new java.math.BigDecimal("50.00"))
                                .finalPrice(new java.math.BigDecimal("200.00"))
                                .build())
                        .build());
        stubTourLookup(10L);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(501L);
            return order;
        });
        when(orderItemRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(99L);
            return booking;
        });
        when(bookingComboItemRepository.save(any(BookingComboItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(passengerRepository.save(any(BookingPassenger.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingCommandService.createBooking(request);

        ArgumentCaptor<Booking> bookingCaptor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(bookingCaptor.capture());
        Booking savedBooking = bookingCaptor.getValue();

        assertThat(savedBooking.getUserId()).isEqualTo(currentUserId);
        assertThat(savedBooking.getStatus()).isEqualTo(BookingStatus.PENDING_PAYMENT);
        assertThat(savedBooking.getPaymentStatus()).isEqualTo(BookingPaymentStatus.UNPAID);
        assertThat(savedBooking.getSubtotalAmount()).isEqualByComparingTo("350.00");
        assertThat(savedBooking.getDiscountAmount()).isEqualByComparingTo("70.00");
        assertThat(savedBooking.getVoucherDiscountAmount()).isEqualByComparingTo("20.00");
        assertThat(savedBooking.getAddonAmount()).isEqualByComparingTo("200.00");
        assertThat(savedBooking.getFinalAmount()).isEqualByComparingTo("530.00");
        assertThat(savedBooking.getVoucherId()).isEqualTo(5L);
        assertThat(savedBooking.getComboId()).isEqualTo(6L);

        ArgumentCaptor<BookingComboItem> comboCaptor = ArgumentCaptor.forClass(BookingComboItem.class);
        verify(bookingComboItemRepository).save(comboCaptor.capture());
        assertThat(comboCaptor.getValue().getBookingId()).isEqualTo(99L);
        assertThat(comboCaptor.getValue().getComboId()).isEqualTo(6L);
        assertThat(comboCaptor.getValue().getUnitPrice()).isEqualByComparingTo("250.00");
        assertThat(comboCaptor.getValue().getDiscountAmount()).isEqualByComparingTo("50.00");
        assertThat(comboCaptor.getValue().getFinalPrice()).isEqualByComparingTo("200.00");

        ArgumentCaptor<List> passengerCaptor = ArgumentCaptor.forClass(List.class);
        verify(passengerRepository).saveAll(passengerCaptor.capture());
        List<BookingPassenger> savedPassengers = (List<BookingPassenger>) passengerCaptor.getValue();
        assertThat(savedPassengers).hasSize(2);
        assertThat(savedPassengers.get(0).getBookingId()).isEqualTo(99L);
        assertThat(savedPassengers.get(0).getDateOfBirth()).isEqualTo(LocalDate.of(1990, 1, 15));
        assertThat(savedPassengers.get(0).getPhone()).isEqualTo("0909000000");
        assertThat(savedPassengers.get(0).getEmail()).isEqualTo("passenger1@example.com");
        assertThat(savedPassengers.get(1).getPassengerType()).isEqualTo("child");

        assertThat(response.getId()).isEqualTo(99L);
        assertThat(response.getStatus()).isEqualTo("pending_payment");
        assertThat(response.getAddonAmount()).isEqualByComparingTo("200.00");
        assertThat(response.getFinalAmount()).isEqualByComparingTo("530.00");
        assertThat(response.getComboId()).isEqualTo(6L);
        verify(bookingStatusHistoryRecorder).record(
                99L,
                null,
                BookingStatus.PENDING_PAYMENT,
                currentUserId,
                "Booking created"
        );
        verify(tourStatsSyncPublisher).requestSync(22L, 10L);
        verify(orderRepository).save(any(Order.class));
        verify(orderItemRepository).save(any());
    }

    private void stubTourLookup(long tourId) {
        Tour tour = new Tour();
        tour.setId(tourId);
        tour.setName("Test tour " + tourId);
        when(tourRepository.findById(tourId)).thenReturn(Optional.of(tour));
    }

    @Test
    void createBooking_rejectsScheduleThatDoesNotBelongToTour() {
        UUID currentUserId = UUID.randomUUID();
        CreateBookingRequest request = CreateBookingRequest.builder()
                .userId(currentUserId.toString())
                .tourId(10L)
                .scheduleId(22L)
                .contactName("Nguyen Van A")
                .contactPhone("0909000000")
                .adults(1)
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(currentUserId);
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(bookingPricingService.quoteBookingForUser(org.mockito.ArgumentMatchers.eq(currentUserId), any(BookingQuoteRequest.class)))
                .thenThrow(com.wedservice.backend.common.exception.BadRequestException.i18n("api.error.booking.scheduleWrongTour"));

        assertThatThrownBy(() -> bookingCommandService.createBooking(request))
                .hasMessageContaining("api.error.booking.scheduleWrongTour");
    }

    @Test
    void cancelBooking_movesPaidConfirmedBookingToCancelRequested() {
        UUID userId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(44L)
                .bookingCode("BK44")
                .userId(userId)
                .tourId(10L)
                .scheduleId(22L)
                .status(BookingStatus.CONFIRMED)
                .paymentStatus(BookingPaymentStatus.PAID)
                .finalAmount(new BigDecimal("1000"))
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(bookingRepository.findById(44L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingCommandService.cancelBooking(44L, "Customer requested cancellation");

        assertThat(response.getStatus()).isEqualTo("cancel_requested");
        verify(bookingStatusHistoryRecorder).record(
                44L,
                BookingStatus.CONFIRMED,
                BookingStatus.CANCEL_REQUESTED,
                userId,
                "Customer requested cancellation"
        );
        verify(tourStatsSyncPublisher).requestSync(22L, 10L);
    }

    @Test
    void checkInBooking_requiresConfirmedAndPaidBooking() {
        UUID userId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(45L)
                .userId(userId)
                .status(BookingStatus.PENDING_PAYMENT)
                .paymentStatus(BookingPaymentStatus.UNPAID)
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(bookingRepository.findById(45L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingCommandService.checkInBooking(45L, "Arrival at gate"))
                .hasMessageContaining("api.error.booking.checkInRequiresConfirmed");
    }

    @Test
    void checkInBooking_recordsUserCheckinAfterStatusUpdate() {
        UUID userId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(46L)
                .bookingCode("BK46")
                .userId(userId)
                .status(BookingStatus.CONFIRMED)
                .paymentStatus(BookingPaymentStatus.PAID)
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(bookingRepository.findById(46L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingCommandService.checkInBooking(46L, "Arrival at gate");

        assertThat(response.getStatus()).isEqualTo("checked_in");
        verify(userPassportService).recordBookingCheckIn(booking, "Arrival at gate");
    }
}
