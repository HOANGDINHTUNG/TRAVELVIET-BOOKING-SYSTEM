package com.wedservice.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Small pool for parallel {@code /system/health} slice execution (I/O-bound probes).
 */
@Configuration
public class HealthCheckExecutorConfig {

    @Bean(name = "healthCheckExecutor")
    public Executor healthCheckExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);
        executor.setMaxPoolSize(8);
        executor.setQueueCapacity(32);
        executor.setThreadNamePrefix("health-check-");
        executor.initialize();
        return executor;
    }

    @Bean(name = "apiProbeExecutor")
    public Executor apiProbeExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(1);
        executor.setMaxPoolSize(2);
        executor.setQueueCapacity(4);
        executor.setThreadNamePrefix("api-probe-");
        executor.initialize();
        return executor;
    }
}
