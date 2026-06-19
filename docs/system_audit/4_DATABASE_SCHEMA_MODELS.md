# 4. KẾT CẤU DATABASE SCHEMA MODEL (Database Models & Modeling Strategy)

Bóc tách cấu trúc Data theo bản MySQL DDL gốc (Từ file `V1_01` Flyway). Tại sao dự án lại thiết kế như thế này?

## 1. MÔ HÍNH DỮ LIỆU ĐÁM MÂY CORE USERS

- Bảng `users`: Làm Central Node của Identity. Hệ thống dùng UUID (`CHAR(36)`) chống enumeration data id 1, 2, 3..
- Bảng `roles`, `permissions`, `role_permissions`, `user_roles`: Cấu trúc RBAC n-n tuyệt đẹp. Thêm quyền cho người dùng dễ dàng theo dạng Mảng lưới, quy Code `action_name` rất rõ ràng.
- Bảng User Con `user_preferences`, `user_devices`, `user_addresses`: Lấy `user_id` làm khóa Ngoại Cascade, lưu profile khách hàng (định vị JSON cho region/tags, thiết bị fcmToken).

## 2. KIẾN TRÚC ĐỊNH TUYẾN DU LỊCH (Destinations Master)

- **Hierarchy Nodes:** `destinations` có Self-referencing FK (`parent_id`). Điều này giúp phân cấp cực sâu (Châu Á -> Việt Nam -> Đà Nẵng -> Phường Ngũ Hành Sơn). Chỗ này Backend phải xài GraphQuery (truy vấn lồng) cực căng.
- **Rich JSON:** Mọi dữ liệu như `attractions_json`, `tags_json` đẩy mẹ vào JSON Field để NoSQL Document Mapping cho nhẹ bảng, vì Schema Tag quá dị biệt theo loại chỗ.

## 3. SIÊU CẤU TRÚC TOUR & HÀNH TRÌNH CHUYẾN BAY (Domain Engine)

### 3.1. Hàng Không Flights

- **Nodes:** `airlines`, `airports` (Bảng Static Master Catalog Code IATA).
- **Edge:** Bảng `flights` map ID `origin` và `destination`.
- **Price Allocation:** Bảng `flight_classes` sinh chi nhánh vé Business, Economy. Thuật toán trừ `seat_available` trong Update Optimistic Lock cực đỉnh. `fareRule` là bảng One-To-One đi kèm.

### 3.2. Cấu Trúc Khách Sạn Hotels (Under Construction)

- Bảng `hotels` lưu Profile, Map sang `hotel_media`.
- Phần Lõi `hotel_room_types` và `hotel_room_inventory`: Đây là hạt giống đang chờ FE đấu API. Bảng inventory lưu số phòng khả dụng theo Ngày (Allotment) chống Book chồng (Overbooking).

## 4. BOOKING TRANSACTIONS & THANH TOÁN (Core Finance)

- Khung Skeleton Booking được mô hình hóa theo dạng `orders` tổng chứa List `booking`: `booking_flights`, `booking_tours`, `booking_hotels`.
- Điều này ám chỉ Web hỗ trợ "Add to Cart" mua 1 lúc cả Flight + Tour rồi Check-out VNPAY chung 1 Invoice trong hệ thống Payments.
- Bảng Log Lịch sử Trạng Thái Status Event Sourcing (`booking_status_history`): Thay vì chỉ đổi state `pending -> paid`, Project lưu log sự thay đổi sang nhánh con Time-Series để Trace vết Auditing "Ai đã bấm Hủy vào lúc Nào".

> [!MUST_KNOW] Mọi Table đều có Abstract `created_at`, `updated_at`, `deleted_at`, cấu hình chuẩn JPA Hibernate `@SQLDelete(sql="UPDATE _ SET deleted_at=NOW()")` cho hiệu ứng **Soft Delete** an toàn 100%. Đỉnh cao thiết kế CSDL.
