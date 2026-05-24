package com.wedservice.backend.module.tours.cache;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * Broadcasts L1 invalidation to every pod (hybrid mode).
 */
@Component
@ConditionalOnBean(RedisTemplate.class)
@RequiredArgsConstructor
@Slf4j
public class TourCacheInvalidationPublisher {

    public static final String CHANNEL = "cache:invalidate:tours";

    private final RedisTemplate<String, Object> redisTemplate;

    public void publish(TourCacheInvalidationMessage message) {
        try {
            redisTemplate.convertAndSend(CHANNEL, message);
        } catch (Exception ex) {
            log.warn("Failed to publish tour cache invalidation {}: {}", message, ex.getMessage());
        }
    }
}
