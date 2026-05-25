package com.wedservice.backend.module.tours.cache;

import java.io.Serializable;

/**
 * Redis Pub/Sub payload to invalidate pod-local L1 caches across the cluster.
 */
public record TourCacheInvalidationMessage(
        Type type,
        Long tourId
) implements Serializable {

    public enum Type {
        /** Clear entire {@code tours} search cache. */
        ALL_TOUR_SEARCH,
        /** Clear {@code tour-details} entries for one tour (all locales). */
        TOUR_DETAIL
    }

    public static TourCacheInvalidationMessage allTourSearch() {
        return new TourCacheInvalidationMessage(Type.ALL_TOUR_SEARCH, null);
    }

    public static TourCacheInvalidationMessage tourDetail(Long tourId) {
        return new TourCacheInvalidationMessage(Type.TOUR_DETAIL, tourId);
    }
}
