package com.wedservice.backend.common.security.ratelimit;

import io.github.bucket4j.Bucket;

/**
 * Pluggable token-bucket storage for {@link com.wedservice.backend.common.security.RateLimitFilter}.
 * Use {@code memory} on single instance; switch to {@code redis} when scaling out (shared counters).
 */
public interface RateLimitBucketStore {

    /**
     * Returns (or creates) the bucket for the given client key (typically IP).
     */
    Bucket resolveBucket(String clientKey);
}
