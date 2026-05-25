# API public (Render) + fallback localhost

## Mục tiêu

Khi **backend public trên internet** (Render) không phản hồi (sleep, deploy lỗi, mạng), dev/frontend biết ngay nên gọi **API local**:

`http://localhost:8088/api/v1`

Backend probe URL public **một lần lúc khởi động** (profile `dev`, `app.api.failover.enabled=true`).

## Cấu hình nhanh (`backend/.env`)

```properties
API_FAILOVER_ENABLED=true
API_PREFER_PUBLIC=true
APP_API_PUBLIC_BASE_URL=https://travelviet-booking-system.onrender.com/api/v1
APP_API_LOCAL_BASE_URL=http://localhost:8088/api/v1
```

Chỉ dùng local (không probe Render):

```properties
API_PREFER_PUBLIC=false
```

## Kiểm tra sau khi start backend

```http
GET http://localhost:8088/api/v1/system/health
```

Ví dụ khi Render down:

```json
{
  "connectivity": {
    "api": {
      "target": "LOCAL",
      "recommendedBaseUrl": "http://localhost:8088/api/v1",
      "publicBaseUrl": "https://travelviet-booking-system.onrender.com/api/v1",
      "localBaseUrl": "http://localhost:8088/api/v1",
      "publicReachable": false
    },
    "database": { ... }
  }
}
```

Frontend web (`frontend/web`) tự probe lúc `npm run dev` và fallback — xem `frontend/web/.env.example` (`VITE_API_FAILOVER_*`).

## Log khi khởi động

```text
Public API unreachable (...). Clients should use local: http://localhost:8088/api/v1
Active API endpoint: LOCAL — http://localhost:8088/api/v1
```

## Liên quan DB

| Thành phần | Failover | Tài liệu |
|------------|----------|----------|
| MySQL Aiven ↔ local | `app.datasource.failover` | `DATABASE_FAILOVER.md` |
| API Render ↔ localhost | `app.api.failover` | file này |

Hai cơ chế **độc lập**: có thể DB local + vẫn probe API public, hoặc ngược lại.

## Prod (Render)

`app.api.failover.enabled=false` mặc định trên prod — container không cần fallback localhost.
