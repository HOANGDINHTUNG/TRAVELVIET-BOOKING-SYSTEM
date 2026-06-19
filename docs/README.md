# 📚 TravelViet Booking System — Tổng Quan Tài Liệu

> Root: `travelviet-booking-system/`  
> Mọi tài liệu được tổ chức theo vai trò rõ ràng, tránh trùng lặp.

---

## 🗺️ Sơ Đồ Thư Mục Tài Liệu

```
docs/
├── README.md                          ← Tệp này — bản đồ điều hướng tổng quan
│
├── HUONG_DAN_CHAY_DU_AN.md           ← ⭐ Hướng dẫn chạy dự án A→Z (Windows)
├── RENDER_DEPLOY.md                   ← Deploy lên Render.com
├── RENDER_ENV_CHECKLIST.md            ← Checklist biến môi trường
├── API_FAILOVER.md                    ← Cơ chế failover API public/local
├── DATABASE_FAILOVER.md               ← Cơ chế failover DB Aiven ↔ Local MySQL
├── PERFORMANCE_NOTES.md               ← Ghi chú tối ưu hiệu năng (N+1,Cache)
├── USER_BUSINESS_ROADMAP.md           ← Kế hoạch tính năng nghiệp vụ người dùng
├── PROJECT_CV_SUMMARY.md              ← Tóm tắt tech stack (dành cho CV/báo cáo)
├── HOTEL_FLIGHT_COMBO_PHASE1_SCHEMA.md ← Schema giai đoạn 1 module Hotel+Flight
│
├── backend/
│   ├── API_DOCUMENTATION.md           ← ⭐ Tài liệu API đầy đủ 198 endpoints (CHÍNH)
│   ├── BACKEND_OVERVIEW.md            ← Kiến trúc tổng quan backend
│   ├── AI_CHAT_SETUP.md               ← Cấu hình tích hợp AI Chat (Gemini)
│   └── README.md                      ← Index module backend
│
├── web/
│   └── README.md                      ← Hướng dẫn FE Web + env setup
│
├── mobile/
│   ├── README.md                      ← Hướng dẫn FE Mobile (Expo)
│   ├── INTEGRATION_GUIDE.md           ← Tích hợp API cho mobile
│   └── HUONG_DAN_TEST_SAN_PHAM.md    ← Hướng dẫn test mobile
│
└── system_audit/                      ← ⭐ Phân tích kiến trúc chuyên sâu
    ├── PROJECT_REPORT_FINAL.md        ← ⭐ Báo cáo đồ án tổng hợp (CHÍNH)
    ├── 1_SYSTEM_ARCHITECTURE_OVERVIEW.md  ← Kiến trúc DDD + SPA tổng quan
    ├── 2_FRONTEND_TECH_STACK_UI_UX.md     ← Thư viện FE, Animation, State
    ├── 3_BACKEND_TECH_STACK_CORE.md       ← Spring Boot, QueryDSL, Resilience4J...
    ├── 4_DATABASE_SCHEMA_MODELS.md        ← Mô hình CSDL, Soft Delete, Lock
    ├── 5_BACKEND_API_ENDPOINTS_MAPPING.md ← 198 endpoints tổng hợp
    ├── 6_STATE_MANAGEMENT_DATA_FLOW.md    ← Luồng dữ liệu 3-cấp (FE)
    ├── 7_BUSINESS_LOGIC_SECURITY.md       ← JWT, Rate Limit, Race Condition
    ├── 8_UI_UX_ANIMATION_DETAILS.md       ← GSAP, Lenis, Framer Motion chi tiết
    ├── 9_PROJECT_DIRECTORY_STRUCTURE.md   ← Cây thư mục đầy đủ có kèm giải thích
    └── 10_GAP_ANALYSIS_FUTURE_ROADMAP.md  ← Lỗ hổng hiện tại + Lộ trình nâng cấp
```

---

## 📖 Hướng Dẫn Đọc Theo Mục Đích

| Mục đích                          | Đọc file nào trước                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 🚀 **Chạy dự án lần đầu**         | [`HUONG_DAN_CHAY_DU_AN.md`](./HUONG_DAN_CHAY_DU_AN.md)                                               |
| 🔌 **Test API bằng Postman/curl** | [`backend/API_DOCUMENTATION.md`](./backend/API_DOCUMENTATION.md)                                     |
| 🏗️ **Hiểu kiến trúc tổng thể**    | [`system_audit/1_SYSTEM_ARCHITECTURE_OVERVIEW.md`](./system_audit/1_SYSTEM_ARCHITECTURE_OVERVIEW.md) |
| 🗄️ **Hiểu cấu trúc Database**     | [`system_audit/4_DATABASE_SCHEMA_MODELS.md`](./system_audit/4_DATABASE_SCHEMA_MODELS.md)             |
| 🎨 **Hiểu Frontend/Animation**    | [`system_audit/2_FRONTEND_TECH_STACK_UI_UX.md`](./system_audit/2_FRONTEND_TECH_STACK_UI_UX.md)       |
| 🔐 **Bảo mật & Business Logic**   | [`system_audit/7_BUSINESS_LOGIC_SECURITY.md`](./system_audit/7_BUSINESS_LOGIC_SECURITY.md)           |
| 📊 **Báo cáo đồ án cho GV**       | [`system_audit/PROJECT_REPORT_FINAL.md`](./system_audit/PROJECT_REPORT_FINAL.md)                     |
| 🌐 **Deploy lên Render**          | [`RENDER_DEPLOY.md`](./RENDER_DEPLOY.md) + [`RENDER_ENV_CHECKLIST.md`](./RENDER_ENV_CHECKLIST.md)    |
| 🤖 **Tích hợp AI Chat**           | [`backend/AI_CHAT_SETUP.md`](./backend/AI_CHAT_SETUP.md)                                             |
| 📉 **Xem lỗ hổng & roadmap**      | [`system_audit/10_GAP_ANALYSIS_FUTURE_ROADMAP.md`](./system_audit/10_GAP_ANALYSIS_FUTURE_ROADMAP.md) |

---

## ⭐ 3 File Quan Trọng Nhất

### 1. `backend/API_DOCUMENTATION.md`

Tài liệu API hoàn chỉnh: **18 phần, 3700+ dòng**.  
Bao gồm: Auth, Users, Destinations, Tours, **Flights _(mới)_**, **Hotels _(mới)_**, Bookings, Payments, Reviews, Notifications, AI Chat, Vouchers...  
Có sẵn: curl examples, Postman Environment JSON, Request/Response mẫu thực tế.

### 2. `system_audit/PROJECT_REPORT_FINAL.md`

Báo cáo đồ án đầy đủ: Kiến trúc, Task breakdown, Phân chia nhóm, Backlog.  
Phù hợp dùng trực tiếp khi báo cáo với Giảng viên.

### 3. `HUONG_DAN_CHAY_DU_AN.md`

Hướng dẫn chạy dự án từ A đến Z trên Windows (PowerShell).  
Bao gồm: Setup MySQL, Aiven cloud, Backend .env, Frontend .env, Mobile.

---

## 🔢 Số Liệu Nhanh

| Mục                           | Con số     |
| ----------------------------- | ---------- |
| Tổng REST API Endpoints       | **198**    |
| Database Tables               | **53+**    |
| Flyway Migration Files        | **25**     |
| Lines trong API_DOCUMENTATION | **~3,728** |
| Thư viện FE                   | **30+**    |
| Domain Modules Backend        | **14**     |

---

_Cập nhật lần cuối: 2026-06-19. Trạng thái: Backend 100% ✅ | Frontend Web ~85% 🔄 | Mobile ~20% 🔄_
