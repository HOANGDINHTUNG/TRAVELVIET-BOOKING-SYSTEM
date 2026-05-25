package com.wedservice.backend.config.datasource;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Cấu hình DB ưu tiên cloud (Aiven) và fallback local khi cloud không kết nối được.
 */
@Data
@ConfigurationProperties(prefix = "app.datasource.failover")
public class AppDataSourceFailoverProperties {

    /** Bật chọn DB remote/local lúc khởi động (profile dev). */
    private boolean enabled = false;

    /** Thử remote trước khi dùng local. */
    private boolean preferRemote = true;

    /** Timeout khi probe kết nối (ms). */
    private int probeTimeoutMs = 5000;

    private Remote remote = new Remote();
    private Local local = new Local();

    @Data
    public static class Remote {
        private boolean enabled = true;
        private String host = "";
        private int port = 3306;
        private String database = "defaultdb";
        private String username = "";
        private String password = "";
        /**
         * REQUIRED hoặc VERIFY_IDENTITY (khuyến nghị khi có file CA).
         */
        private String sslMode = "REQUIRED";
        /**
         * Đường dẫn file CA.pem từ Aiven (Show → download). Có thể relative từ thư mục chạy app.
         */
        private String caCertPath = "";
        /**
         * URI Public từ Aiven (mysql://user:pass@host:port/db) — map từ MYSQL_SERVICE_URI trên Render.
         */
        private String serviceUri = "";
    }

    @Data
    public static class Local {
        /** false trên Render/prod — không fallback MySQL 127.0.0.1 trong container. */
        private boolean enabled = true;
        private String host = "127.0.0.1";
        private int port = 3307;
        private String database = "wedservice";
        private String username = "wed_app_user";
        private String password = "";
        private boolean useSsl = false;
    }
}
