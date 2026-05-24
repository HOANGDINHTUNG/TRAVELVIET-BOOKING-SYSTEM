package com.wedservice.backend.config.api;

import com.wedservice.backend.config.datasource.ActiveDatabaseTarget;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Bổ sung thông tin DB/API đang dùng vào {@code GET /system/health}.
 */
@Component
public class RuntimeConnectivityContributor {

    public Map<String, Object> connectivitySnapshot() {
        Map<String, Object> snapshot = new LinkedHashMap<>();

        ActiveDatabaseTarget db = ActiveDatabaseTarget.get();
        if (db != null) {
            snapshot.put("database", Map.of(
                    "target", db.getKind().name(),
                    "displayName", db.displayName(),
                    "host", db.getHost(),
                    "port", db.getPort(),
                    "database", db.getDatabase()
            ));
        }

        ActiveApiEndpoint api = ActiveApiEndpoint.get();
        if (api != null) {
            Map<String, Object> apiMap = new LinkedHashMap<>();
            apiMap.put("target", api.getKind().name());
            apiMap.put("displayName", api.displayName());
            apiMap.put("recommendedBaseUrl", api.getRecommendedBaseUrl());
            apiMap.put("publicBaseUrl", api.getPublicBaseUrl());
            apiMap.put("localBaseUrl", api.getLocalBaseUrl());
            apiMap.put("publicReachable", api.isPublicReachable());
            snapshot.put("api", apiMap);
        }

        return snapshot.isEmpty() ? Map.of() : Map.of("connectivity", snapshot);
    }
}
