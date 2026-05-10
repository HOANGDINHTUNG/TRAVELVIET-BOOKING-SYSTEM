package com.wedservice.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * VNPay gateway (sandbox or production). Secrets via env placeholders, e.g. {@code VNPAY_HASH_SECRET}.
 */
@Configuration
@ConfigurationProperties(prefix = "app.vnpay")
@Getter
@Setter
public class VnpayProperties {

    /** When false, checkout and IPN reject processing. */
    private boolean enabled = false;

    private String tmnCode = "";

    private String hashSecret = "";

    /** e.g. https://sandbox.vnpayment.vn/paymentv2/vpcpay.html */
    private String payUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    /** Browser return URL after customer pays (FE). */
    private String returnUrl = "";

    /** Server IPN URL (this backend), must be publicly reachable by VNPay. */
    private String ipnUrl = "";

    /** Default order description prefix. */
    private String orderInfoPrefix = "TravelViet booking";

    /** vnp_Locale: vn or en */
    private String locale = "vn";
}
