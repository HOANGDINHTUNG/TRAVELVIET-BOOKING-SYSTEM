# 5. CHI TIẾT BẢN ĐỒ MẠNG LƯỚI ENDPOINTS API (API endpoints Matrix)

Bản đồ này được xuất tự động bằng trình Python phân tích Code tại tất cả các Controllers (198 Endpoints).

## 1. PHÂN HỆ AUTHENTICATION & CORE (Tầng Bảo Mật)

- **AuthController**: POST `/auth/register`, `/auth/login`, `/auth/refresh`. Quản trị JWT Flow.
- **SystemController / RenderLiveness**: GET `/system/health`, GET `/` (Probe check uptime AWS).

## 2. PHÂN HỆ USER PROFILE & PERMISSIONS (Quản Trị Người Dùng)

- **UserProfileController**: (Khung /users/me/\*) Cập nhật Profile, Lấy danh sách Địa chỉ, Thiết bị, Context Access token, Preferences json.
- **UserCheckin / Mission / Passport**: Các Endpoint gamification. Claim Voucher/Reward. Post `/users/me/missions/{id}/claim`.
- **AdminRole & Permission**: GET/PUT/PATCH `/roles`, `/permissions`. Thay đổi list Cấp bậc Hệ thống Backoffice. Cấp thẻ Badge (`/badges/{id}/grant/users/{id}`).

## 3. PHÂN HỆ DU LỊCH & ĐIỂM ĐẾN

- **DestinationController**: GET `/destinations` (Search Node). GET `/destinations/hierarchical`. POST `/destinations/propose` (Khách hàng xin Thêm điểm mới).
- **DestinationFollowController**: POST/DELETE `/destinations/{uuid}/follow` Theo dõi / Bỏ theo dõi Vịnh Hạ Long.
- **WeatherController**: GET `/weather/realtime`, GET `/destinations/{id}/weather/forecasts` (Bắn API gọi AccuWeather/OpenWeather).

## 4. HỆ THỐNG MUA VÉ MÁY BAY & KHÁCH SẠN (Bookings Core)

- **FlightController:** GET `/flights` (Search theo Param size/page/destinationCode), GET `/flights/{id}`.
- **HotelController:** GET `/hotels`, GET `/hotels/{id}/detail`. Cấu trúc Data Hotel rông lớn (FE đang Off màn này).
- **Tours / Combo / Voucher:** GET `/tours/search`, Admin POST `/admin/tours/withImage` (Kèo S3 Upload ảnh thẳng API).
- **BookingController:** Tầng Transaction Tổng `POST /bookings`, check Quotes, Cập nhật Change State (CheckIn, Cancel). Bọc cả Hotel / Flights / Combos. Chứa API Event Sourcing Tracking State (`/bookings/{id}/status-history`).

## 5. HỆ THỐNG THANH TOÁN (PAYMENTS)

- **PaymentController**: POST `/payments` -> Tạo Invoice.
- **VnpayController**: POST `/payments/vnpay/checkout` sinh Link dẫn VNPay Gateway. GET `/payments/vnpay` (WebHook IPN Callbacks Server-to-Server) xác nhận nạp tiền.
- **RefundController**: PATCH `/refunds/{id}/approve` -> Duyệt Hoàn tiền Khách Hưng theo Rule.

## 6. MODULE SUPPORT & CHAT AI (Chăm Sóc Khách Hàng)

- **AiChatController**: POST `/ai/chat` (Gửi Prompt chatGPT Travel).
- **ScheduleChatController**: Room Chat N:N trong Hội Nhóm Lịch Trình Tour ảo (Chứa Websocket message log GET/POST messages, Mute member).
- **CustomerTestimonial & Reviews:** Khen chê, Log Recommendation cho chuyến đi (`/users/me/recommendations/tours`).

_Ghi chú quan trọng:_ File này đóng băng 198 Router tính từ Ver V8 SourceCode. Lộ trình tích hợp FE-API đang được tiếp tục lấp đầy dựa trên khung sườn bê tông vững chãi này.
