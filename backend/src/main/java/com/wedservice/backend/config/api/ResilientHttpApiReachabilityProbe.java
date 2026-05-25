package com.wedservice.backend.config.api;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.timelimiter.TimeLimiter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.TimeUnit;

/**
 * Wraps {@link HttpApiReachabilityProbe} with Circuit Breaker + TimeLimiter (Resilience4j).
 * When the remote API is unhealthy, fail fast without blocking threads on long TCP timeouts.
 */
@Component
@Slf4j
@ConditionalOnProperty(prefix = "app.api.failover", name = "enabled", havingValue = "true")
public class ResilientHttpApiReachabilityProbe {

    private final CircuitBreaker circuitBreaker;
    private final TimeLimiter timeLimiter;

    public ResilientHttpApiReachabilityProbe(
            CircuitBreaker apiReachabilityCircuitBreaker,
            TimeLimiter apiReachabilityTimeLimiter
    ) {
        this.circuitBreaker = apiReachabilityCircuitBreaker;
        this.timeLimiter = apiReachabilityTimeLimiter;
    }

    public boolean isReachable(String baseUrl, String healthPath, int timeoutMs) {
        int effectiveTimeout = Math.min(timeoutMs, 5_000);
        Callable<Boolean> probe = () -> HttpApiReachabilityProbe.isReachable(baseUrl, healthPath, effectiveTimeout);

        try {
            Callable<Boolean> guarded = CircuitBreaker.decorateCallable(circuitBreaker, probe);
            long limitMs = timeLimiter.getTimeLimiterConfig().getTimeoutDuration().toMillis();
            return Boolean.TRUE.equals(
                    CompletableFuture.supplyAsync(() -> {
                                try {
                                    return guarded.call();
                                } catch (Exception ex) {
                                    throw new CompletionException(ex);
                                }
                            })
                            .orTimeout(Math.min(limitMs, effectiveTimeout), TimeUnit.MILLISECONDS)
                            .exceptionally(ex -> false)
                            .join()
            );
        } catch (CallNotPermittedException ex) {
            log.debug("API reachability circuit open — fast fallback unreachable");
            return false;
        } catch (Exception ex) {
            log.debug("API reachability probe failed: {}", ex.getMessage());
            return false;
        }
    }
}
