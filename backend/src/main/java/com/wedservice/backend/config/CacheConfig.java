package com.wedservice.backend.config;

import com.wedservice.backend.config.cache.CacheSpecFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.ArrayList;
import java.util.List;

/**
 * Explicit **Caffeine** caches for {@code @Cacheable} names used in the codebase.
 * Tuning via {@link AppCacheProperties} / {@code app.cache.caffeine.*} in YAML.
 */
@Configuration
@EnableConfigurationProperties(AppCacheProperties.class)
@ConditionalOnProperty(prefix = "app.cache", name = "mode", havingValue = "caffeine", matchIfMissing = true)
public class CacheConfig {

    public static final String CACHE_TOURS = "tours";
    public static final String CACHE_TOUR_DETAILS = "tour-details";
    public static final String CACHE_DESTINATIONS = "destinations";
    public static final String CACHE_DESTINATION_DETAILS = "destination-details";

    private static final List<String> KNOWN_CACHE_NAMES = List.of(
            CACHE_TOURS,
            CACHE_TOUR_DETAILS,
            CACHE_DESTINATIONS,
            CACHE_DESTINATION_DETAILS
    );

    @Bean
    @Primary
    public CacheManager cacheManager(AppCacheProperties props) {
        List<Cache> caches = new ArrayList<>(KNOWN_CACHE_NAMES.size());
        for (String name : KNOWN_CACHE_NAMES) {
            caches.add(CacheSpecFactory.buildCaffeineCache(name, props));
        }

        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(caches);
        manager.initializeCaches();
        return manager;
    }
}
