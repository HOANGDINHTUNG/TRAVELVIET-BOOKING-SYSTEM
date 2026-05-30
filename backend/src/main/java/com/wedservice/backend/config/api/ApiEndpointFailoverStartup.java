package com.wedservice.backend.config.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.concurrent.Executor;

/**
 * Probe API public (Render) without blocking Spring Boot startup.
 * Registers a safe LOCAL default immediately, then updates after background probe completes.
 */
@Component
@ConditionalOnProperty(prefix = "app.api.failover", name = "enabled", havingValue = "true")
@EnableConfigurationProperties(AppApiFailoverProperties.class)
public class ApiEndpointFailoverStartup implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ApiEndpointFailoverStartup.class);

    private final AppApiFailoverProperties props;
    private final Executor apiProbeExecutor;
    private final ResilientHttpApiReachabilityProbe reachabilityProbe;

    public ApiEndpointFailoverStartup(
            AppApiFailoverProperties props,
            @Qualifier("apiProbeExecutor") Executor apiProbeExecutor,
            ResilientHttpApiReachabilityProbe reachabilityProbe
    ) {
        this.props = props;
        this.apiProbeExecutor = apiProbeExecutor;
        this.reachabilityProbe = reachabilityProbe;
    }

    @Override
    public void run(ApplicationArguments args) {
        String publicUrl = props.getPublicBaseUrl();
        String localUrl = props.getLocalBaseUrl();
        registerDefaultLocalEndpoint(publicUrl, localUrl);
        apiProbeExecutor.execute(() -> runBackgroundProbe(publicUrl, localUrl));
        log.info("API failover probe scheduled on background thread (startup not blocked).");
    }

    private void registerDefaultLocalEndpoint(String publicUrl, String localUrl) {
        String recommended = StringUtils.hasText(localUrl) ? localUrl : publicUrl;
        ActiveApiEndpoint.register(
                ActiveApiEndpoint.Kind.LOCAL,
                recommended,
                publicUrl,
                localUrl,
                false
        );
    }

    private void runBackgroundProbe(String publicUrl, String localUrl) {
        int timeoutMs = props.getProbeTimeoutMs();
        String healthPath = props.getHealthPath();

        boolean publicReachable = false;
        boolean localReachable = false;
        try {
            if (props.isPreferPublic()) {
                if (StringUtils.hasText(publicUrl)) {
                    log.info("Background probing public API (prefer-public) {} ...", publicUrl);
                    publicReachable = reachabilityProbe.isReachable(publicUrl, healthPath, timeoutMs);
                    if (publicReachable) {
                        log.info("Public API is reachable.");
                    } else {
                        log.warn(
                                "Public API unreachable (timeout {} ms). Clients should use local: {}",
                                timeoutMs,
                                localUrl
                        );
                    }
                }
            } else {
                log.info("app.api.failover.prefer-public=false — probe local trước, public làm dự phòng.");
                if (StringUtils.hasText(localUrl)) {
                    log.info("Background probing local API {} ...", localUrl);
                    localReachable = reachabilityProbe.isReachable(localUrl, healthPath, timeoutMs);
                    if (localReachable) {
                        log.info("Local API is reachable.");
                    } else {
                        log.warn("Local API unreachable (timeout {} ms). Thử public API ...", timeoutMs);
                    }
                }
                if (!localReachable && StringUtils.hasText(publicUrl)) {
                    log.info("Background probing public API {} ...", publicUrl);
                    publicReachable = reachabilityProbe.isReachable(publicUrl, healthPath, timeoutMs);
                    if (publicReachable) {
                        log.info("Public API is reachable (fallback).");
                    } else {
                        log.warn("Public API also unreachable (timeout {} ms).", timeoutMs);
                    }
                }
            }
        } catch (Exception ex) {
            log.warn("API failover probe failed: {}", ex.getMessage());
        }

        ActiveApiEndpoint.Kind kind;
        String recommended;
        if (props.isPreferPublic()) {
            if (publicReachable) {
                kind = ActiveApiEndpoint.Kind.PUBLIC;
                recommended = publicUrl;
            } else {
                kind = ActiveApiEndpoint.Kind.LOCAL;
                recommended = StringUtils.hasText(localUrl) ? localUrl : publicUrl;
            }
        } else if (localReachable) {
            kind = ActiveApiEndpoint.Kind.LOCAL;
            recommended = localUrl;
        } else if (publicReachable) {
            kind = ActiveApiEndpoint.Kind.PUBLIC;
            recommended = publicUrl;
        } else {
            kind = ActiveApiEndpoint.Kind.LOCAL;
            recommended = StringUtils.hasText(localUrl) ? localUrl : publicUrl;
        }

        ActiveApiEndpoint.register(kind, recommended, publicUrl, localUrl, publicReachable);
        log.info("============================================================");
        log.info(
                "Active API endpoint (post-probe): {} — {}",
                kind == ActiveApiEndpoint.Kind.PUBLIC ? "PUBLIC" : "LOCAL",
                recommended
        );
        log.info("  publicBaseUrl={} (reachable={})", publicUrl, publicReachable);
        log.info("  localBaseUrl={}", localUrl);
        log.info("============================================================");
    }
}
