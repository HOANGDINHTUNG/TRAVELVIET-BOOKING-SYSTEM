# 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG (System Architecture Overview)

Tài liệu này là Bản Đặc Tả Kỹ Thuật (Technical Specification) cốt lõi của siêu dự án `travelviet-booking-system`.

## 1. MÔ HÌNH GHÉP NỐI (ARCHITECTURE PATTERN)

Dự án được xây dựng theo kiến trúc **Decoupled Micro-Frontend & Monolithic Backend**, nơi Client và Server tách biệt hoàn toàn 100%, giao tiếp duy nhất qua chuẩn RESTful HTTP/JSON.

### 1.1 Backend: Domain-Driven Design (DDD) x Layered Architecture

Ứng dụng Java Spring Boot áp dụng tổ chức thư mục theo chuẩn **Module/Domain-Driven Layout**. Nghĩa là thay vì nhóm theo kỹ thuật (tất cả controller vào 1 folder), mã nguồn được gói vào theo Nghiệp Vụ (Domains): `auth`, `bookings`, `destinations`, `flights`, `tours`, `hotels`, v.v.
Trong mỗi Domain, kiến trúc phân tầng (Layered) 3-tier tiếp tục được duy trì:

1.  **API Layer (Controllers):** Đứng ngoài cùng bọc các Endpoints. Nhận Request, xác thực bằng Session JWT Filter, validate Input DTO.
2.  **Service Layer & Facade:** Lớp nằm giữa xử lý logic. Dự án áp dụng Pattern Facade cho những trường hợp tổng hợp (ví dụ: `ExtendedBookingController`) để tránh dependencies chằng chịt giữa `FlightService`, `HotelService`.
3.  **Data Layer (Repository/JPA):** Dưới cùng sử dụng `JpaRepository` phối hợp `QueryDSL` (Generate Annotation Q-Classes cho Dynamic Queries).

### 1.2 Frontend: Feature-Sliced SPA (Single Page Application)

Frontend React 19 chạy trên nền Vite 8.

- **Client Route SPA:** Router chuyển trang không reload page.
- **Micro-State / Server-State Separation:** Việc tách biệt rõ ràng dữ liệu Cục bộ (UI State) bằng `Zustand` và dữ liệu Server (Async State) bằng `TanStack React Query` giúp triệt tiêu hoàn toàn mớ bòng bong của Redux Saga/Thunk kiểu cũ.

## 2. GIAO THỨC BẢO MẬT VÀ GIAO TIẾP

- **Authentication:** Stateless JWT (JSON Web Tokens). Phân quyền vai trò bằng Spring Security `@PreAuthorize("hasRole('ADMIN')")`.
- **CORS (Cross-Origin Resource Sharing):** Được cấu hình mở rộng tại `WebSecurityConfig` để cho phép `localhost:5173` (Vite Default Port) push OPTIONS, GET, POST, DELETE.
- **Interceptors:** Phía React sử dụng `axios.interceptors.response` chặn toàn bộ lỗi 401 Unauthorized API Exception để gắn biến cờ Logout và đá App về `/login`.

## 3. MÔ HÌNH DEPLOY TƯƠNG LAI CỦA DỰ ÁN NÀY (Định Hướng)

Dựa theo cách Setup `.env` và config hệ thống, toàn bộ File Media Storage (ảnh Khách sạn/Tour) được cắm vào Driver `MinIO` (S3 Compatible). Đây là mô hình Cloud-Native, đồng nghĩa Backend hoàn toàn Stateless (Không lưu ảnh ở Local Disk C: hay tmp). Hệ thống có thể gắn Load Balancer và scale lên N Replicas server dễ dàng.
