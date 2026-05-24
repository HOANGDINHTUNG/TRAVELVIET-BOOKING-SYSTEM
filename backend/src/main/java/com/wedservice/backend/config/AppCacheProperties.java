package com.wedservice.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Optional per-cache tuning under {@code app.cache.caffeine.<cacheName>.*} in YAML.
 */
@Data
@ConfigurationProperties(prefix = "app.cache")
public class AppCacheProperties {

    /**
     * {@code caffeine} — single pod (default). {@code redis} — shared L2 for tour caches.
     * {@code hybrid} — Caffeine L1 + Redis L2 + Pub/Sub L1 invalidation (Kubernetes).
     */
    private String mode = "caffeine";

    /**
     * Keys: cache names (e.g. {@code tours}, {@code destinations}, {@code destination-details}).
     */
    private Map<String, CacheSpec> caffeine = new LinkedHashMap<>();

    @Data
    public static class CacheSpec {
        /** Max entries per cache; must be at least 1. */
        private long maximumSize = 500;
        /** TTL after write, seconds; must be at least 1. */
        private long expireAfterWriteSeconds = 300;
    }
}
