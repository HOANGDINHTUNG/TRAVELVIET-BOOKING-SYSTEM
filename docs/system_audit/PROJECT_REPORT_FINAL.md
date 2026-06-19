# BÁO CÁO TỔNG HỢP DỰ ÁN — TRAVELVIET BOOKING SYSTEM

> **Môn học:** Phát triển Ứng dụng Web / Kỹ thuật Phần mềm Nâng cao  
> **Nhóm:** 5 thành viên  
> **Loại hình dự án:** Hệ thống đặt vé và quản lý dịch vụ du lịch trực tuyến tích hợp đa nền tảng (B2C/B2B)  
> **Ngày hoàn thành:** Tháng 6, 2026

---

## PHẦN I: TỔNG HỢP CẤU TRÚC HỆ THỐNG

### A. BACKEND — Java Spring Boot 4.0.5 (Java 21 LTS)

#### 1. Tầng Cấu Hình Hệ Thống (`/config`)

| Component                                   | Mô tả kỹ thuật                                                                                                                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SecurityConfig.java`                       | Cấu hình Spring Security Filter Chain nhiều tầng: Public Endpoints, Role-based Route Protection bằng `@PreAuthorize`, CORS Header Policy, Session Management Stateless |
| `JwtTokenProvider.java`                     | Sinh và xác minh JWT Signature bằng thuật toán HMAC-SHA256. Embed Authorities Claim vào Payload để tránh query phân quyền bổ sung                                      |
| `RateLimitFilter.java`                      | Filter HTTP bậc cao nhất trước cả Spring Security. Token Bucket Algorithm (Bucket4J) kết hợp trạng thái phân tán trên Redis để chống DDoS, Scraper bots                |
| `RedisConfig.java`                          | Cấu hình Connection Pool LettuceClient kết nối Redis Standalone/Cluster                                                                                                |
| `CacheConfig.java`                          | Cấu hình Caffeine In-memory Cache (L1) với TTL/Max-Size cho các Public API                                                                                             |
| `MinioConfig.java`                          | Khởi tạo MinIO S3 Compatible Client, thiết lập Bucket Policy và Presigned URL                                                                                          |
| `FlywayConfig` (ẩn trong `application.yml`) | Cấu hình đường dẫn Migration, Baseline on Migrate, Fail-Fast on Validation Error                                                                                       |
| `OpenApiConfig.java`                        | Cấu hình tài liệu Swagger với JWT Bearer Authentication scheme                                                                                                         |

#### 2. Tầng Tiện ích Dùng Chung (`/common`)

| Component                        | Mô tả kỹ thuật                                                                                                                                                                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GlobalExceptionHandler.java`    | `@RestControllerAdvice` AOP Proxy. Tập trung xử lý tất cả Exceptions theo chuỗi: `MethodArgumentNotValidException` → 400, `ResourceNotFoundException` → 404, `BusinessException` → 422, `Exception` → 500. Chuẩn hóa ErrorResponse JSON duy nhất |
| `AuditableEntity.java`           | Abstract JPA Entity inject tự động `created_at`, `updated_at`, `deleted_at` vào toàn bộ bảng (Soft Delete pattern)                                                                                                                               |
| `ApiResponse<T>`                 | Generic Wrapper chuẩn hóa toàn bộ response payload: `{success, message, data, timestamp}`                                                                                                                                                        |
| `PageResponse<T>`                | Generic Pagination Wrapper: `{content[], page, size, totalElements, totalPages, last}`                                                                                                                                                           |
| `CorrelationIdFilter.java`       | Inject `X-Correlation-Id` request header và MDC Logging context để trace log end-to-end                                                                                                                                                          |
| `BaseMapper.java`                | Abstract MapStruct Interface khai báo contract `toEntity`, `toResponse`, `update`                                                                                                                                                                |
| `SlugUtils.java`                 | Thuật toán sinh Slug URL-friendly (xử lý ký tự Unicode → ASCII)                                                                                                                                                                                  |
| `DataNormalizer.java`            | Chuẩn hóa Input data (trimming, casing) trước khi đưa xuống Repository                                                                                                                                                                           |
| `BusinessRuleValidator.java`     | Validator Business Rule phức tạp vượt ngoài phạm vi Annotation Bean Validation                                                                                                                                                                   |
| `AuthenticatedUserProvider.java` | Utility class trích xuất Principal từ Spring SecurityContextHolder                                                                                                                                                                               |

