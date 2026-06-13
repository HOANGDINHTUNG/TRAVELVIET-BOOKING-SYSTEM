# 📊 Báo Cáo Chuyên Sâu: OTA Business Gap Analysis & Roadmap

**Role:** Senior Solution Architect & Product Manager
**Scope:** End-user Booking Flow (Tours, Flights, Hotels, Combos)
**Principle:** Open-Closed Principle (OCP) - Không phá vỡ luồng cốt lõi, áp dụng Patch & Extension.

---

## 1️⃣ Reality Gap Analysis (Lỗ Hổng Nghiệp Vụ Hiện Tại)

Dựa trên việc rà soát kiến trúc hệ thống (`V1__tables.sql`, `ERD.sql`) cho các module Flights, Hotels, Combos và Tours, dưới góc độ một OTA thương mại chuẩn mực (như Traveloka/Agoda), hệ thống đang có các "khoảng trống" (gaps) thực tế sau:

### 1. Phân cấp địa điểm (Location Hierarchy) còn "Phẳng"

> [!WARNING]
> Sai lệch tư duy tiệm cận

- **Hiện trạng:** Điểm đến (`destinations`) chỉ nhóm theo `province, district, region`. Sân bay (`airports`) nối cứng vào `destination_id`.
- **Thực tế OTA:** Địa điểm cần phân cấp dạng cây hình phễu: Cấp Quốc gia -> Cấp Vùng (Macro Location) -> Điểm đến cụ thể (Micro/Neighbourhood) -> Điểm tham quan (Point Of Interest - POI). Cấu trúc phẳng phá hỏng trải nghiệm gom cụm (Clustering) và tính năng tìm kiếm xung quanh (Radius search).

### 2. Sự "Ngây ngô" trong Giá trẻ em/Người lớn (Pricing Policy)

- **Hiện trạng:** `flight_classes` chỉ có một mức `base_price` duy nhất; không có giá Infant (Sơ sinh), Child (Trẻ em). Trong khách sạn (`hotel_room_types`), chỉ thiết lập `max_adults` và `max_children` nhưng không có quy định tính phụ thu (Child Surcharge) hay phí giường phụ (Extra Bed).
- **Thực tế OTA:** Infant bay thường chỉ chịu 10% phí + Thuế; Khách sạn phân cấp phụ thu trẻ em theo độ tuổi (vd: dưới 6 tuổi miễn phí, 6-12 tuổi phụ thu không giường, >12 tuổi bắt buộc Extra Bed).

### 3. Thiếu vắng các khái niệm lõi về Quỹ phòng (Hotel Allotment)

> [!IMPORTANT]
> Rủi ro thất thoát doanh thu (Lost Sales) hoặc Overbooking

- **Hiện trạng:** `hotel_room_inventory` duy trì lượng phòng tĩnh (`allotment`, `booked_qty`, `available_qty`).
- **Thực tế OTA:** Cần tồn tại khái niệm **Cut-off Days** (Thả số lượng phòng chưa bán lại cho khách sạn trước giờ G). Ngoài ra, thiếu cơ chế **Free-sale (Dynamic Allotment)** để dễ dàng tích hợp API từ Channel Managers (Siteminder, RateGain).

### 4. Lỗ hổng Giữ vé máy bay (Ticketing Time Limit & PNR)

- **Hiện trạng:** Trạng thái vé máy bay (`flight_bookings`) chỉ đơn thuần là `pending_payment` hoặc `confirmed`.
- **Thực tế OTA:** Khi đặt vé, hệ thống phải sinh ra `PNR Code` (Passenger Name Record) và áp đặt **TTL (Ticketing Time Limit)** - ví dụ 15 phút - 12 giờ. Quá TTL mà chưa thanh toán, vé sẽ tự động nhả chỗ (Auto-Release Seat) về Hãng hàng không.

### 5. Ràng buộc chéo lỏng lẻo trong Combo

> [!CAUTION]
> Nguy cơ rủi ro vận hành (Operation Alert)

- **Hiện trạng:** `combo_bookings` lưu chung ngày đi/về nhưng thiếu sự liên kết trạng thái giữa chuyến bay và khách sạn bên dưới.
- **Thực tế OTA:** Nếu chuyến bay trong Combo bị hãng delay hoặc huỷ (Schedule Change), hệ thống hiện tại không tự động đánh dấu (Flag) phòng khách sạn tương ứng cần được dời ngày/huỷ. Việc "Khách bay trễ nhưng khách sạn tính No-Show" có thể dẫn đến khiếu nại khách hàng diện rộng.

---

## 2️⃣ Future Roadmap (Đề Xuất Tính Năng Mở Rộng "Must-Have")

Để nâng tầm hệ thống lên mức độ **OTA Thương mại Hoàn chỉnh**, chúng ta cần triển khai các khối chức năng (Modules/Features) sau:

### 🧩 A. Cross-selling & Up-selling (Dịch vụ gia tăng)

- **Ancillary Services (Bán kèm chuyến bay):** Bán hành lý ký gửi (Extra Baggage), lựa chọn chỗ ngồi (Seat Selection) và Suất ăn (In-flight Meals).
- **Hotel X-sell:** Gợi ý tức thì (Pop-up/Banner) các KS với giá ưu đãi đặc biệt ngay sau luồng đặt Vé máy bay (Flight Booking) thành công.
- **Travel Insurance & Visa Service:** Plug-in bảo hiểm du lịch tự động tính phí dựa trên số ngày và số lượng hành khách.

