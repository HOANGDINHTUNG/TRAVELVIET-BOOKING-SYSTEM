package com.wedservice.backend.module.tours.event.listener;

import com.wedservice.backend.module.tours.cache.TourCacheEvictor;
import com.wedservice.backend.module.tours.event.TourStatsSyncRequestedEvent;
import com.wedservice.backend.module.tours.service.TourRuntimeStatsSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Recomputes tour/schedule counters after booking writes — off the request thread, after commit.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TourStatsSyncEventListener {

    private final TourRuntimeStatsSyncService tourRuntimeStatsSyncService;
    private final TourCacheEvictor tourCacheEvictor;

    @Async("appTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onTourStatsSyncRequested(TourStatsSyncRequestedEvent event) {
        long started = System.nanoTime();
        try {
            tourRuntimeStatsSyncService.syncScheduleState(event.scheduleId());
            tourRuntimeStatsSyncService.syncTourBookingStats(event.tourId());
            tourCacheEvictor.evictAfterStatsSync(event.tourId());
        } catch (Exception ex) {
            log.warn(
                    "Async tour stats sync failed scheduleId={} tourId={}: {}",
                    event.scheduleId(),
                    event.tourId(),
                    ex.getMessage()
            );
        } finally {
            long ms = (System.nanoTime() - started) / 1_000_000L;
            if (ms > 500) {
                log.info(
                        "Tour stats sync slow path scheduleId={} tourId={} durationMs={}",
                        event.scheduleId(),
                        event.tourId(),
                        ms
                );
            }
        }
    }
}
