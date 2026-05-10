# Backend TravelViet — Tổng quan kiến trúc, hiện trạng & roadmap

**Mục đích:** một file **nguồn tham chiếu ngắn**, đồng bộ với code tại thời điểm rà soát. Các file `I18N_AND_API_ROUTING_PLAN.md`, `ASSISTANT_BACKEND_NOTES.md`, `I18N_CODEBASE_SNAPSHOT.md` đã **gộp / thay thế** bằng tài liệu này để tránh mâu thuẫn (ví dụ: locale mặc định, đường dẫn message bundle).

**Tài liệu vẫn dùng song song:** `README.md` (mô tả sâu, có thể dài), `API_DOCUMENTATION.md` (contract API), `AI_CHAT_SETUP.md` (cấu hình AI), migration SQL dưới `src/main/resources/db/migration/`.

**Phụ lục nhanh — Destination admin & upload:** CRUD dưới `/admin/destinations`, duyệt proposal `PATCH .../approve|reject`; tạo/sửa có thể gửi **multipart** (`destination` JSON + `imageFiles` / `videoFiles`) — upload qua **MinIO** rồi gắn URL vào `mediaList`. Chi tiết permission theo role nằm trong **seed Flyway** (`roles` / `permissions`).

---

## Bước 1 — Hiểu hệ thống (Understand)

### Kiến trúc tổng thể

- **Kiểu ứng dụng:** **Spring Boot** monolith **REST API**, **stateless JWT**, phân quyền **theo permission** (`@PreAuthorize` + authority từ RBAC seed).
- **Tổ chức theo module domain** dưới `com.wedservice.backend.module.*`; mỗi module thường có **controller → facade (mỏng) → service → repository**, **DTO** request/response, **entity** JPA, **mapper** MapStruct, đôi khi **validator** nghiệp vụ.
- **Xu hướng CQRS nhẹ:** một số nơi tách `service/command` vs `service/query` + `impl`; **mức đồng nhất giữa các module không 100%** (một số service “fat” hoặc không có facade).

### Luồng dữ liệu (data flow) điển hình

1. **HTTP** vào `DispatcherServlet` → **Controller** (validate `@Valid`, security).
2. **Facade** (nếu có) gọi **Command/Query service**.
3. **Service** dùng **Repository** (JPA / **QueryDSL** predicate), **Mapper**, exception domain (`BadRequestException`, `ResourceNotFoundException`, …).
4. Phản hồi thành công: **`ApiResponse<T>`** (+ đôi khi **`PageResponse<T>`**).
5. Lỗi: **`GlobalExceptionHandler`** → **`ErrorResponse`** (JSON), có **`MessageSource`** / **i18n** theo **`Accept-Language`** (mặc định **vi**).
6. **Schema DB:** **Flyway** migration; JPA **`ddl-auto: none`** (dev) — **migration là nguồn sự thật schema**.

### Cấu trúc thư mục (rút gọn)

```text
backend/
├── pom.xml
├── README.md                    # mô tả dài, lịch sử dự án
├── API_DOCUMENTATION.md         # contract endpoint
├── BACKEND_OVERVIEW.md          # file này — kiến trúc + audit + roadmap
├── src/main/java/com/wedservice/backend/
│   ├── BackendApplication.java  # @EnableCaching, @EnableJpaAuditing, @EnableAsync
│   ├── common/                  # exception, response, security, util, i18n (Translator, …)
│   ├── config/                  # Security, Locale, Flyway, …
│   └── module/                  # auth, users, destinations, tours, bookings, payments, …
├── src/main/resources/
│   ├── application.yaml
│   ├── application-dev.yaml
│   ├── i18n/messages_*.properties, business_*.properties (i18n API + nghiệp vụ)
│   └── db/migration/            # V1… Flyway
└── src/test/java/…
```

### Tech stack cốt lõi (theo `pom.xml`)

| Hạng mục | Công nghệ |
|----------|-----------|
| **Runtime** | **Java 21**, **Spring Boot 4.0.x** |
| **Web** | **Spring Web MVC** |
| **Persistence** | **Spring Data JPA**, **Hibernate**, **MySQL** (dev), **H2** (test) |
| **Migration** | **Flyway** (MySQL) |
| **Query động** | **QueryDSL** (Jakarta classifier) |
| **Mapping** | **MapStruct** + **Lombok** |
| **Security** | **Spring Security**, **JWT** (custom), **Bucket4j** (rate limit) |
| **Validation** | **Bean Validation** + **`LocalValidatorFactoryBean`** trỏ cùng **MessageSource** i18n |
| **Cache** | **`spring-boot-starter-cache`** + **Caffeine**; **`@EnableCaching`**; **`CacheConfig`** đăng ký **`CacheManager`** (TTL/size qua **`app.cache.caffeine.*`** trong `application.yaml`) |
| **Object storage** | **MinIO** client |
| **Observability** | **Actuator** |
| **AI / tích hợp** | **Gemini** (chat), **WeatherAPI** (cấu hình trong yaml) |

---

## Bước 2 — Đánh giá & nợ kỹ thuật (Audit)

### Điểm mạnh

- **Domain rộng** (tour lifecycle, booking, payment/refund, promotion, engagement, support, weather, loyalty…) gần **production shape**.
- **RBAC + permission** chi tiết; seed roles trong Flyway.
- **Flyway + ddl-auto none** — hướng triển khai đúng.
- **Test** nhiều tầng (controller, service, integration) cho các flow nhạy cảm.
- **i18n Phase 0:** `LocaleConfig`, **`i18n/messages`**, **`GlobalExceptionHandler`**, **`Translator`**, **`ApiResponse.success`**; nội dung DB: bảng **`destination_translations`**, **`guide_translations`** + API admin bản dịch (xem code `module/destinations`, `module/tours`).

