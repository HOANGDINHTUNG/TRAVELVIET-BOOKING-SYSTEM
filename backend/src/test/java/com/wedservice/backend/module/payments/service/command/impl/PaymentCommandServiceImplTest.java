package com.wedservice.backend.module.payments.service.command.impl;

import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.module.bookings.entity.Booking;
import com.wedservice.backend.module.bookings.entity.BookingPaymentStatus;
import com.wedservice.backend.module.bookings.entity.BookingStatus;
import com.wedservice.backend.module.bookings.repository.BookingRepository;
import com.wedservice.backend.module.payments.dto.request.CreatePaymentRequest;
import com.wedservice.backend.module.payments.dto.response.PaymentResponse;
import com.wedservice.backend.module.payments.entity.Payment;
import com.wedservice.backend.module.payments.entity.PaymentStatus;
import com.wedservice.backend.module.payments.repository.PaymentRepository;
import com.wedservice.backend.module.payments.service.BookingPaidSideEffectsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentCommandServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private AuthenticatedUserProvider authenticatedUserProvider;

    @Mock
    private BookingPaidSideEffectsService bookingPaidSideEffectsService;

    private PaymentCommandServiceImpl paymentCommandService;

    @BeforeEach
    void setUp() {
        paymentCommandService = new PaymentCommandServiceImpl(
                paymentRepository,
                bookingRepository,
                authenticatedUserProvider,
                bookingPaidSideEffectsService
        );
    }

    @Test
    void createPayment_marksPaymentAndBookingAsPaid() {
        UUID userId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(15L)
                .userId(userId)
                .orderId(900L)
                .tourId(2L)
                .scheduleId(3L)
                .voucherId(7L)
                .contactName("Nguyen Van B")
                .contactPhone("0909111111")
                .status(BookingStatus.PENDING_PAYMENT)
                .paymentStatus(BookingPaymentStatus.UNPAID)
                .finalAmount(new BigDecimal("1500000"))
                .build();

        CreatePaymentRequest request = CreatePaymentRequest.builder()
                .bookingId(15L)
                .paymentMethod("qr")
                .provider("vnpay")
                .transactionRef("TXN-001")
                .amount(new BigDecimal("1500000"))
                .build();

        when(bookingRepository.findById(15L)).thenReturn(Optional.of(booking));
        when(paymentRepository.existsByBookingIdAndStatus(15L, PaymentStatus.PAID)).thenReturn(false);
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment payment = invocation.getArgument(0);
            payment.setId(50L);
            return payment;
        });
        PaymentResponse response = paymentCommandService.createPayment(request);

        ArgumentCaptor<Payment> paymentCaptor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(paymentCaptor.capture());
        assertThat(paymentCaptor.getValue().getStatus()).isEqualTo(PaymentStatus.PAID);
        assertThat(paymentCaptor.getValue().getOrderId()).isEqualTo(900L);

        verify(bookingPaidSideEffectsService).applyAfterPaymentRecorded(
                org.mockito.ArgumentMatchers.eq(booking),
                org.mockito.ArgumentMatchers.eq(userId),
                org.mockito.ArgumentMatchers.eq("Payment recorded")
        );

        assertThat(response.getId()).isEqualTo(50L);
        assertThat(response.getStatus()).isEqualTo("paid");
        assertThat(response.getOrderId()).isEqualTo(900L);
    }

    @Test
    void createPayment_rejectsAmountMismatch() {
        UUID userId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(15L)
                .userId(userId)
                .status(BookingStatus.PENDING_PAYMENT)
                .paymentStatus(BookingPaymentStatus.UNPAID)
                .finalAmount(new BigDecimal("1500000"))
                .build();

        CreatePaymentRequest request = CreatePaymentRequest.builder()
                .bookingId(15L)
                .paymentMethod("qr")
                .amount(new BigDecimal("1499999"))
                .build();

        when(bookingRepository.findById(15L)).thenReturn(Optional.of(booking));
        when(paymentRepository.existsByBookingIdAndStatus(15L, PaymentStatus.PAID)).thenReturn(false);
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);

        assertThatThrownBy(() -> paymentCommandService.createPayment(request))
                .hasMessageContaining("api.error.payment.amountMismatch");

        verify(paymentRepository, never()).save(any(Payment.class));
        verify(bookingPaidSideEffectsService, never()).applyAfterPaymentRecorded(
                any(), any(), any());
    }

    @Test
    void createPayment_rejectsAlreadyPaidBooking() {
        UUID userId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(15L)
                .userId(userId)
                .status(BookingStatus.CONFIRMED)
                .paymentStatus(BookingPaymentStatus.PAID)
                .finalAmount(new BigDecimal("1500000"))
                .build();

        CreatePaymentRequest request = CreatePaymentRequest.builder()
                .bookingId(15L)
                .paymentMethod("qr")
                .amount(new BigDecimal("1500000"))
                .build();

        when(bookingRepository.findById(15L)).thenReturn(Optional.of(booking));
        when(authenticatedUserProvider.isCurrentUserBackoffice()).thenReturn(false);
        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);

        assertThatThrownBy(() -> paymentCommandService.createPayment(request))
                .hasMessageContaining("api.error.payment.alreadyCompleted");

        verify(paymentRepository, never()).save(any(Payment.class));
        verify(bookingPaidSideEffectsService, never()).applyAfterPaymentRecorded(
                any(), any(), any());
    }
}
