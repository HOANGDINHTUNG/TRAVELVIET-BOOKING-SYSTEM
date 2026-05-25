# Render — checklist env (bắt buộc để deploy BE)

Deploy **không thể thành công** nếu thiếu database Aiven hợp lệ. Host mẫu cũ `mysql-lab-mtung3365-864a.f.aivencloud.com` **không tồn tại trên DNS**.

## Bước 1 — Aiven Console

1. Service **MySQL** (service bạn đang dùng, không phải service đã xóa).
2. **Networking** → bật **Public access** → allowlist `0.0.0.0/0` (lab).
3. **Connection information** → tab **Public** → copy **Service URI**.

Ví dụ URI:

```text
mysql://avnadmin:YOUR_PASSWORD@mysql-xxxxx-xxxxx.a.aivencloud.com:12345/defaultdb?ssl-mode=REQUIRED
```

## Bước 2 — Render → Environment

Mẫu trên Git: `backend/.env.render.example` → copy thành `.env.render` → điền secret → Render **Add from .env**.

| Biến | Bắt buộc | Giá trị |
|------|----------|---------|
| `SPRING_PROFILES_ACTIVE` | Có | `prod` |
| `JWT_SECRET` | Có | Chuỗi random ≥ 32 ký tự |
| `MYSQL_SERVICE_URI` | **Có (khuyến nghị)** | Dán nguyên URI Public từ Aiven |
| `AIVEN_DB_PASSWORD` | Có* | Password `avnadmin` (*nếu URI đã có password có thể bỏ) |
| `AIVEN_CA_CERT_PATH` | Có | `classpath:ssl/ca.pem` |
| `FLYWAY_ENABLED` | Khuyến nghị | `false` (sau khi đã migrate) |
| `MINIO_ENABLED` | Khuyến nghị | `false` |
| Health Check Path | Có | `/api/v1/live` |

**Xóa** nếu còn:

- `AIVEN_DB_HOST=mysql-lab-mtung3365-864a.f.aivencloud.com` (hostname cũ, sai)

**Tùy chọn** (khi không dùng `MYSQL_SERVICE_URI`):

- `AIVEN_DB_HOST` = Host Public từ Aiven
- `AIVEN_DB_PORT` = Port Public (vd. `23132`)

## Bước 3 — Redeploy

Push code mới → Render **Manual Deploy** → xem log:

```text
Render DB env: MYSQL_SERVICE_URI=set ...
Remote DB from env URI → <host>:<port> / defaultdb
TCP ... reachable
Remote MySQL connected
Active database: REMOTE (Aiven cloud)
```

## Lỗi thường gặp

| Log | Cách sửa |
|-----|----------|
| `MYSQL_SERVICE_URI=missing` | Thêm URI từ Aiven Public |
| `DNS` / không resolve | Bật Public access trên Aiven; service phải **Running** |
| Exit 1, không có ERROR, dừng ở Hibernate | OOM heap — giảm/tăng Xmx trong Dockerfile |
| `OutOfMemoryError: Metaspace` | Tăng MaxMetaspaceSize trong Dockerfile (hiện ~160m) |
| `Port scan timeout` / `Timed Out` | App start > vài phút — dùng commit mới (lazy repo); Health Path `/api/v1/live`; hoặc nâng plan Render |
| `No open ports detected` | App chưa start xong (Tomcat chưa listen) — thường đi kèm OOM hoặc crash trước `Started BackendApplication` |
| `DNS` / `Name or service not known` | Host sai hoặc service Aiven đã xóa — copy lại Public host |
| `JWT_SECRET thiếu` | Thêm `JWT_SECRET` trên Render |
