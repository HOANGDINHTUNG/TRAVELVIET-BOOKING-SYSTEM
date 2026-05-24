package com.wedservice.backend.config.api;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Khi API public (Render) không phản hồi, ghi nhận URL localhost để client/dev dùng.
 */
@Data
@ConfigurationProperties(prefix = "app.api.failover")
public class AppApiFailoverProperties {

    /** Bật probe public API lúc khởi động (dev). */
    private boolean enabled = false;

    /** Thử URL public trước; false = luôn khuyến nghị local. */
    private boolean preferPublic = true;

    private int probeTimeoutMs = 8000;

    /** URL backend trên internet (Render). */
    private String publicBaseUrl = "https://travelviet-booking-system.onrender.com/api/v1";

    /** URL backend khi dev trên máy (local). */
    private String localBaseUrl = "http://localhost:8088/api/v1";

    /** Path health dùng khi probe (tương đối base URL). */
    private String healthPath = "/system/health";
}
