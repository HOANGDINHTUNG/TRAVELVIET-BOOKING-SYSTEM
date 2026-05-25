package com.wedservice.backend.config.datasource;

import org.springframework.util.StringUtils;

/**
 * Bổ sung host/port/user/password từ biến môi trường rời (khi không dùng MYSQL_SERVICE_URI).
 */
final class RemoteDiscreteEnvAssembler {

    private RemoteDiscreteEnvAssembler() {
    }

    static void applyMissingFieldsFromEnvironment(AppDataSourceFailoverProperties.Remote remote) {
        if (!StringUtils.hasText(remote.getHost())) {
            remote.setHost(firstEnv("AIVEN_DB_HOST", "MYSQL_HOST", "DB_HOST"));
        }
        String port = firstEnv("AIVEN_DB_PORT", "MYSQL_PORT", "DB_PORT");
        if (StringUtils.hasText(port)) {
            remote.setPort(Integer.parseInt(port.trim()));
        }
        if (!StringUtils.hasText(remote.getUsername())) {
            remote.setUsername(firstEnv("AIVEN_DB_USER", "MYSQL_USER", "DB_USER"));
        }
        if (!StringUtils.hasText(remote.getPassword())) {
            remote.setPassword(firstEnv("AIVEN_DB_PASSWORD", "MYSQL_PASSWORD", "DB_PASSWORD"));
        }
        if (!StringUtils.hasText(remote.getDatabase()) || "defaultdb".equals(remote.getDatabase())) {
            String db = firstEnv("AIVEN_DB_DATABASE", "MYSQL_DATABASE", "DB_NAME");
            if (StringUtils.hasText(db)) {
                remote.setDatabase(db);
            }
        }
    }

    private static String firstEnv(String... keys) {
        for (String key : keys) {
            String value = System.getenv(key);
            if (StringUtils.hasText(value)) {
                return value.trim();
            }
        }
        return "";
    }
}
