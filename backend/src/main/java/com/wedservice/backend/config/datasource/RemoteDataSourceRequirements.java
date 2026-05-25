package com.wedservice.backend.config.datasource;

import org.springframework.util.StringUtils;

/**
 * Kiểm tra cấu hình DB remote trước khi probe (prod / Render).
 */
final class RemoteDataSourceRequirements {

    private RemoteDataSourceRequirements() {
    }

    static void requireConfiguredForProd(AppDataSourceFailoverProperties.Remote remote) {
        if (!StringUtils.hasText(remote.getPassword())) {
            throw new IllegalStateException(
                    """
                    Prod (Render): thiếu AIVEN_DB_PASSWORD.
                    Aiven Console → Users → avnadmin → copy password → Render Environment.
                    """
                            .trim()
            );
        }
        if (!StringUtils.hasText(remote.getHost())) {
            boolean passwordOnly = StringUtils.hasText(remote.getPassword());
            throw new IllegalStateException(
                    (passwordOnly
                            ? """
                            Prod (Render): bạn đã đặt AIVEN_DB_PASSWORD nhưng THIẾU địa chỉ server MySQL.
                            Log thường thấy: MYSQL_SERVICE_URI=missing, AIVEN_DB_HOST=missing, AIVEN_DB_PASSWORD=set

                            Làm trên Aiven Console (service MySQL đang chạy, không phải service đã xóa):
                            1) Networking → bật Public access (allowlist 0.0.0.0/0 cho lab)
                            2) Connection information → Public → copy Service URI

                            Làm trên Render → Environment → thêm MỘT trong hai cách:
                            Cách A (khuyến nghị): MYSQL_SERVICE_URI = dán nguyên URI Public từ Aiven
                            Cách B: AIVEN_DB_HOST = Host Public, AIVEN_DB_PORT = Port Public (giữ AIVEN_DB_PASSWORD)

                            Xem: backend/docs/RENDER_ENV_CHECKLIST.md
                            """
                            : """
                            Prod (Render): thiếu cấu hình database Aiven.
                            Thêm trên Render: MYSQL_SERVICE_URI (URI Public từ Aiven) và AIVEN_DB_PASSWORD.
                            Xem: backend/docs/RENDER_ENV_CHECKLIST.md
                            """
                    ).trim()
            );
        }
        if (remote.getPort() <= 0 || remote.getPort() > 65535) {
            throw new IllegalStateException(
                    "Prod (Render): AIVEN_DB_PORT không hợp lệ (%d). Copy port Public từ Aiven Console."
                            .formatted(remote.getPort())
            );
        }
    }

    static boolean isDnsFailure(TcpReachabilityProbe.Result tcp) {
        return tcp != null && !tcp.reachable() && tcp.detail().contains("(DNS)");
    }
}
