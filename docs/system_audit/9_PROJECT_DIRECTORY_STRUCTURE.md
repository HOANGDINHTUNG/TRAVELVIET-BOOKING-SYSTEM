# 9. BẢN ĐỒ CÂY THƯ MỤC CỐT LÕI (Directory Core Mapping)

Tài liệu này hệ thống lại đường viền địa lý của Toàn Bộ Thư Mục hệ thống với góc nhìn sâu và chi tiết nhất của một Senior.

## 1. MỔ XẺ APP NODE.JS (FRONTEND VITE)

Đường dẫn gốc: `/frontend/web`

```text
frontend/web/
├── package.json               # Kho chứa mọi Dependency thư viện UI
├── vite.config.ts             # Bản cấu trúc Compile Chunk React
├── tsconfig.json              # Strict Type configurations
└── src/
    ├── app/                   # Chứa `AppProvider.tsx` trùm kín App với Redux Provider/Zustand Store + `router/` DOM config.
    ├── api/                   # Kho chứa Fetchers.
    │   ├── server/            # [QUAN TRỌNG] Các file Axios bám trực tiếp API Spring như `Flight.api.ts`, `Auth.api.ts`
    │   └── apiClient.ts       # Nơi cài Interceptor tiêm JWT Bearer vào mỗi lệnh gửi đi.
    ├── components/            # Lõi Shared Khung Components Vĩ Mô (Footer, Navigation bar).
    │   └── ui/                # UI Cấp Nguyên Tử (Atoms): Button.tsx, Input.tsx, Dialog.tsx -> Tích hợp đè Tailwind Base.
    ├── stores/                # Các File chứa Cục State khổng lồ quản trị giỏ hàng / Checkbox Filter State.
    ├── utils/                 # File Helpers độc lập xử lý hàm FormatDate, FormatCurrency.
    └── module/                # [HẠT NHÂN NGHIỆP VỤ DOMAIN REACT]
        ├── auth/              # Form Login Layout
        ├── flights/           # Cụm Search vé bay khổng lồ.
        ├── tours/             # Cụm Xem Review Tour, Hành trình trượt Parallax.
        ├── admin/             # SPA nội bộ của Dashboard Backoffice ẩn kín. (Tách riêng Layout CSS Trắng Vuông Vức).
        └── locales/           # Thư mục chèn text song ngữ i18n Anh-Việt theo từng Domain.
```

## 2. MỔ XẺ JAVA SPRING BOOT (BACKEND SERVER)

Đường dẫn gốc: `/backend`

```text
backend/
├── pom.xml                    # Kéo Maven Dependencies, Generate Java MapStruct, QueryDSL.
├── get_apis.py                # Script trích xuất tự động File Document API.
└── src/main/java/com/wedservice/backend/
    ├── config/                # Chứa Setup Cơ Chế: `SecurityConfig.java`, Cors, OpenAPI, MinIO configs.
    ├── common/                # Shared logic Code.
    │   ├── controller/        # Chứa Error Mapping & `SystemController.java`.
    │   ├── exception/         # [HẠT NHÂN] File `@ControllerAdvice` quét gom lỗi 500 thành 400 Đẹp dạng JSON ErrorResponse.
    │   └── security/          # Chứa hệ quản trị Bucket4J chống DDoS, Rate Limit Configuration.
    └── module/                # [DOMAIN DRIVEN DESIGN] => RẤT LỚN
        ├── auth/              # Thư mục xử lý logic Đăng nhập (AuthService.java, AuthController.java).
        ├── tours/             # Logic nhồi Tour, xếp TourSchedules, Trả File XML excel giá Tour.
        ├── flights/           # Cấu trúc Bảng Chuyến Bay O(1) Fetching. Facade tổng ghép 3 CSDL khác bảng.
        ├── booking/           # Hệ thống tạo hóa đơn, Log Check-out Payment Session.
        ├── users/             # Bảng Users Identity, Preferences, Follow Destinations...
        └── destinations/      # Logic đệ quy tìm Tỉnh/Thành/Phố, Chấp thuận File Media/Ảnh Up S3.

└── resources/
    ├── application.yml        # Cấu hình Host Database, Cấu hình Port, Token Expiration Time.
    └── db/migration/          # [CORE SCHEMA VERSIONING] Cây Flyway SQL Script V1, V2 -> V8 định hình Database Schema thay cho việc CREATE TABLE tay.
```

**_Ghi chú đánh giá (Remarks):_**
Giao diện và Code BE của dự án TravelViet tuân thủ tuyệt đối **Domain-Driven Design (DDD)**. Bất kì tính năng mới khi cài đặt (ví dụ: Tích hợp Thê AI Chat) sẽ tạo folder `ai_chat`, cấu trúc ruột bao gồm `controller/`, `service/`, `entity/`, không làm ô nhiễm các Folder khác -> Đạt Level Scaling (Mở rộng) cực dễ của ngành IT Enterprise.
