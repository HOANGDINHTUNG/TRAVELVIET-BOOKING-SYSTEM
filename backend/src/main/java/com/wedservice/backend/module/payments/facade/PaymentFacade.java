package com.wedservice.backend.module.payments.facade;

import com.wedservice.backend.module.payments.dto.request.CreatePaymentRequest;
import com.wedservice.backend.module.payments.dto.request.VnpayCreateCheckoutRequest;
import com.wedservice.backend.module.payments.dto.response.PaymentResponse;
import com.wedservice.backend.module.payments.dto.response.VnpayCreateCheckoutResponse;
import com.wedservice.backend.module.payments.service.VnpayPaymentService;
import com.wedservice.backend.module.payments.service.command.PaymentCommandService;
import com.wedservice.backend.module.payments.service.query.PaymentQueryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class PaymentFacade {

    private final PaymentCommandService paymentCommandService;
    private final PaymentQueryService paymentQueryService;
    private final VnpayPaymentService vnpayPaymentService;

    public PaymentResponse createPayment(CreatePaymentRequest request) {
        return paymentCommandService.createPayment(request);
    }

    public PaymentResponse getPayment(Long id) {
        return paymentQueryService.getPayment(id);
    }

    public VnpayCreateCheckoutResponse createVnpayCheckout(VnpayCreateCheckoutRequest request, String clientIp) {
        return vnpayPaymentService.createCheckout(request, clientIp);
    }

    public Map<String, String> handleVnpayIpn(HttpServletRequest request) {
        return vnpayPaymentService.handleIpn(request);
    }
}

