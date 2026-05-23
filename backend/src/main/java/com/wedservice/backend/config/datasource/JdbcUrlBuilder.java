package com.wedservice.backend.config.datasource;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

final class JdbcUrlBuilder {

    private JdbcUrlBuilder() {
    }

    static String buildLocalUrl(AppDataSourceFailoverProperties.Local local, int connectTimeoutMs) {
        List<String> params = new ArrayList<>();
        params.add("serverTimezone=Asia/Ho_Chi_Minh");
        params.add("allowPublicKeyRetrieval=true");
        params.add("connectTimeout=" + connectTimeoutMs);
        if (!local.isUseSsl()) {
            params.add("useSSL=false");
        }
        return baseUrl(local.getHost(), local.getPort(), local.getDatabase(), params);
    }

    static String buildRemoteUrl(
            AppDataSourceFailoverProperties.Remote remote,
            int connectTimeoutMs,
            ResourceLoader resourceLoader,
            String inlineCaCertPem
    ) {
        List<String> params = new ArrayList<>();
        params.add("serverTimezone=Asia/Ho_Chi_Minh");
        params.add("connectTimeout=" + connectTimeoutMs);
        params.add("socketTimeout=30000");

        Optional<Path> caFile = resolveCaCert(remote.getCaCertPath(), inlineCaCertPem, resourceLoader);
        if (caFile.isPresent()) {
            params.add("sslMode=VERIFY_IDENTITY");
            params.add("trustCertificateKeyStoreUrl=file:" + caFile.get().toAbsolutePath());
            params.add("trustCertificateKeyStoreType=PEM");
        } else if (StringUtils.hasText(remote.getSslMode())) {
            params.add("sslMode=" + remote.getSslMode());
        } else {
            params.add("sslMode=REQUIRED");
        }

        return baseUrl(remote.getHost(), remote.getPort(), remote.getDatabase(), params);
    }

    static String maskPassword(String jdbcUrl) {
        return jdbcUrl;
    }

    private static String baseUrl(String host, int port, String database, List<String> params) {
        return "jdbc:mysql://" + host + ":" + port + "/" + database + "?" + String.join("&", params);
    }

    static Optional<Path> resolveCaCert(String configured, String inlinePem, ResourceLoader resourceLoader) {
        if (StringUtils.hasText(inlinePem)) {
            try {
                Path temp = Files.createTempFile("aiven-ca-env-", ".pem");
                Files.writeString(temp, inlinePem.replace("\\n", "\n").trim());
                temp.toFile().deleteOnExit();
                return Optional.of(temp);
            } catch (IOException ignored) {
                return Optional.empty();
            }
        }
        return resolveCaCertPath(configured, resourceLoader);
    }

    static Optional<Path> resolveCaCertPath(String configured, ResourceLoader resourceLoader) {
        if (!StringUtils.hasText(configured)) {
            return Optional.empty();
        }
        String trimmed = configured.trim();
        if (trimmed.startsWith("classpath:")) {
            try {
                Resource resource = resourceLoader.getResource(trimmed);
                if (resource.exists() && resource.isReadable()) {
                    Path temp = Files.createTempFile("aiven-ca-", ".pem");
                    try (var in = resource.getInputStream()) {
                        Files.copy(in, temp, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                    }
                    temp.toFile().deleteOnExit();
                    return Optional.of(temp);
                }
            } catch (IOException ignored) {
                return Optional.empty();
            }
            return Optional.empty();
        }

        Path path = Path.of(trimmed);
        if (Files.isRegularFile(path)) {
            return Optional.of(path);
        }
        Path fromBackend = Path.of("backend").resolve(trimmed);
        if (Files.isRegularFile(fromBackend)) {
            return Optional.of(fromBackend);
        }
        Path fromCwd = Path.of(System.getProperty("user.dir")).resolve(trimmed);
        if (Files.isRegularFile(fromCwd)) {
            return Optional.of(fromCwd);
        }
        return Optional.empty();
    }
}
