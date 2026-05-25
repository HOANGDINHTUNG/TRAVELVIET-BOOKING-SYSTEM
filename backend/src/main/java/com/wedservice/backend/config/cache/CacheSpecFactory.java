package com.wedservice.backend.config.cache;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.wedservice.backend.config.AppCacheProperties;
import com.wedservice.backend.config.CacheConfig;
import org.springframework.cache.caffeine.CaffeineCache;

import java.time.Duration;
import java.util.Map;

public final class CacheSpecFactory {

    private CacheSpecFactory() {
    }

    public static CaffeineCache buildCaffeineCache(String name, AppCacheProperties props) {
        Map<String, AppCacheProperties.CacheSpec> yaml = props.getCaffeine();
        AppCacheProperties.CacheSpec spec = yaml != null ? yaml.get(name) : null;
        long maxSize = spec != null ? spec.getMaximumSize() : defaultMaxSize(name);
        long ttlSec = spec != null ? spec.getExpireAfterWriteSeconds() : defaultTtlSeconds(name);
        maxSize = Math.max(1L, maxSize);
        ttlSec = Math.max(1L, ttlSec);

        com.github.benmanes.caffeine.cache.Cache<Object, Object> nativeCache = Caffeine.newBuilder()
                .maximumSize(maxSize)
                .expireAfterWrite(Duration.ofSeconds(ttlSec))
                .recordStats()
                .build();
        return new CaffeineCache(name, nativeCache);
    }

    static long defaultMaxSize(String name) {
        return switch (name) {
            case CacheConfig.CACHE_TOURS -> 2_000L;
            case CacheConfig.CACHE_TOUR_DETAILS -> 4_000L;
            case CacheConfig.CACHE_DESTINATIONS -> 1_000L;
            case CacheConfig.CACHE_DESTINATION_DETAILS -> 4_000L;
            default -> 500L;
        };
    }

    static long defaultTtlSeconds(String name) {
        return switch (name) {
            case CacheConfig.CACHE_TOURS -> 300L;
            case CacheConfig.CACHE_TOUR_DETAILS -> 600L;
            case CacheConfig.CACHE_DESTINATIONS -> 300L;
            case CacheConfig.CACHE_DESTINATION_DETAILS -> 600L;
            default -> 300L;
        };
    }

    static Duration ttlFor(String name, AppCacheProperties props) {
        Map<String, AppCacheProperties.CacheSpec> yaml = props.getCaffeine();
        AppCacheProperties.CacheSpec spec = yaml != null ? yaml.get(name) : null;
        long ttlSec = spec != null ? spec.getExpireAfterWriteSeconds() : defaultTtlSeconds(name);
        return Duration.ofSeconds(Math.max(1L, ttlSec));
    }
}
