import os

table3_path = r"C:\Users\Admin\.gemini\antigravity\brain\f6fc655d-d3f5-41b7-b823-99b48801f9d9\table3.md"
table4_path = r"C:\Users\Admin\.gemini\antigravity\brain\f6fc655d-d3f5-41b7-b823-99b48801f9d9\table4.md"
out_path = r"d:\Documents\WED_SERVICE\travelviet-booking-system\backend\BACKEND_SYSTEM_AUDIT.md"

with open(table3_path, "r", encoding="utf-8") as f:
    table3 = f.read()

with open(table4_path, "r", encoding="utf-8") as f:
    table4 = f.read()

report = f"""# BACKEND SYSTEM AUDIT REPORT - TRAVELVIET BOOKING SYSTEM

**Thời điểm Audit:** Hiện tại
**Mục tiêu:** Rà soát kiến trúc phân tầng, đánh giá 100% CSDL và Endpoint của hệ thống Backend, phát hiện lỗ hổng và đối chiếu với nghiệp vụ OTA thực tế.

---

### BẢNG 1: TỔNG QUAN CÔNG NGHỆ & CẤU HÌNH (Tech Stack & Configurations)

| STT | Tên Công nghệ/Thư viện | Phiên bản (Version) | Mục đích sử dụng trong dự án | Trạng thái cấu hình |
|-----|------------------------|---------------------|------------------------------|--------------------|
| 1 | **Java** | 21 | Nền tảng ngôn ngữ cốt lõi cho Backend | Đã cấu hình tối ưu |
| 2 | **Spring Boot** | 4.0.5 | Framework chính để phát triển Web app, REST API | Cấu hình cơ bản |
| 3 | **MapStruct** | 1.6.3 | Mapper tự động giữa DTO (Data Transfer Object) và Entity | Cấu hình cơ bản |
| 4 | **QueryDSL** | 5.1.0 | Xây dựng các câu truy vấn động (Dynamic Queries) an toàn | Cấu hình cơ bản |
| 5 | **Flyway** | 10.10.0 | Quản lý phiên bản Database Migration (Versioning CSDL) | Đã cấu hình tối ưu |
| 6 | **MinIO** | 8.5.10 | Lưu trữ Object Storage (File/Ảnh) tự host thay S3 | Cấu hình cơ bản |
| 7 | **Caffeine Cache** | N/A | Local Caching (tours, destinations...) | Đã cấu hình tối ưu |
| 8 | **Redis (Spring Data)** | N/A | Distributed Caching, Rate limiting keys | Đã cấu hình tối ưu |
| 9 | **Bucket4j** | 8.10.1 | Quản lý Rate Limiting chống spam API, kết hợp Redis | Đã cấu hình tối ưu |
| 10 | **Resilience4j** | 2.3.0 | Circuit Breaker, failover cho tích hợp API bên ngoài ngoài | Đã cấu hình tối ưu |
| 11 | **SQL DB (MySQL/Hikari)** | N/A | Database Driver và Connection Pool (Max 10) | Đã cấu hình tối ưu |

---

### BẢNG 2: KIẾN TRÚC THƯ MỤC & PHÂN TẦNG (Project Structure & Clean Architecture)

Hệ thống tuân thủ mô hình **Layered Architecture** với cấu trúc Controller -> Facade -> Service -> Repository. Thư mục chính nằm trong `module/`.

| Tên Module/Package | Controller phụ trách | Facade/DTO Mapping | Service/Business Logic | Repository/QueryDSL | Chú thích tác vụ nghiệp vụ chính |
|--------------------|----------------------|--------------------|------------------------|---------------------|----------------------------------|
| `auth` & `users` | AuthController, UserController | AuthFacade, UserMapper | AuthService, UserService, UserPreferenceService | UserRepository | Quản lý vòng đời người dùng, định danh (JWT), OTP, Phân quyền RBAC (Role-based). |
| `destinations` | DestinationController | DestinationFacade | DestinationService, MediaService | DestinationRepo... | Khám phá, CRUD điểm đến, logic theo dõi (Followers), thông tin thời tiết điểm đến. |
| `tours` | TourController, ScheduleController | TourFacade | TourService, ItineraryService, ScheduleService | TourRepository... | Cốt lõi của hệ thống: quản lý Tour, Lịch trình, Giá theo ngày, Mùa vụ, Check-list. |
| `flights` | FlightController, AirportController | FlightFacade | FlightService, AirlineService | FlightRepository... | Quản lý các chuyến bay cơ bản, hạng ghế, luật giá vé sân bay. (Mới thêm DB mapping) |
| `hotels` | HotelController, RoomController | HotelFacade | HotelService, RoomInventoryService | HotelRepository | Quản lý Khách sạn, Phòng, Tình trạng rải rác (Allotments, Inventory). |
| `bookings` | BookingController, PassengerCtrl | BookingFacade | BookingService, PricingService | BookingRepository | Trung tâm đặt vé (Tour/Combo), Check ghế trống, Giữ chỗ (Hold/TTL), tính thuế phí. |
| `orders` & `payments` | OrderController, PaymentController | OrderFacade, PaymentFacade | OrderService, VNPayService, RefundService | Order/PaymentRepo | Xử lý thanh toán Payment Gateway (VNPay), hoàn tiền, tracking Hóa đơn. |
| `promotions` | VoucherController, CampaignCtrl | PromotionFacade | VoucherService, CampaignService | PromotionRepo | Engine khuyến mãi: Mã giảm giá, quy tắc trừ tiền, phân bổ Voucher (Claiming). |
| `loyalty` | LoyaltyController, MissionCtrl | LoyaltyFacade | BadgeService, MissionService, PassportService | PassportRepo | Gamification: Nhiệm vụ (Missions), Thẻ hộ chiếu (Travel Passport), Check-in. |
| `reviews` & `support` | ReviewController, SupportCtrl | ReviewFacade | ReviewService, SupportSessionService | ReviewRepo | Tổng hợp Đánh giá (Rating), Chấm điểm Cảm xúc, Phản hồi khách hàng & LiveChat. |

---

{table3}

---

{table4}

---

### BẢNG 5: TRẠNG THÁI TIẾN ĐỘ TỪNG TÍNH NĂNG & LỖ HỔNG NGHIỆP VỤ (Feature Progress & Reality Gap Analysis)

| STT | Tên Tính Năng/Nghiệp Vụ | Tỉ lệ hoàn thiện (%) | Trạng thái code | Đánh giá lỗ hổng thực tế so với OTA | Đề xuất hành động tiếp theo |
|-----|-------------------------|----------------------|-----------------|--------------------------------------|-----------------------------|
| 1 | **Quản lý Users & RBAC** | 90% | Ổn định | Xử lý đa luồng Role khá rườm rà. Bảng `user_devices` có tồn tại để Push Notification, nhưng xử lý Invalidate Token khi Log-out chưa rõ ràng tuyệt đối. | Audit lại luồng Token Refresh, Review lại cơ chế Revoke Token. |
| 2 | **Quản lý Tour & Lịch trình (Schedules)** | 85% | Ổn định | Đã cover tốt logic OTA về ngày khởi hành, giới hạn chỗ trống (remaining_capacity). Cần bổ sung logic Allotment (nhận khoán giữ chỗ đại lý B2B) nếu mở rộng đại lý. | Hoàn thiện API Cập nhật/Huỷ Tour hàng loạt khi dời lịch do biến cố. |
| 3 | **Pricing Logic & Add-ons (Booking)** | 70% | Ổn định / Có test | Việc tính toán giá dựa theo hạng PAX (Người lớn/Trẻ em) khá chuẩn. Lỗ hổng tiềm năng: Thiếu Rule Engine động cho mùa cao điểm/thấp điểm (Surge Pricing) ngoài giá Base. | Bổ sung Dynamic Pricing Engine. Kiểm duyệt kỹ hàm `BookingPricingService`. |
| 4 | **Flight & Hotel Integration** | 40% | Thiết kế Database / Thiếu logic | DB schema cho `flights` và `hotels` đã lên (`V10`, `V11`), đã mapping Entity, tuy nhiên logic Business layer và API Endpoints chưa mapping đầy đủ (Hoặc đang hoàn thiện). Thiếu Booking Entity riêng cho Flight/Hotel. | Khởi tạo / Mở rộng `BookingEngine` sang Flight & Hotel. Phân định rạch ròi Combo (Tour + Flight) thay vì ghép cứng. |
| 5 | **Payment & Thanh toán VNPay** | 80% | Ổn định / Chưa test thực tế | Flow tạo Transaction và nhận IPN (Webhook) được cấu hình trên `application.yaml`. Tuy nhiên logic Hoàn tiền (Refunding) chưa 100% tự động được do VNPay API. | Tích hợp thêm payment Gateway khác nội địa & Visa/Master. Đảm bảo Transactional Rollback an toàn. |
| 6 | **Ticketing Time Limit (TTL) / Giữ chỗ (Hold)** | 50% | Thiếu logic / Mới có DB | Mới thêm vào DB script `V11__add_allotment_and_ttl.sql`. Logic cronjob để tự động Huỷ (Cancel) ghế bị Timeout (Hết TTL) khả năng cao chưa implement triệt để. | Cần tạo 1 Spring Batch job / RabbitMQ Delay message để huỷ Booking quá hạn TTL. |
| 7 | **Gamification & Loyalty (Missions/Passports)** | 75% | Ổn định | Cơ chế badge, passports khá ấn tượng & đi trước các OTA thông thường. Cần xác nhận luồng Trigger (Event-driven) khi user thực hiện hành động. | Sử dụng Kafka/RabbitMQ events thay vì trigger cứng từ Service để decouple. |
| 8 | **CRM & Review/Hỗ trợ LiveChat** | 60% | Đang thiết kế DB | `schedule_chat_rooms` có DB nhưng real-time (WebSocket) controller flow có thể chưa scale. | Kiểm tra cấu hình STOMP / WebSocket với Redis/RabbitMQ. |

---
**Tổng kết:** Hệ thống có kiến trúc DB, phân tầng codebase vô cùng chi tiết, bài bản và quy mô. Tiến trình khoảng 60-70%. Cơ bản Module cốt lõi (User, Destination, Tour, cơ bản Booking) đã chạy. Nhược điểm chính là Flight & Hotel mới chỉ có DB Schema, chưa sâu vòng đời nghiệp vụ.

"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(report)
