package com.wedservice.backend.config.datasource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

final class DatabaseConnectivityProbe {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConnectivityProbe.class);

    private DatabaseConnectivityProbe() {
    }

    static boolean canConnect(String jdbcUrl, String username, String password, int timeoutMs) {
        try {
            DriverManager.setLoginTimeout(Math.max(1, timeoutMs / 1000));
            try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
                return connection.isValid(Math.max(1, timeoutMs / 1000));
            }
        } catch (SQLException ex) {
            log.debug("Database probe failed for {}: {}", sanitizeUrl(jdbcUrl), ex.getMessage());
            return false;
        }
    }

    private static String sanitizeUrl(String jdbcUrl) {
        int at = jdbcUrl.indexOf('@');
        if (at > 0) {
            return jdbcUrl.substring(0, Math.min(80, jdbcUrl.length()));
        }
        return jdbcUrl.length() > 120 ? jdbcUrl.substring(0, 120) + "..." : jdbcUrl;
    }
}
