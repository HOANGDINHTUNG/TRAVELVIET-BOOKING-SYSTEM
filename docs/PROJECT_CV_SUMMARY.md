# TravelViet Booking System — Tổng hợp dự án cho CV

> Tài liệu tổng hợp từ: `WEBSERVICE.md`, `FRONTEND_ARCHITECTURE.md`, `backend/BACKEND_OVERVIEW.md`, `backend/README.md`, `backend/API_DOCUMENTATION.md`, `backend/AI_CHAT_SETUP.md`, các phase notes (`PUBLIC_BOOKING_PHASE7`, `PAYMENT_BOOKINGS_PHASE8`, `BACKOFFICE_TOURS_PHASE5/6`), `MOVIZONE_UI_UX_GUIDE.md`, `frontend/web/docs/BACKOFFICE_NEXT_PHASE.md` và hiện trạng code trong repo.

**Repository:** [TRAVELVIET-BOOKING-SYSTEM](https://github.com/HOANGDINHTUNG/TRAVELVIET-BOOKING-SYSTEM)

---

## 1. Mô tả dự án (1–2 câu cho CV)

**TravelViet Booking System** là nền tảng đặt tour du lịch và quản trị nội dung (destination, lịch khởi hành, booking, thanh toán, loyalty) theo mô hình **full-stack**: REST API **Spring Boot** + web **React/Vite** + mobile **Expo** (đang ở giai đoạn scaffold). Hệ thống hỗ trợ **đa ngôn ngữ (vi/en)**, **RBAC theo permission**, tích hợp **VNPay**, **MinIO** lưu media, **AI chat (Gemini)** và nhiều module vận hành (support, weather, engagement, passport loyalty).

---

## 2. Vai trò gợi ý (tự điền)

| Mục | Gợi ý điền |
|-----|------------|
| Vị trí | Full-stack Developer / Frontend Developer / Backend Developer |
| Thời gian | `MM/YYYY – MM/YYYY` |
| Quy mô team | `N người` |
| Trách nhiệm chính | Phát triển API / Web customer + backoffice / Tích hợp thanh toán / UI-UX |

---

## 3. Công nghệ sử dụng

### 3.1 Backend

| Hạng mục | Công nghệ |
|----------|-----------|
| Ngôn ngữ & runtime | **Java 21** |
| Framework | **Spring Boot 4.0.x** (Web MVC, Security, Validation, Data JPA) |
| Cơ sở dữ liệu | **MySQL** (dev), **H2** (test) |
| Migration | **Flyway** |
| Truy vấn động | **QueryDSL** |
| Mapping DTO | **MapStruct** + **Lombok** |
| Bảo mật | **JWT** (stateless), **Spring Security**, **@PreAuthorize** theo permission, **Bucket4j** rate limit |
| Cache | **Spring Cache** + **Caffeine** |
| Object storage | **MinIO** (upload ảnh/video destination admin) |
| API contract | `ApiResponse<T>`, `PageResponse<T>`, i18n qua `Accept-Language` / `MessageSource` |
| Tích hợp | **Google Gemini** (AI chat), **WeatherAPI**, **VNPay** (checkout + IPN) |
| Observability | **Spring Actuator** |
| Build | **Maven** (`mvnw`) |

### 3.2 Frontend Web

| Hạng mục | Công nghệ |
|----------|-----------|
| Core | **React 19**, **TypeScript 5.9**, **Vite 8** |
| Routing | **React Router v7** (data router, lazy routes, route guards) |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`) |
| State | **Redux Toolkit** (home, preferences), **Zustand** (auth/UI nhỏ), **TanStack Query v5** (server state) |
| Form & validation | **react-hook-form**, **Zod**, `@hookform/resolvers` |
| HTTP | **Axios** (interceptors JWT refresh, `Accept-Language`) |
| i18n | **i18next**, **react-i18next**, **i18next-http-backend** (`public/locales/vi|en/`) |
| UI | **Radix UI**, **lucide-react**, **react-icons**, **class-variance-authority**, **sonner** (toast) |
| Bảng / biểu đồ | **TanStack Table**, **Recharts** |
| Animation | **GSAP**, **Motion**, **Lenis** (smooth scroll) |
| Export | **xlsx** (backoffice) |
| Lint | **ESLint 9** |

### 3.3 Mobile (giai đoạn đầu)

| Hạng mục | Công nghệ |
|----------|-----------|
| Framework | **Expo SDK 54**, **Expo Router 6** |
| UI | **React Native 0.81**, **React Native Paper** |
| Ngôn ngữ | **TypeScript** |

### 3.4 DevOps & công cụ

- Git, MySQL Workbench, biến môi trường (`.env` / `application-dev.yaml`)
- Tài liệu API: `API_DOCUMENTATION.md`
- Kiến trúc: `FRONTEND_ARCHITECTURE.md`, `BACKEND_OVERVIEW.md`

---

## 4. Kiến trúc tổng quan

```
┌─────────────────┐     HTTPS/REST      ┌──────────────────────────────┐
│  React Web      │ ◄──────────────────► │  Spring Boot Monolith API     │
│  (Vite, RR v7)  │   JWT + ApiResponse  │  module/* (domain-driven)     │
└────────┬────────┘                      │  JPA + Flyway + QueryDSL      │
         │                               └───────────┬──────────────────┘
┌────────▼────────┐                               │
│  Expo Mobile    │                               ▼
│  (scaffold)     │                      MySQL · MinIO · Gemini · VNPay
└─────────────────┘
```

**Backend:** Controller → Facade (mỏng) → Service (command/query) → Repository → Entity; exception tập trung `GlobalExceptionHandler`; schema DB do Flyway quản lý (`ddl-auto: none`).

**Frontend:** Feature-based `src/module/{auth,home,tours,bookings,management,...}`; API client unwrap `ApiResponse<T>`; guards `RequireAuthenticated`, `RequireManagerAccess`.

---

## 5. Các module / chức năng đã triển khai

### 5.1 Backend (domain modules)

| Module | Nội dung chính |
|--------|----------------|
| **auth** | Đăng ký, đăng nhập, refresh token JWT |
| **users** | Hồ sơ, RBAC admin, audit log, preferences |
| **destinations** | CRUD admin, proposal approve/reject, multipart upload MinIO, bản dịch, follow |
| **tours** | Tour lifecycle, schedule, itinerary, guide translation, combo |
| **bookings** | Quote giá, tạo booking, trạng thái, admin booking |
| **payments** | Thanh toán, **VNPay** checkout/IPN, refund |
| **promotions** | Voucher, campaign (admin + user claim) |
| **reviews** | Review tour, testimonial |
| **loyalty** | Passport, badge, mission, check-in |
| **engagement** | Wishlist, tour view, gợi ý cá nhân hóa |
| **notifications** | User + admin gửi thông báo |
| **support** | Phiên hỗ trợ user/admin |
| **schedulechat** | Chat theo lịch tour |
| **weather** | Forecast, alert, route estimate (WeatherAPI) |
| **commerce** | Product, combo package |
| **dashboard** | Thống kê admin |
| **ai** | Chat AI (Gemini) trên dữ liệu tour/destination/booking thật |
| **orders** | Domain order (liên quan commerce) |
| **system** | Health, metadata hệ thống |

### 5.2 Frontend Web — Khu vực khách hàng (public)

| Khu vực | Đã làm |
|---------|--------|
| **Trang chủ** | Hero cinematic (GSAP/Lenis), section đề xuất, deal phút chót, replica layout tham khảo THD |
| **Destinations** | Danh sách, chi tiết public (media, TOC, stats, map), branch/program slug |
| **Tours catalog** | Tìm kiếm, sidebar filter, sticky search bar, tour card + quick view |
| **Tour detail** | URL SEO `/tour/{slug}-{id}`, sticky purchase card, gallery, schedule selection |
| **Booking** | Panel đặt chỗ, quote 2 lớp (client preview + `POST /bookings/quote`), voucher qua re-quote |
| **Thanh toán** | VNPay redirect, **PaymentReturn** polling booking status (chờ IPN BE) |
| **Đơn của tôi** | My bookings, booking detail, confirmation |
| **Tài khoản** | Account page, preferences (ngôn ngữ, tiền tệ hiển thị) |
| **Loyalty** | Passport (hộ chiếu du lịch) |
| **Support** | Support center |
| **Schedule chat** | Chat theo schedule đã đặt |
| **Services** | Service hub (trung tâm dịch vụ) |
| **Auth** | Login/Register UX mới (`AuthExperience`), validation Zod, password strength, social buttons UI |
| **AI** | `AiChatBox` + FAB stack site-wide, thông báo chat |
| **i18n** | vi/en JSON (`auth`, `common`, …), header locale panel |
| **Tiền tệ** | `useDisplayMoney`, quy đổi/hiển thị theo preference (VND-centric) |

### 5.3 Frontend Web — Backoffice (`/management`)

| Khu vực | Đã làm |
|---------|--------|
| **Hub & RBAC** | Management hub theo role (`SUPER_ADMIN`, `ADMIN`, `CONTENT_EDITOR`, `FIELD_STAFF`, `OPERATOR`) |
| **Dashboard** | Overview, role-specific dashboards |
| **Destinations** | Quản lý, form, search |
| **Tours** | CRUD tour, form (destination autocomplete, tags CSV fallback, media, itinerary) |
| **Schedules** | Quản lý lịch, chat control panel |
| **Bookings** | Danh sách (fallback khi chưa có `GET /admin/bookings`) |
| **Promotions / Support / System / Audit** | Trang module + API probe |
| **Export** | Excel qua `xlsx` |

### 5.4 Mobile

- Expo Router, màn hình mẫu Home/Checkout; hướng dẫn tích hợp API trong `INTEGRATION_GUIDE.md`.

---

## 6. Điểm nổi bật kỹ thuật (đáng ghi CV)

1. **Full-stack booking platform** với vòng đời tour → schedule → quote → booking → VNPay → xác nhận IPN.
2. **RBAC chi tiết** (permission seed Flyway), guard FE theo role/manager access.
3. **Contract API thống nhất** `ApiResponse<T>` + pagination + i18n header (`Accept-Language`).
4. **JWT refresh single-flight** trên Axios, tránh race khi nhiều request 401.
5. **SEO-friendly routing** tour: pattern `/tour/{slug}-{id}` khi BE chưa có `by-slug` endpoint.
6. **Pricing UX**: preview client-side + authoritative quote debounced; voucher validate qua re-quote (một nguồn sự thật).
7. **VNPay integration**: FE không verify checksum; polling `GET /bookings/{id}` sau redirect (bảo mật + idempotent).
8. **Multipart admin upload** destination → MinIO → URL media.
9. **Cache layer** Caffeine cho tour/destination search (key deterministic theo filter + locale).
10. **AI assistant** Gemini chỉ trên dữ liệu thật từ service layer; no-data response không gọi model.
11. **UI/UX Movizone-style**: glassmorphism header, cinematic hero, momentum scroll (Lenis + GSAP).
12. **Quốc tế hóa & localization** end-to-end (BE messages + FE JSON locales + currency display).

---

## 7. Công việc gần đây (theo thay đổi đang phát triển)

- Refactor **Header**: mega menu, locale panel (icon + panel), utility actions, nav config tách file.
- **Auth experience** mới: floating inputs, tab indicator, social auth UI, design tokens CSS.
- **SiteFabStack**: gom FAB (AI chat, hỗ trợ) thay component rời.
- **CustomerPageHero** tái sử dụng cho trang khách hàng (bookings, support, passport, …).
- **Currency display**: slice preferences + `currencyDisplay` + hook `useDisplayMoney`.
- **Tours catalog**: sticky search, xóa FAB catalog riêng, layout/card CSS.
- **Error pages** 403/404 styled; **ServiceHubPage** mới.
- Chuẩn hóa i18n auth (`public/locales/*/auth.json`).

---

## 8. Gợi ý bullet cho CV (copy-paste)

### Tiếng Việt

- Phát triển **hệ thống đặt tour du lịch full-stack** (Spring Boot 4 + React 19/Vite) với hơn **15 domain module**: auth, tour, booking, payment VNPay, loyalty, AI chat, support.
- Thiết kế và triển khai **REST API** chuẩn `ApiResponse`, phân quyền **RBAC/JWT**, migration **Flyway**, truy vấn **QueryDSL**, cache **Caffeine**, upload media **MinIO**.
- Xây dựng **giao diện khách hàng** (catalog tour, chi tiết SEO slug, booking + quote real-time, thanh toán VNPay, đa ngôn ngữ vi/en).
- Phát triển **backoffice quản trị** (`/management`) cho tour/destination/schedule/booking với **TanStack Query/Table**, form **react-hook-form + Zod**, export Excel.
- Tích hợp **AI chat Gemini** an toàn (chỉ dữ liệu backend thật), **WeatherAPI**, voucher/promotion, passport loyalty.
- Áp dụng **UI/UX hiện đại**: Tailwind v4, Radix UI, GSAP/Lenis, glassmorphism header, responsive & accessible components.

### English (cho CV quốc tế)

- Built a **full-stack travel tour booking platform** using **Spring Boot 4 (Java 21)** and **React 19 (Vite, TypeScript)** with 15+ domain modules (tours, bookings, VNPay payments, RBAC, AI chat, loyalty).
- Implemented **JWT-secured REST APIs** with unified `ApiResponse` contracts, **Flyway** migrations, **QueryDSL** filtering, **Caffeine** caching, and **MinIO** media storage.
- Delivered **customer-facing flows**: tour catalog & SEO URLs, real-time booking quotes, VNPay checkout with post-payment polling, i18n (vi/en), and currency preferences.
- Developed an **admin backoffice** with role-based access, TanStack Query/Table, Zod-validated forms, and operational modules (destinations, tours, schedules, bookings).
- Integrated **Google Gemini AI assistant**, engagement/recommendations, support sessions, and weather services.

---

## 9. Kỹ năng tổng hợp (Skills section CV)

**Languages:** Java, TypeScript, SQL  
**Backend:** Spring Boot, Spring Security, JPA/Hibernate, Flyway, MapStruct, QueryDSL, REST, JWT  
**Frontend:** React, React Router, Redux Toolkit, Zustand, TanStack Query, Tailwind CSS, Axios, i18next, Zod, react-hook-form  
**Database & Storage:** MySQL, MinIO  
**Integrations:** VNPay, Google Gemini API, WeatherAPI  
**Mobile:** React Native, Expo  
**Tools:** Git, Maven, Vite, ESLint  

---

## 10. Phase / tài liệu tham chiếu trong repo

| File | Nội dung |
|------|----------|
| `WEBSERVICE.md` | Hướng dẫn clone, MySQL, Flyway, chạy BE/FE |
| `FRONTEND_ARCHITECTURE.md` | Kiến trúc FE, stack, folder structure, roadmap |
| `backend/BACKEND_OVERVIEW.md` | Kiến trúc BE, audit, roadmap |
| `backend/API_DOCUMENTATION.md` | Contract toàn bộ API |
| `backend/AI_CHAT_SETUP.md` | Cấu hình AI chat |
| `frontend/web/PUBLIC_BOOKING_PHASE7_NOTES.md` | Catalog → booking, slug URL, voucher quote |
| `frontend/web/PAYMENT_BOOKINGS_PHASE8_NOTES.md` | VNPay, my bookings, admin booking gaps |
| `frontend/web/BACKOFFICE_TOURS_PHASE5_NOTES.md` | Admin tour form, BE gaps |
| `frontend/web/MOVIZONE_UI_UX_GUIDE.md` | Glass header, hero, smooth scroll |
| `frontend/web/docs/BACKOFFICE_NEXT_PHASE.md` | Roadmap backoffice |

---

## 11. Mẫu mô tả dự án ngắn (LinkedIn / CV)

> **TravelViet Booking System** — Nền tảng đặt tour và vận hành du lịch: API Spring Boot (JWT, RBAC, Flyway, VNPay, MinIO, Gemini AI) kết hợp web React 19 (catalog, booking, thanh toán, backoffice, i18n). Team phát triển theo kiến trúc module domain, tài liệu API đầy đủ, hướng mở rộng mobile Expo.

---

*Tài liệu tạo để phục vụ viết CV — cập nhật khi có thêm phase hoặc deploy production.*
