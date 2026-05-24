package com.wedservice.backend.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Bounded pool for {@code @Async} listeners (stats sync, registration side-effects, etc.).
 * I/O-bound work: modest core size, higher max, bounded queue to apply back-pressure.
 */
@Configuration
@EnableAsync
@EnableConfigurationProperties(AppAsyncProperties.class)
public class AsyncExecutorConfig {

    @Bean(name = "appTaskExecutor")
    public Executor appTaskExecutor(AppAsyncProperties props) {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(Math.max(1, props.getCorePoolSize()));
        executor.setMaxPoolSize(Math.max(props.getCorePoolSize(), props.getMaxPoolSize()));
        executor.setQueueCapacity(Math.max(1, props.getQueueCapacity()));
        executor.setThreadNamePrefix(props.getThreadNamePrefix());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }
}
