package com.wedservice.backend.module.payments.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * VNPay v2 HMAC-SHA512 signing (build + verify). See VNPay integration guide for field ordering rules.
 */
public final class VnpayCryptoUtil {

    private VnpayCryptoUtil() {
    }

    /**
     * Builds the signing payload: sorted {@code vnp_*} keys, each {@code key=value}, joined by {@code &}.
     * Entries with blank values are omitted. {@code vnp_SecureHash} and {@code vnp_SecureHashType} are excluded.
     */
    public static String buildSignData(Map<String, String> vnpParams) {
        return vnpParams.entrySet().stream()
                .filter(e -> e.getKey() != null && e.getKey().startsWith("vnp_"))
                .filter(e -> !"vnp_SecureHash".equals(e.getKey()) && !"vnp_SecureHashType".equals(e.getKey()))
                .filter(e -> e.getValue() != null && !e.getValue().isBlank())
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));
    }

    public static String hmacSha512(String secretKey, String signData) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(key);
            byte[] raw = mac.doFinal(signData.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(raw.length * 2);
            for (byte b : raw) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("VNPay HMAC-SHA512 failed", e);
        }
    }

    public static boolean secureEquals(String a, String b) {
        if (a == null || b == null) {
            return false;
        }
        String na = a.toLowerCase(Locale.ROOT);
        String nb = b.toLowerCase(Locale.ROOT);
        return java.security.MessageDigest.isEqual(
                na.getBytes(StandardCharsets.UTF_8),
                nb.getBytes(StandardCharsets.UTF_8)
        );
    }
}
