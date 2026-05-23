package com.wedservice.backend.config.datasource;

import lombok.Getter;

/**
 * Ghi nhận DB đang dùng sau khi failover chọn xong (startup).
 */
@Getter
public final class ActiveDatabaseTarget {

    public enum Kind {
        REMOTE,
        LOCAL
    }

    private static volatile ActiveDatabaseTarget instance;

    private final Kind kind;
    private final String host;
    private final int port;
    private final String database;
    private final String jdbcUrlMasked;

    private ActiveDatabaseTarget(Kind kind, String host, int port, String database, String jdbcUrlMasked) {
        this.kind = kind;
        this.host = host;
        this.port = port;
        this.database = database;
        this.jdbcUrlMasked = jdbcUrlMasked;
    }

    public static void register(Kind kind, String host, int port, String database, String jdbcUrlMasked) {
        instance = new ActiveDatabaseTarget(kind, host, port, database, jdbcUrlMasked);
    }

    public static ActiveDatabaseTarget get() {
        return instance;
    }

    public String displayName() {
        return kind == Kind.REMOTE ? "Aiven (cloud)" : "Local MySQL";
    }
}
