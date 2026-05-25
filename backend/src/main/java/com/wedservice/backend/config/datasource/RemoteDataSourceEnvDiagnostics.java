package com.wedservice.backend.config.datasource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

/**
 * Log biến môi trường DB (không log password) để debug Render deploy.
 */
final class RemoteDataSourceEnvDiagnostics {

    private static final Logger log = LoggerFactory.getLogger(RemoteDataSourceEnvDiagnostics.class);

    private RemoteDataSourceEnvDiagnostics() {
    }

    static void logRenderDatabaseEnv(AppDataSourceFailoverProperties.Remote remote) {
        log.info(
                "Render DB env: MYSQL_SERVICE_URI={} SPRING_DATASOURCE_URL={} AIVEN_DB_HOST={} "
                        + "AIVEN_DB_PORT={} AIVEN_DB_PASSWORD={} → resolvedHost={} resolvedPort={}",
                present("MYSQL_SERVICE_URI"),
                present("SPRING_DATASOURCE_URL"),
                present("AIVEN_DB_HOST"),
                valueOrDash("AIVEN_DB_PORT"),
                present("AIVEN_DB_PASSWORD"),
                StringUtils.hasText(remote.getHost()) ? remote.getHost() : "(empty)",
                remote.getPort()
        );
    }

    private static String present(String key) {
        String v = System.getenv(key);
        return StringUtils.hasText(v) ? "set" : "missing";
    }

    private static String valueOrDash(String key) {
        String v = System.getenv(key);
        return StringUtils.hasText(v) ? v : "missing";
    }
}
