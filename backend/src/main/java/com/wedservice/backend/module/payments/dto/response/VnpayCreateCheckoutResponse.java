package com.wedservice.backend.module.payments.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VnpayCreateCheckoutResponse {

    /** Full URL to redirect the browser to VNPay. */
    private String paymentUrl;

    private Long paymentId;

    /** Same as {@code vnp_TxnRef} sent to VNPay (stable lookup key for IPN). */
    private String transactionRef;
}
