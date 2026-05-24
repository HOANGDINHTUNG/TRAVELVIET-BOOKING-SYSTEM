package com.wedservice.backend.module.system.facade;

import com.wedservice.backend.config.api.RuntimeConnectivityContributor;
import com.wedservice.backend.module.system.command.SystemCommand;
import com.wedservice.backend.module.system.query.SystemQuery;
import com.wedservice.backend.module.system.validator.SystemValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

/**
 * Aggregates health slices in parallel so total latency ≈ max(slice), not sum(slice).
 */
@Component
@RequiredArgsConstructor
public class SystemFacade {

    private static final long HEALTH_AGGREGATE_TIMEOUT_MS = 5_000L;

    private final SystemQuery systemQuery;
    private final SystemCommand systemCommand;
    private final SystemValidator systemValidator;
    private final RuntimeConnectivityContributor runtimeConnectivityContributor;
    @Qualifier("healthCheckExecutor")
    private final Executor healthCheckExecutor;

    public Map<String, Object> health(String applicationName) {
        String normalizedName = systemValidator.normalizeApplicationName(applicationName);
        long startedNanos = System.nanoTime();

        CompletableFuture<Map<String, Object>> baseFuture = CompletableFuture.supplyAsync(
                () -> timedSlice("service", () -> systemQuery.health(normalizedName)),
                healthCheckExecutor
        );
        CompletableFuture<Map<String, Object>> pingFuture = CompletableFuture.supplyAsync(
                () -> timedSlice("ping", () -> systemCommand.ping()),
                healthCheckExecutor
        );
        CompletableFuture<Map<String, Object>> connectivityFuture = CompletableFuture.supplyAsync(
                () -> timedSlice("connectivity", runtimeConnectivityContributor::connectivitySnapshot),
                healthCheckExecutor
        );

        CompletableFuture<Void> all = CompletableFuture.allOf(baseFuture, pingFuture, connectivityFuture);
        try {
            all.get(HEALTH_AGGREGATE_TIMEOUT_MS, TimeUnit.MILLISECONDS);
        } catch (Exception ex) {
            baseFuture.cancel(true);
            pingFuture.cancel(true);
            connectivityFuture.cancel(true);
            Map<String, Object> degraded = new HashMap<>();
            degraded.put("status", "DEGRADED");
            degraded.put("error", ex.getClass().getSimpleName() + ": " + ex.getMessage());
            degraded.put("aggregateDurationMs", elapsedMs(startedNanos));
            return degraded;
        }

        Map<String, Object> health = new HashMap<>();
        health.putAll(baseFuture.join());
        health.putAll(pingFuture.join());
        health.putAll(connectivityFuture.join());
        health.put("aggregateDurationMs", elapsedMs(startedNanos));
        return health;
    }

    private static Map<String, Object> timedSlice(String name, java.util.function.Supplier<Map<String, Object>> supplier) {
        long sliceStart = System.nanoTime();
        try {
            Map<String, Object> slice = new HashMap<>(supplier.get());
            slice.put(name + "DurationMs", elapsedMs(sliceStart));
            return slice;
        } catch (Exception ex) {
            Map<String, Object> failed = new HashMap<>();
            failed.put(name + "Status", "DOWN");
            failed.put(name + "Error", ex.getMessage());
            failed.put(name + "DurationMs", elapsedMs(sliceStart));
            return failed;
        }
    }

    private static long elapsedMs(long startedNanos) {
        return TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedNanos);
    }
}
