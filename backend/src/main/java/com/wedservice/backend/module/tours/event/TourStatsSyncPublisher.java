package com.wedservice.backend.module.tours.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

/**
 * Publishes tour schedule/booking aggregate sync work outside the HTTP transaction.
 */
@Component
@RequiredArgsConstructor
public class TourStatsSyncPublisher {

    private final ApplicationEventPublisher eventPublisher;

    public void requestSync(Long scheduleId, Long tourId) {
        if (scheduleId == null && tourId == null) {
            return;
        }
        eventPublisher.publishEvent(new TourStatsSyncRequestedEvent(scheduleId, tourId));
    }
}
