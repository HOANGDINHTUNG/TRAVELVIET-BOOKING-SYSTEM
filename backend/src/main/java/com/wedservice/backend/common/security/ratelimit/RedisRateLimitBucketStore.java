package com.wedservice.backend.common.security.ratelimit;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Cluster-wide token buckets via Bucket4j {@link ProxyManager} (Lettuce / Redis).
 */
@RequiredArgsConstructor
public class RedisRateLimitBucketStore implements RateLimitBucketStore {

    private final ProxyManager<String> proxyManager;
    private final AppRateLimitProperties props;
    private final Map<String, Bucket> localHandles = new ConcurrentHashMap<>();

    @Override
    public Bucket resolveBucket(String clientKey) {
        String redisKey = props.getRedisKeyPrefix() + clientKey;
        return localHandles.computeIfAbsent(redisKey, key -> proxyManager.builder().build(key, this::bucketConfiguration));
    }

    private BucketConfiguration bucketConfiguration() {
        int capacity = props.getCapacity();
        return BucketConfiguration.builder()
                .addLimit(limit -> limit.capacity(capacity).refillGreedy(capacity, props.getRefillPeriod()))
                .build();
    }
}
