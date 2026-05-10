package com.wedservice.backend.module.payments.service;

import com.wedservice.backend.module.bookings.service.BookingStatusHistoryRecorder;
import com.wedservice.backend.module.bookings.entity.Booking;
import com.wedservice.backend.module.bookings.entity.BookingPaymentStatus;
import com.wedservice.backend.module.bookings.entity.BookingStatus;
import com.wedservice.backend.module.bookings.repository.BookingRepository;
import com.wedservice.backend.module.orders.entity.OrderStatus;
import com.wedservice.backend.module.orders.repository.OrderRepository;
import com.wedservice.backend.module.promotions.repository.VoucherRepository;
import com.wedservice.backend.module.promotions.repository.VoucherUserClaimRepository;
import com.wedservice.backend.module.tours.service.TourRuntimeStatsSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Side effects when a booking is considered paid: order, vouchers, tour stats, status history.
 * Shared by manual {@link com.wedservice.backend.module.payments.service.command.impl.PaymentCommandServiceImpl}
 * and gateway flows (e.g. VNPay IPN).
 */
@Service
@RequiredArgsConstructor
public class BookingPaidSideEffectsService {

    private final BookingRepository bookingRepository;
    private final OrderRepository orderRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherUserClaimRepository voucherUserClaimRepository;
    private final BookingStatusHistoryRecorder bookingStatusHistoryRecorder;
    private final TourRuntimeStatsSyncService tourRuntimeStatsSyncService;

    @Transactional
    public void applyAfterPaymentRecorded(Booking booking, UUID actorUserId, String historyReason) {
        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(BookingPaymentStatus.PAID);
        bookingRepository.save(booking);
        markOrderPaidIfPresent(booking);
        markVoucherUsageIfPresent(booking);
        tourRuntimeStatsSyncService.syncScheduleState(booking.getScheduleId());
        tourRuntimeStatsSyncService.syncTourBookingStats(booking.getTourId());
        if (oldStatus != booking.getStatus()) {
            bookingStatusHistoryRecorder.record(
                    booking.getId(),
                    oldStatus,
                    booking.getStatus(),
                    actorUserId,
                    historyReason
            );
        }
    }

    private void markOrderPaidIfPresent(Booking booking) {
        if (booking.getOrderId() == null) {
            return;
        }
        orderRepository.findById(booking.getOrderId()).ifPresent(order -> {
            order.setStatus(OrderStatus.PAID);
            order.setPaymentStatus(BookingPaymentStatus.PAID);
            if (order.getPlacedAt() == null) {
                order.setPlacedAt(java.time.LocalDateTime.now());
            }
            orderRepository.save(order);
        });
    }

    private void markVoucherUsageIfPresent(Booking booking) {
        if (booking.getVoucherId() == null) {
            return;
        }

        voucherRepository.findById(booking.getVoucherId()).ifPresent(voucher -> {
            voucher.setUsedCount(safeInteger(voucher.getUsedCount()) + 1);
            voucherRepository.save(voucher);
        });

        voucherUserClaimRepository.findByVoucherIdAndUserId(booking.getVoucherId(), booking.getUserId()).ifPresent(claim -> {
            claim.setUsedCount(safeInteger(claim.getUsedCount()) + 1);
            voucherUserClaimRepository.save(claim);
        });
    }

    private static int safeInteger(Integer value) {
        return value == null ? 0 : value;
    }
}
