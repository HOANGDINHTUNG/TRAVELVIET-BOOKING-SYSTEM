package com.wedservice.backend.config.datasource;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Maps {@code spring.datasource.hikari.*} for programmatic DataSource beans (failover path).
 */
@Data
@ConfigurationProperties(prefix = "spring.datasource.hikari")
public class HikariPoolProperties {

    private int maximumPoolSize = 10;
    private int minimumIdle = 2;
    private long maxLifetime = 1_800_000L;
    private long idleTimeout = 600_000L;
    private long leakDetectionThreshold = 0L;
}
