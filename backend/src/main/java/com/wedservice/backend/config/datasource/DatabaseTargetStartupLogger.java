package com.wedservice.backend.config.datasource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "app.datasource.failover", name = "enabled", havingValue = "true")
public class DatabaseTargetStartupLogger implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseTargetStartupLogger.class);

    @Override
    public void run(ApplicationArguments args) {
        ActiveDatabaseTarget target = ActiveDatabaseTarget.get();
        if (target == null) {
            return;
        }
        log.info(
                "Database target registered: {} ({}:{}/{})",
                target.displayName(),
                target.getHost(),
                target.getPort(),
                target.getDatabase()
        );
    }
}
