package com.wedservice.backend.common.security.ratelimit;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Selects rate-limit storage backend.
 * <p>
 * Redis scale-out: add {@code spring-boot-starter-data-redis} + {@code bucket4j-redis},
 * implement {@link RateLimitBucketStore} with {@code ProxyManager<String>}, register a
 * {@code @Bean} conditioned on {@code app.security.rate-limit.store=redis}.
 * See {@code backend/docs/PERFORMANCE_NOTES.md}.
 */
@Configuration
@EnableConfigurationProperties(AppRateLimitProperties.class)
public class RateLimitStoreConfig {

    @Bean
    @ConditionalOnProperty(prefix = "app.security.rate-limit", name = "store", havingValue = "memory", matchIfMissing = true)
    public RateLimitBucketStore inMemoryRateLimitBucketStore(AppRateLimitProperties props) {
        return new InMemoryRateLimitBucketStore(props.getCapacity(), props.getRefillPeriod());
    }

    // Redis store: {@link RedisRateLimitConfiguration}
}