### 🎯 B. Marketing & Loyalty (Tăng trưởng & Giữ chân)

- **Voucher Đa điều kiện (Advanced Promos):** Mã giảm giá giới hạn theo thẻ tín dụng đối tác (BIN number), giảm giá kết hợp (Stackable Promos) và Flash Sale.
- **Earn / Burn System Thực chiến:** Cải tiến hệ thống điểm thành viên để khách hàng có thể thanh toán một phần (Burn Points to Cash) thay vì chỉ thăng hạng danh hiệu.

### 🌟 C. User Experience (Trải nghiệm cá nhân hoá)

- **Wishlist & Lịch sử cá nhân:** Mở rộng từ Tour sang **Saved Hotels & Saved Flights** (`wishlist_hotels`, `wishlist_flights`, `user_hotel_views`). Cảnh báo giá giảm (Price Drop Alerts) đối với danh sách yêu thích.
- **Micro-Reviews cho Khách sạn:** Đánh giá chi tiết từng khía cạnh khách sạn (Vị trí, Sạch sẽ, Dịch vụ) kết hợp hiển thị "Verified Guests".

### 💳 D. Payment & Notification (Thanh toán & Thông báo)

- **Payment Gateway đa dạng:** Tích hợp cổng thanh toán (Stripe/VNPay) hỗ trợ _Tokenization_ (Lưu thẻ để Charge tự động) và Trả góp (Installment).
- **Event-Driven Notification:** Tự động gửi SMS / ZNS (Zalo) nhắc check-in máy bay trước 24h, cảnh báo thay đổi cổng ra máy bay (Gate changes).

---

## 3️⃣ Step-by-Step Implementation Plan (Kế hoạch Thực Thi Kép)

Trung thành với kiến trúc lõi và bảo vệ nguyên tắc _Open-Closed_, mọi thay đổi DB đều thông qua file migration mới (không `DROP` hay sửa file migration cũ).

### 🛠 Phase 1: Tối Ưu Hóa & Vá Lỗi Hiện Tại (Optimization Cycle)

_Khắc phục lỗi logic sát thực tế mà không đập đi làm lại._

1. **V10\_\_update_flight_hotel_pricing.sql (Database Extension):**
   - Thêm bảng `flight_fare_rules` (định cấu hình hệ số giá `child_multiplier`, `infant_multiplier`) trỏ foreign key về `flight_classes`.
   - Bổ sung các cột cấu hình phụ thu `child_surcharge_rules` (JSON), `extra_bed_fee` vào bảng `hotel_room_types`.
2. **V11\_\_add_allotment_and_ttl.sql (Database Extension):**
   - Thêm `cutoff_days` (INT) và `is_free_sale` (BOOLEAN) vào `hotel_room_inventory`.
   - Cắm thêm `pnr_code` (VARCHAR), `ticketing_time_limit` (DATETIME) vào `flight_bookings`.
3. **Backend Logic Updates (Patching API):**
   - Implement **CRON Scheduler**: Quét các `flight_bookings` có `ticketing_time_limit` < `NOW()` và status là `pending_payment` -> Auto-cancel trả ghế (Release Seat) về rổ Inventory.
   - Sửa Service Layer tính giá (Pricing Facade): Tự động đọc cấu hình Fare Rules ở trên để tính Final Amount thay vì nhân cứng giá vé.

### 🚀 Phase 2: Mở Rộng Tính Năng Thiếu Sót (Expansion Cycle)

_Thêm giá trị thương mại cho hệ thống thông qua các Service/API mới._

1. **V12\_\_ancillary_and_crosssell.sql:**
   - Tạo mới bảng `ancillary_services` (định nghĩa Dịch vụ: Hành lý, Bảo hiểm...) & `booking_ancillaries` (Lưu thông tin dịch vụ mua kèm mapping vào `booking_id`).
   - Kiến trúc UI/UX Checkout Mới: Bổ sung màn hình "Dịch vụ thêm" vào ngay trước màn Pay&Checkout cuối cùng.
2. **V13\_\_advanced_promotions.sql:**
   - Thêm khối `voucher_payment_rules` (BIN thẻ, API Gateway quy định) mở rộng cho bảng `vouchers`.
3. **V14\_\_extended_user_interaction.sql:**
   - Tạo bảng `user_hotel_views`, `wishlist_hotels`, `wishlist_flights`.
   - API Update: Trải nghiệm Trang cá nhân mục "Danh sách yêu thích & Đã xem gần đây".
4. **Backend Event-Driven Architecture (Cross-Constraints Combo Lock):**
   - Áp dụng `Spring ApplicationEvent` / `Kafka`. Khi Service Flight kích hoạt `FlightStatusChangedEvent` (VD: Chuyến bay bị Huỷ hoặc Delay), `ComboBookingService` (đóng vai trò Event Listener) sẽ tra cứu toàn bộ booking Khách sạn liên kết với vé đó và gán "System Alert Request" để nhân viên Support/Operator chủ động hỗ trợ. Tuyệt đối không hard-code nối bảng nhằm bảo vệ Loose-Coupling.
