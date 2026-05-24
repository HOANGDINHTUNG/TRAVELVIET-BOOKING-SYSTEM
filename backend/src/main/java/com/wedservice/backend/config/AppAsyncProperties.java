package com.wedservice.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app.async")
public class AppAsyncProperties {

    private int corePoolSize = 4;
    private int maxPoolSize = 16;
    private int queueCapacity = 500;
    private String threadNamePrefix = "app-async-";
}
