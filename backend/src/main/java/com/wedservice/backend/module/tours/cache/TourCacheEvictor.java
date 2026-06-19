package com.wedservice.backend.module.tours.cache;

import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;
import com.wedservice.backend.config.CacheConfig;
import com.wedservice.backend.config.cache.TwoLevelCache;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Cluster-aware tour cache invalidation (L2 Redis + optional L1 pub/sub).
 */
@Component
@Slf4j
public class TourCacheEvictor {

    private static final String REDIS_CACHE_PREFIX = "::";

    private final CacheManager cacheManager;
    private final ObjectProvider<RedisTemplate<String, Object>> redisTemplateProvider;
    private final ObjectProvider<TourCacheInvalidationPublisher> invalidationPublisherProvider;
    private final ObjectMapper objectMapper;

    public TourCacheEvictor(
            CacheManager cacheManager,
            ObjectProvider<RedisTemplate<String, Object>> redisTemplateProvider,
            ObjectProvider<TourCacheInvalidationPublisher> invalidationPublisherProvider,
            ObjectProvider<ObjectMapper> objectMapperProvider
    ) {
        this.cacheManager = cacheManager;
        this.redisTemplateProvider = redisTemplateProvider;
        this.invalidationPublisherProvider = invalidationPublisherProvider;
        this.objectMapper = objectMapperProvider.getIfAvailable(
                () -> JsonMapper.builder().findAndAddModules().build()
        );
    }

    public void evictAllTourSearchCache() {
        clearCacheRegion(CacheConfig.CACHE_TOURS);
        publish(TourCacheInvalidationMessage.allTourSearch());
    }

    /**
     * Removes every cached detail row for {@code tourId} (all Accept-Language variants).
     */
    public void evictTourDetailCache(Long tourId) {
        if (tourId == null) {
            return;
        }
        evictTourDetailL1Only(tourId);
        evictTourDetailL2ByPrefix(tourId);
        publish(TourCacheInvalidationMessage.tourDetail(tourId));
    }

    /** Clears only this pod's Caffeine L1 (called from Pub/Sub subscriber). */
    public void evictTourDetailL1Only(Long tourId) {
        if (tourId == null) {
            return;
        }
        Cache cache = cacheManager.getCache(CacheConfig.CACHE_TOUR_DETAILS);
        if (cache == null) {
            return;
        }
        String prefix = tourId + "_";
        Cache l1 = cache instanceof TwoLevelCache twoLevel ? twoLevel.getL1() : cache;
        if (l1 instanceof CaffeineCache caffeineCache) {
            caffeineCache.getNativeCache().asMap().keySet().removeIf(
                    key -> key != null && key.toString().startsWith(prefix)
            );
        }
    }

    public void evictAfterTourMutation(Long tourId) {
        evictAllTourSearchCache();
        evictTourDetailCache(tourId);
    }

    public void evictAfterTourCreated() {
        evictAllTourSearchCache();
    }

    /** After async stats sync updates seat/booking counters visible on list/detail cards. */
    public void evictAfterStatsSync(Long tourId) {
        if (tourId == null) {
            evictAllTourSearchCache();
            return;
        }
        evictAfterTourMutation(tourId);
    }

    public TourCacheInvalidationMessage deserializeInvalidationMessage(byte[] body) {
        if (body == null || body.length == 0) {
            return null;
        }
        try {
            return objectMapper.readValue(body, TourCacheInvalidationMessage.class);
        } catch (Exception ex) {
            log.debug("Could not deserialize cache invalidation message: {}", ex.getMessage());
            return null;
        }
    }

    private void clearCacheRegion(String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        }
        deleteRedisKeysByPattern(cacheName + REDIS_CACHE_PREFIX + "*");
    }

    private void evictTourDetailL2ByPrefix(Long tourId) {
        deleteRedisKeysByPattern(CacheConfig.CACHE_TOUR_DETAILS + REDIS_CACHE_PREFIX + tourId + "_*");
        Cache cache = cacheManager.getCache(CacheConfig.CACHE_TOUR_DETAILS);
        if (cache instanceof TwoLevelCache twoLevel) {
            Cache l2 = twoLevel.getL2();
            if (l2 != null) {
                // Spring RedisCache clear by prefix not supported — pattern delete above covers L2 keys.
            }
        }
    }

    private void deleteRedisKeysByPattern(String pattern) {
        redisTemplateProvider.ifAvailable(redis -> {
            try {
                Set<String> keys = redis.keys(pattern);
                if (keys != null && !keys.isEmpty()) {
                    redis.delete(keys);
                }
            } catch (Exception ex) {
                log.warn("Redis pattern delete failed for {}: {}", pattern, ex.getMessage());
            }
        });
    }

    private void publish(TourCacheInvalidationMessage message) {
        invalidationPublisherProvider.ifAvailable(publisher -> publisher.publish(message));
    }
}
