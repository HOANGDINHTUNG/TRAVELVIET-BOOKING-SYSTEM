package com.wedservice.backend.common.security.ratelimit;

import io.github.bucket4j.Bucket;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Per-JVM bucket map. Not suitable for horizontal scale — each node has independent limits.
 */
public class InMemoryRateLimitBucketStore implements RateLimitBucketStore {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final int capacity;
    private final Duration refillPeriod;

    public InMemoryRateLimitBucketStore(int capacity, Duration refillPeriod) {
        this.capacity = capacity;
        this.refillPeriod = refillPeriod;
    }

    @Override
    public Bucket resolveBucket(String clientKey) {
        return buckets.computeIfAbsent(clientKey, ignored -> createBucket());
    }

    private Bucket createBucket() {
        return Bucket.builder()
                .addLimit(limit -> limit.capacity(capacity).refillGreedy(capacity, refillPeriod))
                .build();
    }
}
