package com.wedservice.backend.module.payments.service.impl;

import tools.jackson.databind.ObjectMapper;
import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.config.VnpayProperties;
import com.wedservice.backend.module.bookings.entity.Booking;
import com.wedservice.backend.module.bookings.entity.BookingPaymentStatus;
import com.wedservice.backend.module.bookings.entity.BookingStatus;
import com.wedservice.backend.module.bookings.repository.BookingRepository;
import com.wedservice.backend.module.payments.dto.request.VnpayCreateCheckoutRequest;
import com.wedservice.backend.module.payments.dto.response.VnpayCreateCheckoutResponse;
import com.wedservice.backend.module.payments.entity.Payment;
import com.wedservice.backend.module.payments.entity.PaymentStatus;
import com.wedservice.backend.module.payments.repository.PaymentRepository;
import com.wedservice.backend.module.payments.service.BookingPaidSideEffectsService;
import com.wedservice.backend.module.payments.service.VnpayPaymentService;
import com.wedservice.backend.module.payments.util.VnpayCryptoUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VnpayPaymentServiceImpl implements VnpayPaymentService {

    private static final Set<BookingStatus> PAYABLE_BOOKING_STATUSES = Set.of(
            BookingStatus.PENDING_PAYMENT,
            BookingStatus.CONFIRMED
    );

    private static final DateTimeFormatter VNP_DATE = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final VnpayProperties vnpayProperties;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private final BookingPaidSideEffectsService bookingPaidSideEffectsService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public VnpayCreateCheckoutResponse createCheckout(VnpayCreateCheckoutRequest request, String clientIp) {
        if (!vnpayProperties.isEnabled()) {
            throw BadRequestException.i18n("api.error.payment.vnpayDisabled");
        }
        if (!StringUtils.hasText(vnpayProperties.getTmnCode()) || !StringUtils.hasText(vnpayProperties.getHashSecret())) {
            throw BadRequestException.i18n("api.error.payment.vnpayMisconfigured");
        }
        if (!StringUtils.hasText(vnpayProperties.getReturnUrl())) {
            throw BadRequestException.i18n("api.error.payment.vnpayReturnUrlMissing");
        }
        if (!StringUtils.hasText(vnpayProperties.getIpnUrl())) {
            throw BadRequestException.i18n("api.error.payment.vnpayIpnUrlMissing");
        }

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        ensureCanAccessBooking(booking);
        validateAmountAndPayableState(request.getAmount(), booking);

        Payment payment = Payment.builder()
                .paymentCode("PM" + System.currentTimeMillis())
                .bookingId(booking.getId())
                .orderId(booking.getOrderId())
                .paymentMethod("vnpay")
                .provider("vnpay")
                .amount(request.getAmount())
                .currency("VND")
                .status(PaymentStatus.UNPAID)
                .build();
        payment = paymentRepository.save(payment);
        payment.setTransactionRef(String.valueOf(payment.getId()));
        payment = paymentRepository.save(payment);

        TreeMap<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnpayProperties.getTmnCode());
        params.put("vnp_Locale", vnpayProperties.getLocale());
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", payment.getTransactionRef());
        params.put("vnp_OrderInfo", buildOrderInfo(booking));
        params.put("vnp_OrderType", "other");
        params.put("vnp_Amount", String.valueOf(toVnpAmountMinorUnits(request.getAmount())));
        params.put("vnp_ReturnUrl", vnpayProperties.getReturnUrl());
        params.put("vnp_IpnUrl", vnpayProperties.getIpnUrl());
        params.put("vnp_CreateDate", LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).format(VNP_DATE));
        params.put("vnp_IpAddr", StringUtils.hasText(clientIp) ? clientIp : "127.0.0.1");

        try {
            payment.setRequestPayload(objectMapper.writeValueAsString(params));
            paymentRepository.save(payment);
        } catch (Exception e) {
            log.warn("Could not serialize VNPay request payload: {}", e.getMessage());
        }

        String signData = VnpayCryptoUtil.buildSignData(params);
        String secureHash = VnpayCryptoUtil.hmacSha512(vnpayProperties.getHashSecret(), signData);
        params.put("vnp_SecureHash", secureHash);

        String paymentUrl = buildPayUrl(params);
        return VnpayCreateCheckoutResponse.builder()
                .paymentUrl(paymentUrl)
                .paymentId(payment.getId())
                .transactionRef(payment.getTransactionRef())
                .build();
    }

    @Override
    @Transactional
    public Map<String, String> handleIpn(HttpServletRequest request) {
        if (!vnpayProperties.isEnabled()) {
            return ipn("01", "Gateway disabled");
        }
        if (!StringUtils.hasText(vnpayProperties.getHashSecret()) || !StringUtils.hasText(vnpayProperties.getTmnCode())) {
            return ipn("97", "Misconfigured");
        }
        Map<String, String> raw = extractVnpParams(request);
        if (raw.isEmpty()) {
            return ipn("01", "Empty payload");
        }

        String receivedHash = raw.get("vnp_SecureHash");
        if (!StringUtils.hasText(receivedHash)) {
            return ipn("97", "Missing checksum");
        }

        String signData = VnpayCryptoUtil.buildSignData(raw);
        String expected = VnpayCryptoUtil.hmacSha512(vnpayProperties.getHashSecret(), signData);
        if (!VnpayCryptoUtil.secureEquals(expected, receivedHash)) {
            log.warn("VNPay IPN checksum mismatch for txnRef={}", raw.get("vnp_TxnRef"));
            return ipn("97", "Invalid checksum");
        }

        String txnRef = raw.get("vnp_TxnRef");
        if (!StringUtils.hasText(txnRef)) {
            return ipn("01", "Missing vnp_TxnRef");
        }

        Payment payment = paymentRepository.findByTransactionRefForUpdate(txnRef).orElse(null);
        if (payment == null) {
            return ipn("01", "Payment not found");
        }

        // Idempotency: VNPay may retry IPN — if already paid, acknowledge without duplicating side effects.
        if (payment.getStatus() == PaymentStatus.PAID) {
            return ipn("00", "Confirm Success");
        }

        try {
            payment.setResponsePayload(objectMapper.writeValueAsString(raw));
        } catch (Exception e) {
            log.warn("Could not serialize VNPay IPN payload: {}", e.getMessage());
        }

        String responseCode = raw.get("vnp_ResponseCode");
        String txnStatus = raw.get("vnp_TransactionStatus");
        if (!"00".equals(responseCode) || !"00".equals(txnStatus)) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            return ipn("00", "Recorded failure");
        }

        long vnpAmount = Long.parseLong(raw.get("vnp_Amount"));
        BigDecimal expectedMinor = payment.getAmount().multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.UNNECESSARY);
        if (BigDecimal.valueOf(vnpAmount).compareTo(expectedMinor) != 0) {
            log.warn("VNPay IPN amount mismatch paymentId={} expectedMinor={} got={}", payment.getId(), expectedMinor, vnpAmount);
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            return ipn("01", "Invalid amount");
        }

        Booking booking = bookingRepository.findByIdForUpdate(payment.getBookingId())
                .orElse(null);
        if (booking == null) {
            return ipn("01", "Booking not found");
        }

        if (paymentRepository.existsByBookingIdAndStatus(booking.getId(), PaymentStatus.PAID)) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            return ipn("00", "Booking already paid");
        }

        if (booking.getPaymentStatus() == BookingPaymentStatus.PAID) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            return ipn("00", "Booking already paid");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        payment.setPaymentMethod("gateway");
        paymentRepository.save(payment);

        bookingPaidSideEffectsService.applyAfterPaymentRecorded(booking, null, "VNPay IPN");

        return ipn("00", "Confirm Success");
    }

    private static Map<String, String> ipn(String code, String message) {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("RspCode", code);
        m.put("Message", message);
        return m;
    }

    private Map<String, String> extractVnpParams(HttpServletRequest request) {
        Map<String, String> map = new HashMap<>();
        java.util.Enumeration<String> names = request.getParameterNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            if (name != null && name.startsWith("vnp_")) {
                map.put(name, request.getParameter(name));
            }
        }
        return map;
    }

    private String buildOrderInfo(Booking booking) {
        String prefix = StringUtils.hasText(vnpayProperties.getOrderInfoPrefix())
                ? vnpayProperties.getOrderInfoPrefix()
                : "TravelViet";
        String code = booking.getBookingCode() != null ? booking.getBookingCode() : String.valueOf(booking.getId());
        String info = prefix + " " + code;
        if (info.length() > 255) {
            return info.substring(0, 255);
        }
        return info;
    }

    private static long toVnpAmountMinorUnits(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.UNNECESSARY).longValueExact();
    }

    private void validateAmountAndPayableState(BigDecimal amount, Booking booking) {
        if (!PAYABLE_BOOKING_STATUSES.contains(booking.getStatus())) {
            throw BadRequestException.i18n("api.error.payment.bookingNotPayable");
        }
        if (booking.getPaymentStatus() == BookingPaymentStatus.PAID
                || booking.getPaymentStatus() == BookingPaymentStatus.REFUNDED) {
            throw BadRequestException.i18n("api.error.payment.alreadyCompleted");
        }
        if (paymentRepository.existsByBookingIdAndStatus(booking.getId(), PaymentStatus.PAID)) {
            throw BadRequestException.i18n("api.error.payment.successExists");
        }
        if (booking.getFinalAmount() == null || booking.getFinalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw BadRequestException.i18n("api.error.payment.noPayableAmount");
        }
        if (amount.compareTo(booking.getFinalAmount()) != 0) {
            throw BadRequestException.i18n("api.error.payment.amountMismatch");
        }
    }

    private void ensureCanAccessBooking(Booking booking) {
        if (authenticatedUserProvider.isCurrentUserBackoffice()) {
            return;
        }
        if (!authenticatedUserProvider.getRequiredCurrentUserId().equals(booking.getUserId())) {
            throw new AccessDeniedException("You do not have permission to pay for this booking");
        }
    }

    private String buildPayUrl(TreeMap<String, String> params) {
        return params.entrySet().stream()
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8).replace("+", "%20"))
                .collect(Collectors.joining("&", vnpayProperties.getPayUrl() + "?", ""));
    }
}
