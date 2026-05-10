package com.wedservice.backend.module.payments.service;

import com.wedservice.backend.module.payments.dto.request.VnpayCreateCheckoutRequest;
import com.wedservice.backend.module.payments.dto.response.VnpayCreateCheckoutResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface VnpayPaymentService {

    VnpayCreateCheckoutResponse createCheckout(VnpayCreateCheckoutRequest request, String clientIp);

    /**
     * VNPay IPN callback. Returns JSON fields {@code RspCode} and {@code Message} as required by VNPay.
     */
    Map<String, String> handleIpn(HttpServletRequest request);
}
