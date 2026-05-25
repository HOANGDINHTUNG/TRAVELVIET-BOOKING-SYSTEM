package com.wedservice.backend.config.datasource;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(HikariPoolProperties.class)
public class DataSourcePoolPropertiesConfig {
}
