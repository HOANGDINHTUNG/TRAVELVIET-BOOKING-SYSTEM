# Bật Public Access cho Aiven MySQL (bắt buộc cho Render)

Log trên Render:

```text
Communications link failure
The driver has not received any packets from the server.
```

→ **Render không mở được cổng TCP tới Aiven** (gần như luôn do chưa bật public access).

## Các bước trên Aiven Console

1. Đăng nhập [Aiven Console](https://console.aiven.io/).
2. Chọn **Project** → service **MySQL** (`mysql-lab-...`).
3. Vào tab **Networking** (hoặc **Settings** → **Network**).
4. Bật **Public access** / **Internet access** / **Allow connections from the internet**.
5. **IP allowlist** (nếu có):
   - Lab / test: thêm `0.0.0.0/0` (cho phép mọi IP, gồm Render).
   - Production: dùng [Static Outbound IP của Render](https://render.com/docs/static-outbound-ip-addresses) (gói trả phí) và chỉ allowlist các IP đó.
6. **Lưu** và đợi **1–2 phút** để cấu hình có hiệu lực.

## Lấy đúng host / port / password

1. Trên service MySQL → **Overview** hoặc **Connection information**.
2. Chọn kiểu kết nối **Public** (không dùng hostname private/VPC).
3. Copy:
   - **Host** → `AIVEN_DB_HOST` trên Render (nếu khác file yaml)
   - **Port** → `AIVEN_DB_PORT`
   - **Database** → thường `defaultdb`
   - **User** → thường `avnadmin`
   - **Password** → `AIVEN_DB_PASSWORD` (Users → reset nếu quên)

## Render Environment (tối thiểu)

| Biến | Ví dụ |
|------|--------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET` | chuỗi random ≥ 32 ký tự |
| `AIVEN_DB_PASSWORD` | password từ Aiven |
| `AIVEN_CA_CERT_PATH` | `classpath:ssl/ca.pem` (mặc định) |

Tùy chọn khi host/port đổi:

| Biến | Mô tả |
|------|--------|
| `AIVEN_DB_HOST` | Host public từ Aiven |
| `AIVEN_DB_PORT` | Port public (vd. `23132`) |

## Kiểm tra sau khi bật public access

Redeploy Render → log phải có:

```text
TCP pre-check: TCP host:port reachable
Remote MySQL connected (sslMode=REQUIRED)
Active database: REMOTE (Aiven cloud)
```

Nếu **TCP pre-check: unreachable** → public access chưa bật hoặc allowlist chặn Render.

Nếu **TCP OK** nhưng vẫn lỗi SQL → kiểm tra `AIVEN_DB_PASSWORD` và host/port.

## Local vẫn kết nối được nhưng Render không?

- Máy bạn có thể đã allow IP nhà / VPN.
- Render dùng IP outbound khác → cần `0.0.0.0/0` hoặc IP tĩnh Render trên allowlist.
