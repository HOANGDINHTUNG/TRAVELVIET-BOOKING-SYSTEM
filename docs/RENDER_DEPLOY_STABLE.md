# Deploy Render ổn định (làm theo đúng thứ tự)

## 1. Render Dashboard — Settings

| Mục | Giá trị |
|-----|---------|
| Root Directory | `backend` |
| Runtime | Docker |
| Branch | `main` |
| **Health Check Path** | **`/api/v1/live`** |

## 2. Environment — Import file

1. Mở `backend/.env.render` trên máy (đã điền secret).
2. Render → **Environment** → **Add from .env** → chọn file đó → **Save**.

Biến **bắt buộc**:

```text
SPRING_PROFILES_ACTIVE=prod
MYSQL_SERVICE_URI=mysql://avnadmin:...@host:port/defaultdb?ssl-mode=REQUIRED
JWT_SECRET=<≥32 ký tự>
AIVEN_CA_CERT_PATH=classpath:ssl/ca.pem
FLYWAY_ENABLED=false
MINIO_ENABLED=false
```

Hoặc thay URI bằng: `AIVEN_DB_HOST` + `AIVEN_DB_PORT` + `AIVEN_DB_PASSWORD`.

## 3. Aiven

- Public access ON, allowlist `0.0.0.0/0` (lab)
- Copy **Service URI** tab **Public** → dán vào `MYSQL_SERVICE_URI`

## 4. Deploy

**Manual Deploy** → đợi log:

```text
Skip startup DB probe (Render fast-start)
Tomcat started on port 10000
Render/prod: application READY
```

## 5. Kiểm tra

- `https://travelviet-booking-system.onrender.com/api/v1/live` → `{"status":"UP"}`
- `https://travelviet-booking-system.onrender.com/api/v1/actuator/health` → `{"status":"UP"}`

## Lỗi thường gặp

| Log | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| `Timed out ... actuator/health` | Health path sai hoặc endpoint chưa sẵn | Đổi Health Path → `/api/v1/live`, redeploy commit mới |
| `Port scan timeout` | Tomcat chưa listen kịp | Redeploy lần 2; hoặc nâng plan Render |
| `MYSQL_SERVICE_URI=missing` | Thiếu env trên Render | Import `.env.render` |
| `OutOfMemoryError` | 512MB | Giữ Dockerfile JVM hiện tại, không giảm Metaspace |

## Không dùng

- `backend/.env` (profile **dev**) để import Render
- Host Aiven cũ đã xóa trên DNS