#### 3. Tầng Domain — Module Auth & Users

| Component                               | Mô tả kỹ thuật                                                                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `AuthController.java`                   | POST `/auth/register`, `/auth/login`, `/auth/refresh`. Nhận Credentials, Validate bằng `@Valid` DTO, delegate sang Service       |
| `AuthService.java`                      | Xác thực bằng `PasswordEncoder` BCrypt 12 rounds, generate Access Token (15 phút) + Refresh Token (7 ngày), xử lý Token Rotation |
| `UserProfileController.java`            | Quản lý Profile, Address, Device Token (FCM Push), User Preferences JSON                                                         |
| `AdminUserController.java`              | CRUD Users, Deactivate Account theo quy trình Soft Delete                                                                        |
| `AdminRbacController.java`              | Phân quyền Role-Based (RBAC), cập nhật Permission Matrix theo Role Scope (SYSTEM/BACKOFFICE/CUSTOMER)                            |
| `UserRecommendationController.java`     | POST `/users/me/recommendations/tours` — Trigger AI-assisted recommendation dựa trên user preference                             |
| `UserWishlist/Checkin/Mission/Passport` | Hệ thống Gamification: Điểm thưởng, Mission objectives, Loyalty Badge                                                            |
| `UserRoles Entity (N:N)`                | Bảng liên kết quan hệ N:N `users ↔ roles`, hỗ trợ `is_primary`, `expired_at`, `assigned_by`                                      |

#### 4. Tầng Domain — Module Destinations (Điểm đến)

| Component                                    | Mô tả kỹ thuật                                                                         |
| -------------------------------------------- | -------------------------------------------------------------------------------------- |
| `DestinationController.java`                 | GET với Filter nâng cao, Hierarchical Tree Fetch, Propose mới                          |
| `AdminDestinationController.java`            | CRUD kèm MinIO Media Upload, Workflow Approve/Reject Proposal                          |
| `AdminDestinationTranslationController.java` | Upsert Translation theo Locale (vi/en) — Internationalization API                      |
| `DestinationFollowController.java`           | Follow/Unfollow Destination, Update Notification Settings                              |
| `WeatherController / AdminWeatherController` | Forecast, Crowd Prediction, Weather Alerts per Destination UUID                        |
| `Destinations Entity`                        | Self-referencing FK (`parent_id`) tạo cây đệ quy phân cấp: Quốc gia → Tỉnh → Thành phố |

#### 5. Tầng Domain — Module Flights (Máy Bay)

