package com.wedservice.backend.config.datasource;

import org.springframework.util.StringUtils;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Áp host/port/user/password từ URI Aiven (MYSQL_SERVICE_URI / DATABASE_URL) lên cấu hình remote.
 * Copy nguyên URI từ Aiven Console → Connection information (Public) để tránh host/port cũ.
 */
final class MysqlServiceUriResolver {

    private MysqlServiceUriResolver() {
    }

    static boolean applyFromEnvironment(AppDataSourceFailoverProperties.Remote remote) {
        return applyFirstMatching(remote, envCandidates());
    }

    static boolean applyFromConfiguredProperties(AppDataSourceFailoverProperties.Remote remote) {
        if (!StringUtils.hasText(remote.getServiceUri())) {
            return false;
        }
        return applyUri(remote, remote.getServiceUri().trim());
    }

    private static boolean applyFirstMatching(AppDataSourceFailoverProperties.Remote remote, Iterable<String> candidates) {
        for (String candidate : candidates) {
            if (!StringUtils.hasText(candidate)) {
                continue;
            }
            if (applyUri(remote, candidate.trim())) {
                return true;
            }
        }
        return false;
    }

    private static Iterable<String> envCandidates() {
        Set<String> keys = new LinkedHashSet<>(Arrays.asList(
                "MYSQL_SERVICE_URI",
                "DATABASE_URL",
                "SPRING_DATASOURCE_URL",
                "JDBC_DATABASE_URL",
                "AIVEN_MYSQL_URI",
                "AIVEN_SERVICE_URI"
        ));
        return keys.stream()
                .map(key -> System.getenv(key))
                .filter(StringUtils::hasText)
                .toList();
    }

    static boolean applyUri(AppDataSourceFailoverProperties.Remote remote, String raw) {
        String normalized = normalize(raw);
        if (!StringUtils.hasText(normalized)) {
            return false;
        }
        try {
            URI uri = URI.create(normalized);
            String scheme = uri.getScheme();
            if (!"mysql".equalsIgnoreCase(scheme) && !"jdbc".equalsIgnoreCase(scheme)) {
                return false;
            }

            String userInfo = uri.getUserInfo();
            if (StringUtils.hasText(userInfo)) {
                int colon = userInfo.indexOf(':');
                if (colon >= 0) {
                    remote.setUsername(decode(userInfo.substring(0, colon)));
                    remote.setPassword(decode(userInfo.substring(colon + 1)));
                } else {
                    remote.setUsername(decode(userInfo));
                }
            }

            if (StringUtils.hasText(uri.getHost())) {
                remote.setHost(uri.getHost());
            }
            if (uri.getPort() > 0) {
                remote.setPort(uri.getPort());
            }

            String path = uri.getPath();
            if (StringUtils.hasText(path)) {
                String db = path.startsWith("/") ? path.substring(1) : path;
                if (StringUtils.hasText(db)) {
                    remote.setDatabase(db);
                }
            }

            String query = uri.getRawQuery();
            if (StringUtils.hasText(query)) {
                for (String part : query.split("&")) {
                    int eq = part.indexOf('=');
                    if (eq <= 0) {
                        continue;
                    }
                    String key = part.substring(0, eq);
                    String value = decode(part.substring(eq + 1));
                    if ("ssl-mode".equalsIgnoreCase(key) || "sslMode".equalsIgnoreCase(key)) {
                        remote.setSslMode(value);
                    }
                }
            }
            return StringUtils.hasText(remote.getHost()) && remote.getPort() > 0;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private static String normalize(String raw) {
        String trimmed = raw.trim();
        if (trimmed.startsWith("jdbc:mysql://")) {
            return "mysql://" + trimmed.substring("jdbc:mysql://".length());
        }
        return trimmed;
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
