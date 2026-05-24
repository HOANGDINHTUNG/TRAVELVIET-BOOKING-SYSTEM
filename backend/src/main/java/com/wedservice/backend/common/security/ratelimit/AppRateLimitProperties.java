package com.wedservice.backend.common.security.ratelimit;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@Data
@ConfigurationProperties(prefix = "app.security.rate-limit")
public class AppRateLimitProperties {

    /**
     * {@code memory} — per JVM (default). {@code redis} — requires {@code spring-boot-starter-data-redis}
     * and a Redis-backed {@link RateLimitBucketStore} bean (see {@link RateLimitStoreConfig}).
     */
    private String store = "memory";

    private int capacity = 10;
    private Duration refillPeriod = Duration.ofMinutes(1);

    /** Redis key prefix when store=redis. */
    private String redisKeyPrefix = "rate-limit:auth:";
}
