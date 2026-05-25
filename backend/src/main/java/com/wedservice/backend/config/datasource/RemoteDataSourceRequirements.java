package com.wedservice.backend.config.datasource;

import org.springframework.util.StringUtils;

/**
 * Kiểm tra cấu hình DB remote trước khi probe (prod / Render).
 */
final class RemoteDataSourceRequirements {

    /** Host mẫu cũ trong repo — không còn tồn tại trên DNS công cộng. */
    static final String STALE_EXAMPLE_HOST = "mysql-lab-mtung3365-864a.f.aivencloud.com";

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
            throw new IllegalStateException(
                    """
                    Prod (Render): chưa có host MySQL Aiven.
                    Cách 1 (khuyến nghị): MYSQL_SERVICE_URI = Service URI (Public) từ Aiven Console.
                    Cách 2: AIVEN_DB_HOST + AIVEN_DB_PORT + AIVEN_DB_PASSWORD.
                    Không dùng host mặc định trong code — mỗi service Aiven có hostname riêng.
                    Xem backend/docs/AIVEN_PUBLIC_ACCESS.md
                    """
                            .trim()
            );
        }
        if (STALE_EXAMPLE_HOST.equalsIgnoreCase(remote.getHost().trim())) {
            throw new IllegalStateException(
                    """
                    Prod (Render): AIVEN_DB_HOST vẫn là hostname mẫu cũ (%s) — domain này không tồn tại trên DNS.
                    Mở Aiven Console → MySQL service hiện tại → Connection information → Public:
                    - Dán MYSQL_SERVICE_URI, hoặc
                    - Copy Host → AIVEN_DB_HOST, Port → AIVEN_DB_PORT
                    Bật Public access nếu chưa có. Sau đó Redeploy Render.
                    """
                            .formatted(STALE_EXAMPLE_HOST)
                            .trim()
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