| Component                    | Mô tả kỹ thuật                                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FlightController.java`      | `GET /flights` hỗ trợ Dynamic Predicate (QueryDSL `BooleanBuilder`) filter theo `originCode`, `destinationCode`, `departureDate`, `cabinClass`                                     |
| `FlightService.java`         | Thuật toán Batch Enrichment: Gom N FlightId → 1 DB Query (`findByFlightIdIn`) → Hash Map `Map<Long, List<FlightClass>>` → Map tại RAM — Giải quyết triệt để N+1 Query anti-pattern |
| `FlightClassRepository.java` | `findByFlightId()` + `findByFlightIdIn()` + Optimistic Lock Update query: `SET seatAvailable = seatAvailable - :seats WHERE seatAvailable >= :seats`                               |
| `AdminFlightController.java` | Admin POST/PUT Flight Data                                                                                                                                                         |
| `FlightFareRule Entity`      | One-To-One map với FlightClass, chứa JSON Rules hoàn trả, đổi vé                                                                                                                   |
| `FlightMapper.java`          | MapStruct compile-time mapping: `Flight → FlightResponse`                                                                                                                          |

#### 6. Tầng Domain — Module Hotels, Tours, Bookings & Payments

| Component                             | Mô tả kỹ thuật                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `HotelController.java`                | GET `/hotels`, GET `/hotels/{id}/detail` với Eager-load Room Inventory                                                         |
| `AdminTourController.java`            | Full CRUD Tour + Tour Schedules. Hỗ trợ MultiPart File Upload MinIO ảnh tour                                                   |
| `AdminTourTranslationController.java` | Quản lý nội dung đa ngôn ngữ (vi/en) cho Tour Descriptions                                                                     |
| `BookingController.java`              | POST `/bookings/quote` (tính giá preview), POST `/bookings` (tạo đơn), PATCH Cancel/CheckIn/Complete                           |
| `ExtendedBookingController.java`      | Facade pattern: tạo booking tổng hợp Hotel + Flight + Combo chung 1 request                                                    |
| `BookingStatusHistory Entity`         | Event Sourcing pattern — log mọi trạng thái `pending → paid → completed` kèm Actor + Timestamp                                 |
| `PaymentController.java`              | POST `/payments`, kiểm tra Invoice status                                                                                      |
| `VnpayController.java`                | POST `/payments/vnpay/checkout` sinh Redirect URL, GET `/payments/vnpay` nhận IPN Callback với HMAC-SHA512 Checksum validation |
| `RefundController.java`               | POST `/refunds`, PATCH approve — Workflow hoàn tiền có phê duyệt                                                               |

#### 7. Tầng Domain — Module Nâng Cao (Community / AI / Support)

| Component                               | Mô tả kỹ thuật                                                             |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `AiChatController.java`                 | POST `/ai/chat` — Proxy tới AI Language Model backend                      |
| `AdminScheduleChatController.java`      | Chat Room quản lý trong lịch trình Tour Group (CRUD Messages, Mute member) |
| `UserSupportController.java`            | Tạo Support Session, gửi Message, Rate Support Agent                       |
| `ReviewController.java`                 | Tạo Review, Reply, Moderator Approval Workflow                             |
| `AdminPromotionCampaignController.java` | Full CRUD Campaign khuyến mãi với Target Member Level                      |
| `AdminVoucherController.java`           | CRUD Voucher, Claim Voucher, Apply Discount Logic                          |
| `AdminNotificationController.java`      | Tạo Notification Campaign đẩy FCM/Email                                    |

#### 8. Database Engineering (Flyway V1 → V8)

| Version        | Nội dung                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `V1` — 5 files | CREATE TABLE ~53+ bảng: users, roles, permissions, destinations, tours, hotels, flights, bookings, payments, promotions, loyalty, support, weather, notifications |
| `V2`           | Tạo toàn bộ Composite Indexes (Tối ưu query `WHERE` và `ORDER BY`)                                                                                                |
| `V3`           | Database Views tổng hợp (Booking Summary View, Revenue View)                                                                                                      |
| `V4`           | Stored Procedures (Tính toán điểm thưởng loyalty, xử lý batch voucher)                                                                                            |
| `V5`           | MySQL Functions tính giá vé với quy tắc giảm giá theo hạng thành viên                                                                                             |
| `V6`           | Triggers tự động cập nhật `total_spent` của User sau mỗi Order thành công                                                                                         |
| `V7`           | Seed Data ~10 files: Users, Permissions, Destinations, Tours, Flights, Hotels, Bookings mẫu                                                                       |
| `V8`           | Seed I18n: Dữ liệu dịch thuật i18n tiếng Anh                                                                                                                      |

---

### B. FRONTEND WEB — React 19 + Vite 8 (TypeScript 5.9)

#### 1. Tầng Cốt Lõi & Hệ Thống

| Component              | Mô tả kỹ thuật                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiClient.ts`         | Axios Instance tập trung: inject `Authorization: Bearer` token vào mọi request, `response.interceptor` chặn 401 → force logout, Request Retry Logic |
| `AppProviders.tsx`     | Root Provider Tree: `QueryClientProvider` → `ReduxProvider` → `RouterProvider` → `ThemeProvider`                                                    |
| `queryClient.ts`       | Cấu hình TanStack Query: `staleTime: 5 phút`, `gcTime: 10 phút`, `retry: 2`                                                                         |
| `bootstrapApi.ts`      | Pre-flight API config khởi động: xác định Base URL theo ENV                                                                                         |
| `~25 API client files` | Mỗi domain có file riêng: `Auth.api.ts`, `Flight.api.ts`, `Tour.api.ts`, `Hotel.api.ts`,... Bao gồm toàn bộ Typed Request/Response Interfaces       |

#### 2. Module Giao Diện & Tương Tác

