package com.wedservice.backend.config.datasource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.sql.DataSource;

@Configuration
@ConditionalOnProperty(prefix = "app.datasource.failover", name = "enabled", havingValue = "true")
@EnableConfigurationProperties(AppDataSourceFailoverProperties.class)
public class DataSourceFailoverConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceFailoverConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(
            AppDataSourceFailoverProperties props,
            ResourceLoader resourceLoader,
            @Value("${AIVEN_CA_CERT_PEM:}") String inlineCaCertPem
    ) {
        int timeoutMs = props.getProbeTimeoutMs();
        AppDataSourceFailoverProperties.Local local = props.getLocal();
        AppDataSourceFailoverProperties.Remote remote = props.getRemote();

        if (props.isPreferRemote() && remote.isEnabled() && StringUtils.hasText(remote.getPassword())) {
            String remoteUrl = JdbcUrlBuilder.buildRemoteUrl(remote, timeoutMs, resourceLoader, inlineCaCertPem);
            log.info("Probing remote database {}:{} / {} ...", remote.getHost(), remote.getPort(), remote.getDatabase());
            if (JdbcUrlBuilder.resolveCaCert(remote.getCaCertPath(), inlineCaCertPem, resourceLoader).isEmpty()) {
                log.warn(
                        "Aiven CA certificate not found at '{}'. Using sslMode without VERIFY_IDENTITY. "
                                + "Download CA from Aiven console → save as backend/ca.pem",
                        remote.getCaCertPath()
                );
            }
            if (DatabaseConnectivityProbe.canConnect(remoteUrl, remote.getUsername(), remote.getPassword(), timeoutMs)) {
                logBanner(ActiveDatabaseTarget.Kind.REMOTE, remote.getHost(), remote.getPort(), remote.getDatabase());
                ActiveDatabaseTarget.register(
                        ActiveDatabaseTarget.Kind.REMOTE,
                        remote.getHost(),
                        remote.getPort(),
                        remote.getDatabase(),
                        remoteUrl
                );
                return createHikari(remoteUrl, remote.getUsername(), remote.getPassword(), "TravelViet-Aiven", timeoutMs);
            }
            log.warn(
                    "Remote database unavailable ({}:{}). Falling back to local MySQL.",
                    remote.getHost(),
                    remote.getPort()
            );
        } else if (remote.isEnabled() && !StringUtils.hasText(remote.getPassword())) {
            log.warn(
                    "AIVEN_DB_PASSWORD chưa có — bỏ qua DB cloud. "
                            + "Thêm AIVEN_DB_PASSWORD (và file CA) hoặc bật MySQL local (dev)."
            );
        }

        if (!local.isEnabled()) {
            throw new IllegalStateException(
                    "Không kết nối được Aiven DB (prod). Kiểm tra AIVEN_DB_PASSWORD, AIVEN_CA_CERT_PATH "
                            + "(Docker: ca.pem), và allowlist IP trên Aiven."
            );
        }

        return connectLocalWithPortFallback(local, timeoutMs, remote.isEnabled() && !StringUtils.hasText(remote.getPassword()));
    }

    private DataSource connectLocalWithPortFallback(
            AppDataSourceFailoverProperties.Local local,
            int timeoutMs,
            boolean remoteSkippedNoPassword
    ) {
        List<String> tried = new ArrayList<>();
        for (int port : localPortCandidates(local.getPort())) {
            AppDataSourceFailoverProperties.Local attempt = copyLocalWithPort(local, port);
            String localUrl = JdbcUrlBuilder.buildLocalUrl(attempt, timeoutMs);
            String endpoint = local.getHost() + ":" + port + "/" + local.getDatabase();
            tried.add(endpoint);
            log.info("Probing local database {} ...", endpoint);
            if (DatabaseConnectivityProbe.canConnect(localUrl, local.getUsername(), local.getPassword(), timeoutMs)) {
                if (port != local.getPort()) {
                    log.warn(
                            "Connected on port {} (DB_PORT trong .env là {}). Cập nhật DB_PORT={} trong backend/.env.",
                            port,
                            local.getPort(),
                            port
                    );
                }
                logBanner(ActiveDatabaseTarget.Kind.LOCAL, local.getHost(), port, local.getDatabase());
                ActiveDatabaseTarget.register(
                        ActiveDatabaseTarget.Kind.LOCAL,
                        local.getHost(),
                        port,
                        local.getDatabase(),
                        localUrl
                );
                return createHikari(localUrl, local.getUsername(), local.getPassword(), "TravelViet-Local", timeoutMs);
            }
        }
        throw new IllegalStateException(buildLocalConnectionHelp(tried, remoteSkippedNoPassword));
    }

    /** Fallback local: cổng cấu hình (mặc định 3307), không tự thử 3306. */
    private static int[] localPortCandidates(int configuredPort) {
        Set<Integer> ports = new LinkedHashSet<>();
        ports.add(configuredPort);
        if (configuredPort != 3307) {
            ports.add(3307);
        }
        return ports.stream().mapToInt(Integer::intValue).toArray();
    }

    private static AppDataSourceFailoverProperties.Local copyLocalWithPort(
            AppDataSourceFailoverProperties.Local source,
            int port
    ) {
        AppDataSourceFailoverProperties.Local copy = new AppDataSourceFailoverProperties.Local();
        copy.setHost(source.getHost());
        copy.setPort(port);
        copy.setDatabase(source.getDatabase());
        copy.setUsername(source.getUsername());
        copy.setPassword(source.getPassword());
        copy.setUseSsl(source.isUseSsl());
        return copy;
    }

    private static String buildLocalConnectionHelp(List<String> tried, boolean remoteSkippedNoPassword) {
        StringBuilder sb = new StringBuilder();
        sb.append("Không kết nối được MySQL local. Đã thử: ").append(String.join(", ", tried)).append(". ");
        sb.append("Cách xử lý: (1) Bật MySQL Server / Workbench; ");
        sb.append("(2) Chạy script backend/scripts/mysql_dev_user_all_hosts.sql bằng root; ");
        sb.append("(3) Sửa backend/.env: DB_PORT=3307, DB_USERNAME, DB_PASSWORD; ");
        if (remoteSkippedNoPassword) {
            sb.append("(4) Hoặc dùng Aiven: thêm AIVEN_DB_PASSWORD + file backend/ca.pem. ");
        }
        sb.append("Xem backend/docs/DATABASE_FAILOVER.md");
        return sb.toString();
    }

    private static DataSource createHikari(
            String jdbcUrl,
            String username,
            String password,
            String poolName,
            int connectionTimeoutMs
    ) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setPoolName(poolName);
        config.setConnectionTimeout(connectionTimeoutMs);
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        return new HikariDataSource(config);
    }

    private static void logBanner(ActiveDatabaseTarget.Kind kind, String host, int port, String database) {
        String label = kind == ActiveDatabaseTarget.Kind.REMOTE ? "REMOTE (Aiven cloud)" : "LOCAL (fallback)";
        log.info("============================================================");
        log.info("Active database: {} — {}:{}/{}", label, host, port, database);
        log.info("============================================================");
    }
}
