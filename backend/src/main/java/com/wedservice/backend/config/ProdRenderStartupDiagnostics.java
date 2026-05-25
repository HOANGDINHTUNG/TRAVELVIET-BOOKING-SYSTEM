package com.wedservice.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationFailedEvent;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Log rõ khi Render deploy fail — tránh log “im lặng” rồi exit 1 (thường do OOM trên free 512MB).
 */
@Component
@Profile("prod")
public class ProdRenderStartupDiagnostics {

    private static final Logger log = LoggerFactory.getLogger(ProdRenderStartupDiagnostics.class);

    @EventListener
    public void onReady(ApplicationReadyEvent event) {
        log.info("Render/prod: application READY — Tomcat listen PORT; Render health: GET /api/v1/live");
    }

    @EventListener
    public void onFailed(ApplicationFailedEvent event) {
        Throwable ex = event.getException();
        log.error("Render/prod: application FAILED to start", ex);
    }
}
