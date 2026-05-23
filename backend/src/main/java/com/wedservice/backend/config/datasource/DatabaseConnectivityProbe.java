package com.wedservice.backend.config.datasource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Optional;

final class DatabaseConnectivityProbe {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConnectivityProbe.class);

    private DatabaseConnectivityProbe() {
    }

    static boolean canConnect(String jdbcUrl, String username, String password, int timeoutMs) {
        return probeFailureReason(jdbcUrl, username, password, timeoutMs).isEmpty();
    }

    /** Rỗng = kết nối OK; có giá trị = lý do lỗi (để log Render / prod). */
    static Optional<String> probeFailureReason(
            String jdbcUrl,
            String username,
            String password,
            int timeoutMs
    ) {
        try {
            DriverManager.setLoginTimeout(Math.max(1, timeoutMs / 1000));
            try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
                if (connection.isValid(Math.max(1, timeoutMs / 1000))) {
                    return Optional.empty();
                }
                return Optional.of("Connection.isValid() returned false");
            }
        } catch (SQLException ex) {
            String reason = formatSqlException(ex);
            log.warn("Database probe failed for {}: {}", sanitizeUrl(jdbcUrl), reason);
            return Optional.of(reason);
        }
    }

    private static String sanitizeUrl(String jdbcUrl) {
        return jdbcUrl.length() > 120 ? jdbcUrl.substring(0, 120) + "..." : jdbcUrl;
    }

    private static String formatSqlException(SQLException ex) {
        StringBuilder sb = new StringBuilder();
        SQLException current = ex;
        int depth = 0;
        while (current != null && depth < 4) {
            if (depth > 0) {
                sb.append(" | Caused by: ");
            }
            String msg = current.getMessage();
            sb.append(msg != null ? msg : current.getClass().getSimpleName());
            if (current.getSQLState() != null) {
                sb.append(" [SQLState=").append(current.getSQLState()).append("]");
            }
            current = current.getNextException();
            depth++;
        }
        return sb.toString();
    }
}
