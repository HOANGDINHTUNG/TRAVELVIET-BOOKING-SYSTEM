package com.wedservice.backend.config.api;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

final class HttpApiReachabilityProbe {

    /** Reused client avoids TCP handshake cost on every startup probe. */
    private static final HttpClient SHARED_CLIENT = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    private HttpApiReachabilityProbe() {
    }

    static boolean isReachable(String baseUrl, String healthPath, int timeoutMs) {
        if (baseUrl == null || baseUrl.isBlank()) {
            return false;
        }
        String path = healthPath == null || healthPath.isBlank() ? "/system/health" : healthPath;
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        String url = trimTrailingSlash(baseUrl.trim()) + path;
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofMillis(timeoutMs))
                    .GET()
                    .build();
            HttpResponse<Void> response =
                    SHARED_CLIENT.send(request, HttpResponse.BodyHandlers.discarding());
            int code = response.statusCode();
            return code >= 200 && code < 500;
        } catch (Exception ignored) {
            return false;
        }
    }

    private static String trimTrailingSlash(String url) {
        while (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }
        return url;
    }
}
