# Database: Aiven (cloud) + Local fallback

## Mục tiêu

- **Bước 1 (ưu tiên):** MySQL **Aiven / public trên mạng** (`defaultdb`, SSL).
- **Bước 2 (fallback):** MySQL **local** `127.0.0.1:3307` / database `wedservice` — chỉ khi cloud không kết nối được.
- Chọn DB **một lần lúc khởi động** backend (không đổi giữa chừng khi app đang chạy).

## Thông tin Aiven (từ console)

| Biến | Giá trị mẫu |
|------|-------------|
| Host | `mysql-lab-mtung3365-864a.f.aivencloud.com` |
| Port | `23132` |
| Database | `defaultdb` |
| User | `avnadmin` |
| Password | Lấy trong Aiven → **Reveal password** |
| SSL | **REQUIRED** (cần file CA) |

## Cài đặt nhanh

### 1. Tải chứng chỉ CA

1. Vào Aiven → service MySQL → **CA certificate** → **Download** / Show.
2. Lưu file thành:

   ```text
   backend/ca.pem
   ```

   (Thư mục `ssl/` đã có `.gitignore` — không commit file này.)

### 2. Cấu hình `.env` (chỉ mật khẩu cloud)

Host/port/user/local đã ghi trong **`application-dev.yaml`**.

`backend/.env` chỉ cần:

```properties
AIVEN_DB_PASSWORD=<password-từ-aiven-console>
```

Và file `backend/ca.pem`.

### 3. Chạy backend

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Log khi thành công (remote):

```text
Active database: REMOTE (Aiven cloud) — mysql-lab-...:23132/defaultdb
```

Log khi fallback:

```text
Remote database unavailable (...). Falling back to local MySQL.
Active database: LOCAL (fallback) — 127.0.0.1:3307/wedservice
```

### 4. Kiểm tra đang dùng DB nào

Xem log khi start:

```text
Active database: REMOTE (Aiven cloud) — ...
```

hoặc

```text
Active database: LOCAL (fallback) — ...
```

## Flyway & schema

- **Remote:** migration chạy trên `defaultdb` (Aiven).
- **Local:** migration chạy trên `wedservice`.
- Hai DB **độc lập** — dữ liệu không tự đồng bộ. Dev thường dùng một nguồn chính (cloud) hoặc chỉ local khi offline.

## Tắt cloud, chỉ dùng local

```properties
DB_FAILOVER_ENABLED=false
```

Hoặc:

```properties
DB_PREFER_REMOTE=false
```

Hoặc không set `AIVEN_DB_PASSWORD` (backend bỏ qua remote và chỉ dùng local).

## API public (Render) ↔ localhost

Xem **`API_FAILOVER.md`** — probe API Render lúc start; `GET /system/health` trả `connectivity.api.recommendedBaseUrl`.

## Chỉ dùng cloud (không fallback)

Không khuyến nghị cho dev máy cá nhân; nếu cần: tắt MySQL local và đảm bảo Aiven luôn reachable — nếu probe remote fail, app vẫn fallback local trừ khi bạn sửa code/`prefer-remote`.

Để **chỉ remote**, có thể đặt `AIVEN_DB_ENABLED=true` và local MySQL tắt — khi remote fail app sẽ **không start** nếu local cũng không kết nối được.

## Xử lý lỗi thường gặp

| Lỗi | Cách xử lý |
|-----|------------|
| SSL / certificate | Đảm bảo `backend/ca.pem` tồn tại; hoặc kiểm tra `AIVEN_CA_CERT_PATH` / `AIVEN_CA_CERT_PEM` |
| Access denied | Kiểm tra user/password trên Aiven |
| Connection timed out | Firewall / IP allowlist trên Aiven; thử VPN |
| Local fallback fail | Chạy MySQL local port 3307 + script `ensure-mysql-dev-user.ps1` |

## File liên quan

- `application-dev.yaml` — `app.datasource.failover.*`
- `DataSourceFailoverConfig.java` — logic chọn DB
- `.env.example` — biến môi trường mẫu