### Chất lượng & đồng nhất

- **Pattern không đồng đều** giữa module (facade/command/query có chỗ có chỗ không).
- **Message lỗi / nghiệp vụ:** nhiều chỗ vẫn **chuỗi cứng tiếng Anh/Việt** trong `throw new …`; roadmap i18n cần **chuẩn hóa mã `api.*`** dần.
- **README rất dài:** dễ **lệch thời gian** so với code — dùng **file này + API_DOCUMENTATION + migration** khi cần “sự thật hiện tại”.

### Hiệu năng (bottleneck tiềm ẩn)

- ~~**`@Cacheable`** tour search dùng `#request`~~ **(đã xử lý)** — trước đây key theo object request dễ **không ổn định**; hiện dùng **`TourSearchCacheKeyGenerator`**.
- **N+1 / fetch graph:** các response lớn (tour detail, destination detail) cần **kiểm tra fetch join** hoặc **batch load** khi traffic tăng.
- **QueryDSL + filter phức tạp:** cần **index DB** khớp cột filter (đã có file index migration riêng trong repo).

### Bảo mật

- **JWT tự triển khai (HS256):** cần **review định kỳ** (expiry, refresh, clock skew, không log token).
- **Giá trị mặc định trong `application.yaml`:** API key / secret MinIO / Weather — **không nên commit secret thật**; dùng env / `.env` (đã có `optional:file:.env`).
- **Rate limit:** in-memory Bucket4j — **đa instance** cần **store tập trung** (Redis) sau này.
- **CORS:** hiện chủ yếu localhost — chuẩn bị **origin production** khi deploy.

### Tổ chức file / tài liệu

- Đã **xoá** các file trùng hoặc **sai so với code**: `I18N_AND_API_ROUTING_PLAN.md`, `ASSISTANT_BACKEND_NOTES.md`, `I18N_CODEBASE_SNAPSHOT.md`, `DESTINATION_ROLE_UPLOAD_TODO.md` (nội dung destination admin + upload MinIO đã **tóm tắt** ở README/API doc khi cần).

---

## Bước 3 — Roadmap hành động (Action plan)

### Giai đoạn 1 — Tối ưu & chắc nền (ưu tiên ngay)

1. **[x] Chuẩn hóa i18n service layer:** toàn bộ ném lỗi nghiệp vụ dùng **`BadRequestException.i18n("api.error.*", …)`**; bản dịch tập trung trong **`i18n/business_vi.properties`** và **`i18n/business_en.properties`** (basename thứ hai cạnh `i18n/messages` trong `LocaleConfig` / `GlobalExceptionHandler` standalone).
2. **[x] Cache keys (public `searchTours`):** đã thay `@Cacheable(key = "#request")` bằng bean **`tourSearchCacheKeyGenerator`** — chuỗi key **deterministic** từ toàn bộ tham số filter + phân trang + sort + **`Accept-Language`** (`loc=…`). *(Các `@Cacheable` khác, ví dụ destination, giữ nguyên đã có key locale.)*
3. **[x] Cấu hình cache rõ ràng:** Bean **`CacheManager`** (`SimpleCacheManager` + **`CaffeineCache`** từng tên) + **`AppCacheProperties`** đọc **`app.cache.caffeine.*`** trong **`application.yaml`** (TTL `expire-after-write-seconds`, `maximum-size`; clamp tối thiểu 1). Cache đăng ký: **`tours`**, **`destinations`**, **`destination-details`** — khớp mọi `@Cacheable` hiện có.
4. **[x] Secrets:** đã gỡ **API key / credential mặc định** khỏi `application.yaml` (JWT root rỗng + dev placeholder trong `application-dev.yaml`, MinIO/DB dùng placeholder an toàn hơn, WeatherAPI không còn key mẫu). **`backend/.env.example`** liệt kê biến môi trường; README §14.2a hướng dẫn nhanh.
5. **[x] Đồng bộ tài liệu API:** **`API_DOCUMENTATION.md`** — mục **0** (`Accept-Language`, `Content-Language`, lỗi `api.error.*`, bảng admin translations destination/guide); header mẫu §2.1 bổ sung `Accept-Language`.
6. **[x] Test Mockito / JDK:** README **§14.5.1** — ghi ngắn lỗi **MockMaker / Byte Buddy self-attach** và hướng xử lý (JDK args / Mockito inline).

### Giai đoạn 2 — Tính năng & mở rộng (sau khi nền ổn)

1. **[x] i18n nội dung DB (tour):** **`tour_translations`** + merge public **`/tours`** theo **`Accept-Language`** (fallback **`vi`** → cột `tours`). *Tag/campaign i18n:* chưa làm.
2. **Thanh toán thực tế:** cổng **VNPay / Stripe / PayPal** (webhook, idempotency, đối soát) — hiện domain payment/refund đã có skeleton nghiệp vụ.
3. **Dashboard admin / báo cáo:** thống kê booking, doanh thu, funnel (tận dụng Actuator + query tối ưu hoặc read model).
4. **Chuẩn hóa URL “của tôi”:** deprecate dần path legacy → **`/users/me/...`** (nếu product chốt), ghi version removal trong API doc.

---

*Bạn có muốn chốt kế hoạch tối ưu này không, hay cần điều chỉnh gì trước khi chúng ta bắt tay vào refactor code?*