| Module             | Component Nổi bật                                                    | Kỹ thuật                                                                                         |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **auth/**          | `LoginForm`, `RegisterForm`                                          | Framer Motion layout crossover, Zod Schema Validation, React Hook Form uncontrolled              |
| **flights/**       | `FlightHotDealsSection`, `FlightCarouselSection`, `FlightDatePicker` | Lazy tab-based fetching + in-memory carousel cache, Radix Dialog DatePicker, Lenis smooth scroll |
| **tours/**         | `TourDetailPage`, `TourCatalogPage`, `TourHorizontalCard`            | GSAP ScrollTrigger Parallax, Accordion Itinerary, Glassmorphism Cards                            |
| **destinations/**  | `DestinationComplexDetailPage`                                       | Real-time Image Preview Form, useWatch Integration                                               |
| **admin/**         | `DashboardPage`, `TourColumns`, `UserTable`                          | TanStack Table sortable paginated, Recharts Revenue Charts, XLSX Export                          |
| **components/ui/** | `Button`, `Dialog`, `Tabs`, `Tooltip`, `Switch`                      | Headless Radix UI primitives + Tailwind CVA variants                                             |

#### 3. Hệ Thống Hiệu Ứng & Animation

| Thư viện              | Ứng dụng thực tế                                                                        |
| --------------------- | --------------------------------------------------------------------------------------- |
| **Lenis v1.3**        | Physics-based smooth scrolling toàn trang. Nhúng qua `LenisProvider` bọc Root DOM       |
| **GSAP v3.15**        | ScrollTrigger Parallax trên Hero Section, Timeline stagger cho Tour Card entries        |
| **Framer Motion v12** | Auth page crossover layout transition, Page route transitions, Hover card scale effects |
| **tw-animate-css**    | Keyframe utilities cho skeleton loaders, fade-in animations                             |

#### 4. State Management Architecture (3-tầng)

| Tầng             | Công nghệ                      | Phạm vi                                                         |
| ---------------- | ------------------------------ | --------------------------------------------------------------- |
| Server State     | TanStack React Query           | Cache API responses, background refetch, stale-while-revalidate |
| Global App State | Redux Toolkit + Zustand        | Auth session, giỏ hàng, UI toggles                              |
| Local Form State | React Hook Form (Uncontrolled) | Form inputs không gây component re-render                       |

---

## PHẦN II: CÂY DANH MỤC TASK TỈ MỈ

### ✅ Task Đã Hoàn Thành (Done)

#### BACKEND — Hạ Tầng & Kiến Trúc

- [x] Thiết lập dự án Spring Boot 4.0.5 với Java 21 Virtual Threads
- [x] Thiết kế và triển khai kiến trúc Domain-Driven Design (DDD) Module-per-Feature
- [x] Xây dựng Abstract `AuditableEntity` với Soft Delete (`deleted_at`) áp dụng toàn bộ 53 bảng
- [x] Cấu hình Flyway Migration Engine phân phiên bản V1→V8 (DDL, Index, View, Procedure, Trigger, Seed)
- [x] Thiết kế 53+ Database Tables với đầy đủ Constraints, Composite Indexes, Foreign Key Cascade
- [x] Triển khai hệ thống Stored Procedures (MySQL) xử lý Loyalty Point Calculation
- [x] Viết MySQL Triggers tự động cập nhật `total_spent` sau Transaction thành công
- [x] Thiết lập Connection Pool HikariCP tối ưu với `maximumPoolSize`, `connectionTimeout`
- [x] Cấu hình Caffeine L1 In-memory Cache với TTL cho Public APIs (giảm ~80% DB hit)

#### BACKEND — Bảo mật & Authentication

- [x] Xây dựng JWT Authentication Flow hoàn chỉnh: Login → Access Token (15 phút) + Refresh Token (7 ngày) → Token Rotation upon Refresh
- [x] Triển khai BCrypt Password Hashing (12 salt rounds) không thể dịch ngược
- [x] Cài đặt Role-Based Access Control (RBAC) 3-cấp độ: SYSTEM / BACKOFFICE / CUSTOMER
- [x] Xây dựng `GlobalExceptionHandler` `@RestControllerAdvice` tập trung xử lý 6 loại Exception thành chuẩn ErrorResponse JSON
- [x] Triển khai Rate Limiting phân tán với Bucket4J Token Bucket Algorithm lưu trạng thái trên Redis (chống DDoS, Crawler bots)
- [x] Tích hợp Resilience4J Circuit Breaker pattern bảo vệ External Service calls
- [x] Cấu hình `CorrelationIdFilter` inject `X-Correlation-Id` MDC Logging để trace request end-to-end
- [x] Cấu hình VNPAY IPN Webhook Signature Verification bằng HMAC-SHA512

#### BACKEND — Core Business Logic

- [x] Xây dựng Dynamic Multi-criteria Flight Search Engine sử dụng QueryDSL `BooleanBuilder` (lọc theo origin, destination, date, cabin class)
- [x] Giải quyết N+1 JPA Query anti-pattern bằng Batch Enrichment: `findByFlightIdIn()` + In-Memory `Map<Long, List<FlightClass>>` grouping
- [x] Triển khai Optimistic Locking tại tầng SQL chống Race Condition tranh vé: `UPDATE ... SET seat_available = seat_available - :n WHERE seat_available >= :n`
- [x] Xây dựng Booking Lifecycle Engine: Quote → Create → `Payment Pending` → `Paid` (VNPAY IPN) → Check-In → Complete / Cancel
- [x] Triển khai Event Sourcing Pattern `booking_status_history` lưu vết mọi State Transition (Actor, Timestamp, Old/New Status)
- [x] Xây dựng Facade Pattern `ExtendedBookingController` để Orchestrate multi-service Booking (Hotel + Flight + Combo) trong 1 Transaction
- [x] Tích hợp MinIO S3 Object Storage: Presigned URL upload, Bucket Policy, Media URL generation
- [x] Xây dựng module AI Chat Proxy endpoint tích hợp Language Model
- [x] Xây dựng Schedule Chat Room system: Rooms, Messages, Member Mute Control

#### FRONTEND — Core Infrastructure

- [x] Cấu hình Axios Instance tập trung với JWT Interceptor, Auto-retry và Redirect-on-401
- [x] Xây dựng 3-tầng State Architecture: TanStack Query (Server) + Redux Toolkit (Global) + React Hook Form (Form)
- [x] Cài đặt Lenis Physics Smooth Scrolling với `LenisProvider` context và `requestAnimationFrame` tick loop
- [x] Cấu hình i18next Multi-language (Tiếng Việt / Tiếng Anh) với lazy HTTP backend loading
- [x] Thiết lập Vite Route Code-splitting và Dynamic Import chunking
- [x] Xây dựng hệ thống UI Atoms (Button, Dialog, Tab, Tooltip) bằng Radix UI Headless + TailwindCSS CVA variants

#### FRONTEND — Feature Modules

- [x] Triển khai Auth UI Module: Animated Layout Crossover (Framer Motion `layoutId`), Zod Schema Validation, React Hook Form uncontrolled binding
- [x] Xây dựng `FlightCarouselSection`: Tab-based Lazy Fetching on-demand, In-memory State Cache `Record<filter, FlightResponse[]>` ngăn redundant API calls
- [x] Triển khai GSAP ScrollTrigger Parallax trên Hero và Tour Detail sections với `revert()` cleanup để tránh Memory Leak
- [x] Xây dựng Admin Dashboard với TanStack Table (Sorting, Pagination, Column Visibility), Recharts Revenue Charts, XLSX Export
- [x] Triển khai Glassmorphism / Liquid Glass Card design system với CSS `backdrop-filter: blur()` layers
- [x] Xây dựng Destination Complex Detail Page với Real-time Image Preview và MediaUpload workflow

---

### 🔭 Task Định Hướng Nâng Cao (Backlog / Future Scope)

| #   | Task                                      | Mô tả kỹ thuật                                                                                                                                                                              |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Microservices Migration**               | Tách Monolith thành các Service độc lập: `flight-service`, `booking-service`, `notification-service`. Giao tiếp qua Apache Kafka Event Bus. Áp dụng API Gateway (Kong/Spring Cloud Gateway) |
| 2   | **CI/CD Pipeline Automation**             | Thiết lập GitHub Actions: tự động Unit Test → Build Maven → Docker Image → Push Registry → Deploy Kubernetes Rolling Update                                                                 |
| 3   | **Redis Distributed Session & Cache**     | Chuyển toàn bộ Session State lên Redis Cluster, áp dụng Cache-Aside Pattern cho Top Tours và Flight Search Results                                                                          |
| 4   | **Full-text Search với Elasticsearch**    | Index Tour và Destination data lên Elasticsearch, xây dựng Fuzzy Search và Faceted Filtering thay thế MySQL LIKE query                                                                      |
| 5   | **Real-time Notifications với WebSocket** | Upgrade từ Polling sang STOMP over WebSocket (Spring WebSocket), push thông báo vé sắp hết / giá giảm                                                                                       |
| 6   | **OAuth2 Social Login**                   | Tích hợp OAuth2 Authorization Code Flow: Google, Facebook Login thông qua Spring Security OAuth2 Client                                                                                     |
| 7   | **Mobile App (React Native)**             | Xây dựng Mobile Client chia sẻ API Layer và Business Logic với Web, tận dụng `react-query` và `zustand` cross-platform                                                                      |
| 8   | **S3 Orphaned Media Cleanup Job**         | CronJob định kỳ đối chiếu URL trong MySQL với MinIO Bucket, xóa file rác không có Entity liên kết                                                                                           |
| 9   | **Advanced Analytics Dashboard**          | Tích hợp Apache Superset hoặc Power BI Embedded để phân tích Booking Revenue Trend, User Funnel Conversion                                                                                  |
| 10  | **Kubernetes Horizontal Pod Autoscaler**  | Cấu hình HPA dựa trên CPU/Memory metrics, đảm bảo hệ thống tự co giãn trong mùa cao điểm du lịch                                                                                            |

---

## PHẦN III: BẢNG PHÂN CHIA CÔNG VIỆC CHIẾN THUẬT

| Thành viên                                      | Vai trò                                         | Tỷ lệ đóng góp | Chi tiết nhiệm vụ đảm nhận |
| ----------------------------------------------- | ----------------------------------------------- | -------------- | -------------------------- |
| **Member 1** — **TEAM LEADER / CORE DEVELOPER** | System Architect + Lead Backend + Lead Frontend | **~70%**       | _(Xem chi tiết bên dưới)_  |
| **Member 2** — Frontend UI Developer            | Web UI Builder                                  | ~10%           | _(Xem chi tiết bên dưới)_  |
| **Member 3** — Frontend & Integration Support   | Component Dev + API Integration                 | ~8%            | _(Xem chi tiết bên dưới)_  |
| **Member 4** — QA & Documentation Lead          | Testing + Technical Docs                        | ~7%            | _(Xem chi tiết bên dưới)_  |
| **Member 5** — Business Analyst & Reporting     | Requirements + Presentation                     | ~5%            | _(Xem chi tiết bên dưới)_  |

---

### 👑 MEMBER 1 — TEAM LEADER (Core Developer) | ~70% Khối lượng toàn dự án

**I. Kiến Trúc Hệ Thống & Cơ Sở Hạ Tầng (System Architecture & Infrastructure)**

- Thiết kế và triển khai toàn bộ Domain-Driven Design Module Architecture cho Backend Spring Boot 4.x, phân chia rõ ràng theo Bounded Context cho 14 Domain Module độc lập
- Lập trình và phiên bản hóa toàn bộ 8 phiên bản Flyway Migration (V1→V8): bao gồm 53+ DDL CREATE TABLE, Composite Index, Database View, Stored Procedure, Trigger và batch Seed Data
- Cấu hình JWT Stateless Authentication Pipeline: thiết lập `JwtTokenProvider` sinh ký HMAC-SHA256, `OncePerRequestFilter` xác thực và inject `SecurityContext`
- Xây dựng bộ lọc Rate Limiting phân tán nhiều lớp với Bucket4J + Redis: Token Bucket Algorithm với cấu hình `refillRate`, `capacity`; bypass whitelist Admin IPs
- Cấu hình và tích hợp Resilience4J Circuit Breaker: `slidingWindowSize`, `failureRateThreshold`, `waitDurationInOpenState` cho các external API calls
- Triển khai MinIO S3 Object Storage Integration: Bucket Creation, Policy Setup, Presigned Upload URL Generation, Media URL serving
- Cấu hình Caffeine L1 Cache Layer và Redis L2 Distributed Cache Pipeline; thiết lập `CacheEvict` và `CachePut` tại Service Layer để đảm bảo Cache Coherence
- Thiết lập `CorrelationIdFilter` theo chuẩn OpenTelemetry Trace ID nhúng vào MDC Logging để phục vụ Distributed Tracing

**II. Core Business Logic Backend (198 REST Endpoints / ~14 Modules)**

- Lập trình hoàn chỉnh `GlobalExceptionHandler` AOP Proxy tập trung bắt 8+ loại Exception, chuẩn hóa ErrorCode và HTTP Status Mapping
- Xây dựng Dynamic Predicate Search Engine cho Flight Module sử dụng QueryDSL `QEntity` Type-safe API, hỗ trợ filter đa chiều (`origin`, `destination`, `date`, `cabin`, `price range`)
- Thiết kế và giải quyết N+1 JPA Query anti-pattern: triển khai `findByFlightIdIn(List<Long>)` Batch Query kết hợp `Collectors.groupingBy()` In-Memory Hash Map enrichment, giảm DB Round-trips từ O(N) xuống O(1)
- Thiết kế Concurrency-safe Seat Reservation: triển khai SQL Conditional Update với `WHERE seat_available >= :n` đảm bảo ACID Atomicity tại Row Level, phát hiện Conflict và ném `BusinessException` để Spring `@Transactional` Rollback
- Lập trình Booking Lifecycle State Machine: 7 trạng thái (`draft → pending → confirmed → paid → checked_in → completed / cancelled`) với `BookingStatusHistory` Event Sourcing Pattern
- Xây dựng VNPAY Payment Integration: sinh `createPaymentUrl` với HMAC-SHA512 Request Hash, xử lý IPN Callback Server-to-Server Webhook với Signature Verification
- Triển khai Facade Pattern `ExtendedBookingController`: Orchestrate cross-domain Booking Creation (Hotel + Flight + Combo) trong Single Database Transaction boundary (`@Transactional`)
- Xây dựng AI Chat Proxy Module: nhận Prompt từ Client, forward tới AI backend, stream Response về
- Thiết kế RBAC Permission Matrix: 3 Role Scope cấp, động cấp `role_permissions` tại Runtime, kiểm tra `@PreAuthorize("hasAuthority('PERMISSION_CODE')")`
- Lập trình hoàn chỉnh các CRUD Admin Modules: Tours (+ MultiPart Image Upload), Destinations (+ Translation i18n API), Hotels, Flights, Users, Vouchers, Promotions, Badges, Missions, Notifications
- Xây dựng Destination Hierarchy System với Self-Referencing FK và Recursive CTE Query để flatten tree phân cấp Country → Province → City → District

**III. Frontend Architecture & Complex Modules**

- Thiết kế 3-Tầng State Management Architecture: phân tách Server State (TanStack Query), Global State (Redux Toolkit), và Local Uncontrolled State (React Hook Form) theo nguyên lý Single Responsibility
- Xây dựng Axios Instance tập trung (`apiClient.ts`): JWT Interceptor tự động inject Bearer Token, Response Interceptor bắt 401 → logout flow, configurable Retry Policy
- Lập trình toàn bộ Flights Hot Deals Module với On-Demand Lazy Tab Loading: tạo `FlightCarouselSection` độc lập (tự quản State + Cache + Fetch), implement `Record<string, FlightResponse[]>` In-memory cache ngăn redundant API calls khi switch tabs
- Xây dựng Auth UI với Framer Motion `layoutId` Layout Crossover Animation: hoán đổi vị trí Form và Visual Panel mượt mà khi toggle Login/Register
- Triển khai GSAP `ScrollTrigger` Parallax cho Hero Section và Tour Detail Page với proper `revert()` cleanup trong `useEffect` return để triệt tiêu Memory Leak
- Thiết lập `LenisProvider` Physics Smooth Scroll: tích hợp `raf` tick loop với React Context, expose `lenis` instance để components con programmatically scroll
- Xây dựng Admin Dashboard Module: TanStack Table với multi-sort, column visibility toggle, pagination; Recharts Line/Bar charts cho Revenue Analytics; XLSX export utility

---

### 👷 MEMBER 2 — Frontend UI Developer | ~10%

- Chuyển đổi Figma Wireframes thành cấu trúc JSX Component cho các trang: `HomePage`, `TourCatalogPage`, `FlightSearchPage`, `HotelListPage`
- Xây dựng hệ thống Shared UI Atoms tái sử dụng (`Button`, `Badge`, `Card`, `Spinner`) trên nền Radix UI Primitives kết hợp Tailwind CSS Class Variance Authority (CVA)
- Triển khai Responsive Layout cho các breakpoints Mobile (375px) / Tablet (768px) / Desktop (1440px) theo chuẩn Tailwind Grid/Flexbox
- Tích hợp React Icons và Lucide React vào toàn bộ Component Tree, đảm bảo thống nhất icon style 1.5px stroke
- Xây dựng Dark Mode toggler kết nối `ThemeProvider` Context và CSS Custom Property (`--color-*` tokens)
- Lập trình khung giao diện `FlightDealCard` và `TourCard` với hiệu ứng hover scale transform và glassmorphism `backdrop-blur`

---

### 🔧 MEMBER 3 — Frontend Integration & Component Support | ~8%

- Tích hợp API Client Calls vào các trang Tour và Destination: binding `useQuery` hook của TanStack Query với response typing từ `Tour.api.ts`, `Destination.api.ts`
- Xây dựng Client-side Form Validation Schema bằng Zod cho Booking Wizard: kiểm tra định dạng CCCD, số điện thoại, ngày tháng phù hợp locale Việt Nam
- Triển khai `react-hook-form` Controller binding cho các field phức tạp (DatePicker, Select Dropdown)
- Xây dựng Component `FlightSearchBar`: bind state TripType, OriginCity, DestinationCity, DepartureDate với Zustand store; dispatch thay đổi để sync với URL Query Params
- Triển khai Breadcrumb Navigation Component tự sinh từ Router location state
- Hỗ trợ xử lý Loading Skeleton và Error Boundary wrapping cho các section đang fetch Data

---

### 📋 MEMBER 4 — QA & Technical Documentation | ~7%

- Soạn thảo tài liệu Software Requirements Specification (SRS) theo chuẩn IEEE 830: Functional Requirements, Non-Functional Requirements, Use Case Descriptions
- Vẽ sơ đồ Entity Relationship Diagram (ERD) toàn bộ 53 bảng bằng công cụ dbdiagram.io / Lucidchart
- Viết Unit Test cho các Service Methods core: `FlightService`, `AuthService`, `BookingService` bằng JUnit 5 + Mockito (Mock Repository Layer)
- Viết Integration Test cho các REST Endpoints bằng `@SpringBootTest` + `MockMvc`: kiểm tra HTTP Status, Response body JSON structure
- Chuẩn bị và kiểm tra bộ Seed Data SQL hợp lệ (V7 Flyway) đảm bảo Referential Integrity không vi phạm FK Constraint
- Biên soạn tài liệu API Reference Markdown mô tả từng Endpoint, Request/Response Body mẫu

---

### 📊 MEMBER 5 — Business Analyst & Presentation | ~5%

- Phân tích yêu cầu nghiệp vụ, xây dựng Use Case Diagram và Activity Diagram cho các luồng chính: Đặt vé, Thanh toán, Quản lý Tour
- Lập bảng ma trận Stakeholders và mức độ ưu tiên tính năng (MoSCoW: Must/Should/Could/Won't)
- Biên soạn và thiết kế Slide Báo Cáo Đồ Án (PowerPoint/Canva): Giới thiệu dự án, Demo Screenshot, Architecture Diagram, Kết quả đạt được
- Tổng hợp Sprint Timeline và ước lượng Story Points cho từng Task theo phương pháp Agile Scrum
- Chuẩn bị bộ câu hỏi thường gặp (FAQ) và kịch bản Demo live cho buổi bảo vệ với Giảng viên

---

## PHẦN IV: TỔNG KẾT KỸ THUẬT

| Tiêu chí                       | Số liệu thực tế                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| Tổng số REST API Endpoints     | **198 Endpoints** (được extract tự động bằng Python Regex Scanner)                            |
| Tổng số Database Tables        | **53+ bảng** (Flyway V1 DDL)                                                                  |
| Tổng số Flyway Migration Files | **25 files** (V1→V8)                                                                          |
| Ngôn ngữ lập trình             | Java 21, TypeScript 5.9, SQL (MySQL 8), Python (Tooling)                                      |
| Frameworks chính               | Spring Boot 4.0.5, React 19, Vite 8, TailwindCSS 4                                            |
| Thư viện Animation             | GSAP 3.15, Framer Motion 12, Lenis 1.3                                                        |
| Cơ chế bảo mật                 | JWT HS256, BCrypt-12, Bucket4J Rate Limit, Resilience4J Circuit Breaker, VNPAY HMAC-SHA512    |
| Pattern áp dụng                | DDD, RBAC, Soft Delete, Event Sourcing, Facade, Repository, Optimistic Locking, N+1 Batch Fix |
| Storage                        | MySQL 8 (RDBMS) + Redis (Cache/Rate-limit) + MinIO S3 (Object Storage)                        |
