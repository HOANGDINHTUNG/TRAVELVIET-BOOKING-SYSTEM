package com.wedservice.backend.module.tours.cache;

import com.wedservice.backend.config.CacheConfig;
import com.wedservice.backend.config.cache.TwoLevelCache;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

/**
 * Receives invalidation events and clears this pod's L1 (Caffeine) only — L2 already updated by origin pod.
 */
@Component
@ConditionalOnProperty(prefix = "app.cache", name = "mode", havingValue = "hybrid")
@RequiredArgsConstructor
@Slf4j
public class TourCacheInvalidationSubscriber implements MessageListener {

    private final CacheManager cacheManager;
    private final TourCacheEvictor tourCacheEvictor;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        TourCacheInvalidationMessage payload = tourCacheEvictor.deserializeInvalidationMessage(message.getBody());
        if (payload == null) {
            return;
        }
        switch (payload.type()) {
            case ALL_TOUR_SEARCH -> clearL1(CacheConfig.CACHE_TOURS);
            case TOUR_DETAIL -> {
                if (payload.tourId() != null) {
                    tourCacheEvictor.evictTourDetailL1Only(payload.tourId());
                }
            }
            default -> log.debug("Ignored cache invalidation type {}", payload.type());
        }
    }

    private void clearL1(String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache instanceof TwoLevelCache twoLevel) {
            twoLevel.getL1().clear();
        } else if (cache instanceof CaffeineCache caffeineCache) {
            caffeineCache.clear();
        }
    }
}
