package com.wedservice.backend.config.api;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class ApiProbeResilienceConfig {

    public static final String CB_API_PROBE = "apiReachabilityProbe";

    @Bean
    public CircuitBreaker apiReachabilityCircuitBreaker(
            CircuitBreakerRegistry registry,
            @Value("${resilience4j.circuitbreaker.instances.apiReachabilityProbe.failure-rate-threshold:50}") float failureRate,
            @Value("${resilience4j.circuitbreaker.instances.apiReachabilityProbe.sliding-window-size:10}") int windowSize,
            @Value("${resilience4j.circuitbreaker.instances.apiReachabilityProbe.wait-duration-in-open-state:30s}") Duration openWait
    ) {
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
                .slidingWindowSize(windowSize)
                .failureRateThreshold(failureRate)
                .waitDurationInOpenState(openWait)
                .permittedNumberOfCallsInHalfOpenState(3)
                .build();
        return registry.circuitBreaker(CB_API_PROBE, config);
    }

    @Bean
    public TimeLimiter apiReachabilityTimeLimiter(
            TimeLimiterRegistry registry,
            @Value("${resilience4j.timelimiter.instances.apiReachabilityProbe.timeout-duration:3s}") Duration timeout
    ) {
        TimeLimiterConfig config = TimeLimiterConfig.custom()
                .timeoutDuration(timeout)
                .cancelRunningFuture(true)
                .build();
        return registry.timeLimiter(CB_API_PROBE, config);
    }
}
