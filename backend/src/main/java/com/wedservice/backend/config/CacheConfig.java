package com.wedservice.backend.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Explicit **Caffeine** caches for {@code @Cacheable} names used in the codebase.
 * Tuning via {@link AppCacheProperties} / {@code app.cache.caffeine.*} in YAML.
 */
@Configuration
@EnableConfigurationProperties(AppCacheProperties.class)
public class CacheConfig {

    static final String CACHE_TOURS = "tours";
    static final String CACHE_DESTINATIONS = "destinations";
    static final String CACHE_DESTINATION_DETAILS = "destination-details";

    private static final List<String> KNOWN_CACHE_NAMES = List.of(
            CACHE_TOURS,
            CACHE_DESTINATIONS,
            CACHE_DESTINATION_DETAILS
    );

    @Bean
    @Primary
    public CacheManager cacheManager(AppCacheProperties props) {
        Map<String, AppCacheProperties.CacheSpec> yaml = props.getCaffeine();
        List<Cache> caches = new ArrayList<>(KNOWN_CACHE_NAMES.size());
        for (String name : KNOWN_CACHE_NAMES) {
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
            caches.add(new CaffeineCache(name, nativeCache));
        }

        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(caches);
        manager.initializeCaches();
        return manager;
    }

    private static long defaultMaxSize(String name) {
        return switch (name) {
            case CACHE_TOURS -> 2_000L;
            case CACHE_DESTINATIONS -> 1_000L;
            case CACHE_DESTINATION_DETAILS -> 4_000L;
            default -> 500L;
        };
    }

    private static long defaultTtlSeconds(String name) {
        return switch (name) {
            case CACHE_TOURS -> 300L;
            case CACHE_DESTINATIONS -> 300L;
            case CACHE_DESTINATION_DETAILS -> 600L;
            default -> 300L;
        };
    }
}
