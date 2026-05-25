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
import java.util.Optional;
import java.util.Set;

import javax.sql.DataSource;

@Configuration
@ConditionalOnProperty(prefix = "app.datasource.failover", name = "enabled", havingValue = "true")
@EnableConfigurationProperties({AppDataSourceFailoverProperties.class, HikariPoolProperties.class})
public class DataSourceFailoverConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceFailoverConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(
            AppDataSourceFailoverProperties props,
            HikariPoolProperties hikariPoolProperties,
            ResourceLoader resourceLoader,
            @Value("${AIVEN_CA_CERT_PEM:}") String inlineCaCertPem
    ) {
        int timeoutMs = props.getProbeTimeoutMs();
        AppDataSourceFailoverProperties.Local local = props.getLocal();
        AppDataSourceFailoverProperties.Remote remote = props.getRemote();

        boolean fromYamlUri = MysqlServiceUriResolver.applyFromConfiguredProperties(remote);
        boolean fromEnvUri = MysqlServiceUriResolver.applyFromEnvironment(remote);
        RemoteDiscreteEnvAssembler.applyMissingFieldsFromEnvironment(remote);
        if (fromYamlUri || fromEnvUri) {
            log.info(
                    "Remote DB from {} → {}:{} / {}",
                    fromEnvUri ? "env URI" : "app.datasource.failover.remote.service-uri",
                    remote.getHost(),
                    remote.getPort(),
                    remote.getDatabase()
            );
        }

        if (props.isPreferRemote() && remote.isEnabled()) {
            if (!local.isEnabled()) {
                RemoteDataSourceEnvDiagnostics.logRenderDatabaseEnv(remote);
                RemoteDataSourceRequirements.requireConfiguredForProd(remote);
            }
        }

        if (props.isPreferRemote() && remote.isEnabled() && StringUtils.hasText(remote.getPassword())) {
            if (props.isSkipStartupProbe()) {
                return connectRemoteWithoutProbe(
                        remote, timeoutMs, resourceLoader, inlineCaCertPem, hikariPoolProperties);
            }

            log.info("Probing remote database {}:{} / {} ...", remote.getHost(), remote.getPort(), remote.getDatabase());
            TcpReachabilityProbe.Result tcp = TcpReachabilityProbe.probe(remote.getHost(), remote.getPort(), 5000);
            log.info("TCP pre-check: {}", tcp.detail());

            if (!local.isEnabled() && !tcp.reachable()) {
                throw new IllegalStateException(
                        buildProdAivenFailureMessage(
                                remote,
                                RemoteDataSourceRequirements.isDnsFailure(tcp)
                                        ? "DNS resolution failed"
                                        : "TCP unreachable",
                                tcp
                        )
                );
            }

            if (JdbcUrlBuilder.resolveCaCert(remote.getCaCertPath(), inlineCaCertPem, resourceLoader).isEmpty()) {
                log.warn(
                        "Aiven CA certificate not found at '{}'. Using sslMode without serverSslCert. "
                                + "Download CA from Aiven console → classpath:ssl/ca.pem",
                        remote.getCaCertPath()
                );
            }

            RemoteConnectOutcome outcome = tryConnectRemote(
                    remote, timeoutMs, resourceLoader, inlineCaCertPem);
            if (outcome.success().isPresent()) {
                RemoteConnectResult ok = outcome.success().get();
                logBanner(ActiveDatabaseTarget.Kind.REMOTE, remote.getHost(), remote.getPort(), remote.getDatabase());
                ActiveDatabaseTarget.register(
                        ActiveDatabaseTarget.Kind.REMOTE,
                        remote.getHost(),
                        remote.getPort(),
                        remote.getDatabase(),
                        ok.jdbcUrl()
                );
                return createHikari(
                        ok.jdbcUrl(),
                        remote.getUsername(),
                        remote.getPassword(),
                        "TravelViet-Aiven",
                        timeoutMs,
                        hikariPoolProperties
                );
            }

            String remoteError = outcome.lastError() != null ? outcome.lastError() : "unknown";
            log.error(
                    "Aiven connection failed ({}:{}/{}): {}",
                    remote.getHost(),
                    remote.getPort(),
                    remote.getDatabase(),
                    remoteError
            );
            if (!local.isEnabled()) {
                throw new IllegalStateException(buildProdAivenFailureMessage(remote, remoteError, tcp));
            }
            log.warn("Falling back to local MySQL after Aiven failure.");
        } else if (remote.isEnabled() && !StringUtils.hasText(remote.getPassword())) {
            log.warn(
                    "AIVEN_DB_PASSWORD chưa có — bỏ qua DB cloud. "
                            + "Thêm AIVEN_DB_PASSWORD (và file CA) hoặc bật MySQL local (dev)."
            );
        }

        if (!local.isEnabled()) {
            throw new IllegalStateException(
                    "Prod requires Aiven DB but remote was not connected. Set AIVEN_DB_PASSWORD on Render "
                            + "and enable Aiven public access (see backend/docs/RENDER_DEPLOY.md)."
            );
        }

        return connectLocalWithPortFallback(
                local, timeoutMs, remote.isEnabled() && !StringUtils.hasText(remote.getPassword()), hikariPoolProperties);
    }

    private DataSource connectLocalWithPortFallback(
            AppDataSourceFailoverProperties.Local local,
            int timeoutMs,
            boolean remoteSkippedNoPassword,
            HikariPoolProperties hikariPoolProperties
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
                return createHikari(
                        localUrl,
                        local.getUsername(),
                        local.getPassword(),
                        "TravelViet-Local",
                        timeoutMs,
                        hikariPoolProperties
                );
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

    private static DataSource connectRemoteWithoutProbe(
            AppDataSourceFailoverProperties.Remote remote,
            int timeoutMs,
            ResourceLoader resourceLoader,
            String inlineCaCertPem,
            HikariPoolProperties hikariPoolProperties
    ) {
        log.info(
                "Skip startup DB probe (Render fast-start) → {}:{} / {}",
                remote.getHost(),
                remote.getPort(),
                remote.getDatabase()
        );
        String jdbcUrl = JdbcUrlBuilder.buildRemoteUrl(remote, timeoutMs, resourceLoader, inlineCaCertPem);
        logBanner(ActiveDatabaseTarget.Kind.REMOTE, remote.getHost(), remote.getPort(), remote.getDatabase());
        ActiveDatabaseTarget.register(
                ActiveDatabaseTarget.Kind.REMOTE,
                remote.getHost(),
                remote.getPort(),
                remote.getDatabase(),
                jdbcUrl
        );
        return createHikari(
                jdbcUrl,
                remote.getUsername(),
                remote.getPassword(),
                "TravelViet-Aiven",
                timeoutMs,
                hikariPoolProperties
        );
    }

    private static RemoteConnectOutcome tryConnectRemote(
            AppDataSourceFailoverProperties.Remote remote,
            int timeoutMs,
            ResourceLoader resourceLoader,
            String inlineCaCertPem
    ) {
        boolean hasCa = JdbcUrlBuilder.resolveCaCert(remote.getCaCertPath(), inlineCaCertPem, resourceLoader).isPresent();
        LinkedHashSet<String> sslModes = new LinkedHashSet<>();
        if (StringUtils.hasText(remote.getSslMode())) {
            sslModes.add(remote.getSslMode().trim());
        }
        sslModes.add("REQUIRED");
        if (hasCa) {
            sslModes.add("VERIFY_CA");
        }

        String lastError = null;
        for (String sslMode : sslModes) {
            String remoteUrl = JdbcUrlBuilder.buildRemoteUrl(
                    remote, timeoutMs, resourceLoader, inlineCaCertPem, sslMode);
            Optional<String> err = DatabaseConnectivityProbe.probeFailureReason(
                    remoteUrl, remote.getUsername(), remote.getPassword(), timeoutMs);
            if (err.isEmpty()) {
                log.info("Remote MySQL connected (sslMode={})", sslMode);
                return new RemoteConnectOutcome(Optional.of(new RemoteConnectResult(remoteUrl, sslMode)), null);
            }
            lastError = err.get();
            log.warn("Remote probe sslMode={} failed: {}", sslMode, lastError);
        }
        return new RemoteConnectOutcome(Optional.empty(), lastError);
    }

    private record RemoteConnectResult(String jdbcUrl, String sslMode) {
    }

    private record RemoteConnectOutcome(Optional<RemoteConnectResult> success, String lastError) {
    }

    private static String buildProdAivenFailureMessage(
            AppDataSourceFailoverProperties.Remote remote,
            String sqlError,
            TcpReachabilityProbe.Result tcp
    ) {
        String networkHint;
        if (tcp.reachable()) {
            networkHint = """
                    TCP OK — port is open from this host. Likely causes:
                    - Wrong AIVEN_DB_PASSWORD on Render
                    - Wrong host/port (copy from Aiven → Connection info → set AIVEN_DB_HOST / AIVEN_DB_PORT)
                    - SSL/CA mismatch (use classpath:ssl/ca.pem or refresh CA from Aiven)
                    """;
        } else if (RemoteDataSourceRequirements.isDnsFailure(tcp)) {
            networkHint = """
                    DNS FAILED — hostname does not resolve on Render (Name or service not known).
                    Copy host/URI from Aiven Console → Connection information → Public (service must be Running).
                    Set MYSQL_SERVICE_URI or AIVEN_DB_HOST + AIVEN_DB_PORT on Render, then redeploy.
                    See: backend/docs/AIVEN_PUBLIC_ACCESS.md
                    """;
        } else {
            networkHint = """
                    TCP FAILED — Render cannot reach Aiven host:port (firewall / no public access).
                    REQUIRED on Aiven Console:
                    1) Open your MySQL service → Networking / Public access
                    2) Enable "Public internet access" (or similar)
                    3) IP allowlist: add 0.0.0.0/0 for lab, OR Render static outbound IPs (paid plan)
                    4) Wait 1–2 minutes, then Redeploy Render
                    See: backend/docs/AIVEN_PUBLIC_ACCESS.md
                    """;
        }

        return """
                Cannot connect to Aiven from Render (prod).
                SQL: %s
                %s
                TCP check: %s
                
                Render env checklist:
                - MYSQL_SERVICE_URI = Public Service URI from Aiven (recommended)
                - AIVEN_DB_PASSWORD = password from Aiven (Users → avnadmin)
                - AIVEN_DB_HOST=%s  AIVEN_DB_PORT=%d  (if not using MYSQL_SERVICE_URI)
                - AIVEN_CA_CERT_PATH=classpath:ssl/ca.pem
                """
                .formatted(
                        sqlError,
                        networkHint.trim(),
                        tcp.detail(),
                        remote.getHost(),
                        remote.getPort()
                )
                .trim();
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
            int connectionTimeoutMs,
            HikariPoolProperties pool
    ) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setPoolName(poolName);
        config.setConnectionTimeout(connectionTimeoutMs);
        config.setMaximumPoolSize(pool.getMaximumPoolSize());
        config.setMinimumIdle(pool.getMinimumIdle());
        config.setMaxLifetime(pool.getMaxLifetime());
        config.setIdleTimeout(pool.getIdleTimeout());
        if (pool.getLeakDetectionThreshold() > 0) {
            config.setLeakDetectionThreshold(pool.getLeakDetectionThreshold());
        }
        return new HikariDataSource(config);
    }

    private static void logBanner(ActiveDatabaseTarget.Kind kind, String host, int port, String database) {
        String label = kind == ActiveDatabaseTarget.Kind.REMOTE ? "REMOTE (Aiven cloud)" : "LOCAL (fallback)";
        log.info("============================================================");
        log.info("Active database: {} — {}:{}/{}", label, host, port, database);
        log.info("============================================================");
    }
}
