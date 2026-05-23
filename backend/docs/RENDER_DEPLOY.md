# Deploy Backend lên Render

## Phân tích 3 lỗi thường gặp (đã xử lý trong repo)

| # | Vấn đề | Đúng? | Cách repo xử lý |
|---|--------|-------|-----------------|
| 1 | Health check sai vì `context-path: /api/v1` | **Đúng** | Render: **`/api/v1/actuator/health`** (xem `render.yaml`) |
| 2 | Thiếu file CA trong Docker | **Đúng** | `Dockerfile` copy `ca.pem` → `/app/ca.pem`; env `AIVEN_CA_CERT_PATH=ca.pem` |
| 3 | Trùng block YAML / JWT bị đè | **Đã tách** | `application.yaml` (chung) + `application-dev.yaml` (local) + `application-prod.yaml` (Render) |

## Quan trọng: Aiven phải cho phép Render kết nối vào

Log kiểu `Remote database unavailable` / `Cannot connect to Aiven from Render` gần như luôn do **Aiven chặn IP**.

Trên **Aiven Console** → service **MySQL** của bạn:

1. Mục **Networking** / **Public access** → bật truy cập **Internet** / **Public**.
2. Nếu có **IP allowlist**: thêm `0.0.0.0/0` (cho dev/test) hoặc [dải IP outbound của Render](https://render.com/docs/static-outbound-ip-addresses) (gói trả phí).
3. Lưu và đợi 1–2 phút rồi **Redeploy** trên Render.

Không bật public access → Render **không bao giờ** nối được dù password đúng.

---

## Trước khi deploy

1. Chứng chỉ Aiven (chọn **một** cách):
   - **Cách A:** `backend/ca.pem` trước khi build Docker (file có thể commit — CA là public).
   - **Cách B (khuyến nghị Render):** Env `AIVEN_CA_CERT_PEM` = nội dung file `.pem` (dán nguyên block `-----BEGIN CERTIFICATE-----` …).
2. Trên Aiven: bật **public access** hoặc allowlist IP Render nếu cần.
3. Chuẩn bị secret (không commit): `AIVEN_DB_PASSWORD`, `JWT_SECRET`, `GEMINI_API_KEY`, …

## Cách 1 — Blueprint (`render.yaml` ở root repo)

1. Push code lên GitHub.
2. Render Dashboard → **New** → **Blueprint** → chọn repo.
3. Điền thủ công env chưa có trong file:
   - `AIVEN_DB_PASSWORD` = password Aiven
   - `GEMINI_API_KEY`, `WEATHERAPI_KEY` (nếu dùng)
4. Deploy.

## Cách 2 — Web Service thủ công

| Mục | Giá trị |
|-----|---------|
| Root Directory | `backend` |
| Runtime | Docker |
| Health Check Path | **`/api/v1/actuator/health`** |
| `SPRING_PROFILES_ACTIVE` | `prod` |

### Environment variables (bắt buộc)

| Key | Mô tả |
|-----|--------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET` | Chuỗi ≥ 32 ký tự (random) |
| `AIVEN_DB_PASSWORD` | Password MySQL Aiven |
| `AIVEN_CA_CERT_PATH` | `ca.pem` (mặc định trong container) |
| `AIVEN_CA_CERT_PEM` | Toàn bộ nội dung file CA (nếu không copy file) |

### Tùy chọn

`GEMINI_API_KEY`, `WEATHERAPI_KEY`, `MINIO_URL`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_RETURN_URL`, `VNPAY_IPN_URL`

## Sau khi deploy

- API: `https://<tên-service>.onrender.com/api/v1`
- Health: `https://<tên-service>.onrender.com/api/v1/actuator/health`
- Frontend (Vercel/Render): đặt `VITE_API_BASE_URL=https://<tên-service>.onrender.com/api/v1`

## Local vs Render

| | Local (`dev`) | Render (`prod`) |
|---|---------------|-----------------|
| Profile | `dev` (mặc định) | `prod` |
| DB | Aiven → fallback `127.0.0.1:3307` | **Chỉ Aiven** (`local.enabled: false`) |
| Port | `8088` | `$PORT` do Render cấp |
| CA file | `backend/ca.pem` | `ca.pem` trong container (`/app/ca.pem`) |

## Lỗi deploy

| Triệu chứng | Nguyên nhân |
|-------------|-------------|
| Deploy failed / health 404 | Health path sai → dùng `/api/v1/actuator/health` |
| `Aiven connection failed` / Communications link failure | **Bật public access** trên Aiven; kiểm tra password trên Render |
| Crash khi start | Thiếu `ca.pem` hoặc sai `AIVEN_DB_PASSWORD` |
| JWT error | Thiếu `JWT_SECRET` trên Render |
| DB connection timeout | Aiven chặn IP → bật public hoặc allowlist |
