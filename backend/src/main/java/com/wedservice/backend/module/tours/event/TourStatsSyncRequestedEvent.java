package com.wedservice.backend.module.tours.event;

/**
 * Fired after a booking mutation commits. Handled asynchronously to keep write API latency low.
 */
public record TourStatsSyncRequestedEvent(Long scheduleId, Long tourId) {
}
