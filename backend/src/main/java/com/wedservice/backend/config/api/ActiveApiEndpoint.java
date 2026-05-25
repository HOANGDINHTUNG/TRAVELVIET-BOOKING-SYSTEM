package com.wedservice.backend.config.api;

import lombok.Getter;

/**
 * URL API backend được khuyến nghị sau khi probe public/local (startup).
 */
@Getter
public final class ActiveApiEndpoint {

    public enum Kind {
        PUBLIC,
        LOCAL
    }

    private static volatile ActiveApiEndpoint instance;

    private final Kind kind;
    private final String recommendedBaseUrl;
    private final String publicBaseUrl;
    private final String localBaseUrl;
    private final boolean publicReachable;

    private ActiveApiEndpoint(
            Kind kind,
            String recommendedBaseUrl,
            String publicBaseUrl,
            String localBaseUrl,
            boolean publicReachable
    ) {
        this.kind = kind;
        this.recommendedBaseUrl = recommendedBaseUrl;
        this.publicBaseUrl = publicBaseUrl;
        this.localBaseUrl = localBaseUrl;
        this.publicReachable = publicReachable;
    }

    public static void register(
            Kind kind,
            String recommendedBaseUrl,
            String publicBaseUrl,
            String localBaseUrl,
            boolean publicReachable
    ) {
        instance = new ActiveApiEndpoint(kind, recommendedBaseUrl, publicBaseUrl, localBaseUrl, publicReachable);
    }

    public static ActiveApiEndpoint get() {
        return instance;
    }

    public String displayName() {
        return kind == Kind.PUBLIC ? "Public API (cloud)" : "Local API (localhost)";
    }
}
