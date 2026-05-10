package com.wedservice.backend.module.payments.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.payments.dto.request.VnpayCreateCheckoutRequest;
import com.wedservice.backend.module.payments.dto.response.VnpayCreateCheckoutResponse;
import com.wedservice.backend.module.payments.facade.PaymentFacade;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payments/vnpay")
@RequiredArgsConstructor
public class VnpayController {

    private final PaymentFacade paymentFacade;

    @PostMapping("/checkout")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<VnpayCreateCheckoutResponse> createCheckout(
            @Valid @RequestBody VnpayCreateCheckoutRequest request,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(paymentFacade.createVnpayCheckout(request, resolveClientIp(httpRequest)));
    }

    /**
     * VNPay IPN (server callback). Must stay public — VNPay calls without JWT.
     */
    @GetMapping(value = "/ipn", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> ipn(HttpServletRequest request) {
        return paymentFacade.handleVnpayIpn(request);
    }

    private static String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            int comma = forwarded.indexOf(',');
            return comma > 0 ? forwarded.substring(0, comma).trim() : forwarded.trim();
        }
        return request.getRemoteAddr();
    }
}
