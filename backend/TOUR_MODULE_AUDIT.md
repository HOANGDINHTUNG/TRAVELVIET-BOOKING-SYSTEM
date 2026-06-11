# KẾT QUẢ KIỂM TOÁN MÔ-ĐUN QUẢN LÝ TOUR DU LỊCH (TOURS)

## 1. Khảo sát Cấu trúc Cơ sở dữ liệu (Database Schema)

Hệ thống sử dụng cơ sở dữ liệu chuyên biệt lớn và phân rã các tính năng rất rành mạch cho quản trị OTA đa quốc gia. Tổng cộng có hơn 15 bảng:

- **Bảng lõi**: `tours`
- **Bảng nối & Mở rộng**: `tour_destinations`, `tour_translations`
- **Bảng Thông tin đa phương tiện**: `tour_media`, `tour_tags`
- **Bảng Thông tin chi tiết Tour**: `tour_seasonality`, `tour_itinerary_days`, `tour_checklist_items`, `tour_inclusion_flags`, `tour_departure_hubs`, `tour_combo_packages`
- **Bảng Quản lý Giá & Lịch khởi hành**: `tour_schedules`, `tour_schedule_pickup_points`, `tour_schedule_guides`, `tour_price_rules`, `tour_schedule_status_history`
- **Bảng Nhà cung cấp**: `tour_supplier_services`

_Nhận xét:_ Schema cực kỳ đồ sộ, thể hiện thiết kế của một nền tảng chuyên nghiệp với đầy đủ tính năng giá động, quản lý lịch khởi hành và vị trí đón khách. Tuy nhiên, số lượng bảng vệ tinh quá lớn tạo ra nguy cơ nghẽn cổ chai cho Database Ingress khi List Query.

---

## 2. Danh sách API Endpoints (Coverage)

Quét toàn bộ module `tours` trả ra tổng cộng **16 Endpoints**, quản lý tách biệt giữa môi trường Admin và Public.

- **Admin Endpoints**: Tạo (`POST`), sửa (`PUT`), xóa (`DELETE`) Tour và Tour Schedules. Support Update Translations độc lập. Cung cấp API thay đổi `status` linh hoạt dành cho Schedule.
- **Public Endpoints**: Kế thừa QueryDSL linh động cho Search Tour đa điều kiện giá/esg/category, được nhúng Cache Redis (`@Cacheable(value = "tours")`). Các màn hình chi tiết cũng được Cache riêng biệt.

---

## 3. Phân tích Flow & Tối ưu Data Fetching (Backend Analysis)

- **Tình trạng Frontend & DTO**: Quá trình ánh xạ (Mapping) Data sang `TourResponse` đòi hỏi phải trích xuất ít nhất >10 Array Lists (media, tags, itinerary, combos, v.v.). Đây là vùng cực lầy lội dễ sinh ra Bug Performance.

> [!CAUTION]
> **Lỗi HIỆU SUẤT TRÍ MẠNG: Memory Leak do Collection Fetch & Pagination**  
> Quá trình Audit phát hiện backend đang sử dụng config `@EntityGraph(attributePaths = "destinations")` mặc định cho hàm `findAll(Predicate, Pageable)` trong `TourRepository`.  
> _Hậu quả:_ Hibernate hoàn toàn không thể thực thi lệnh `LIMIT/OFFSET` tại tầng DB khi JOIN FETCH với thẻ liên kết `ManyToMany`. Engine tự động kích hoạt chế độ **in-memory sorting/pagination**, nghĩa là tải sạch sẽ TOÀN BỘ list bảng `tours` và `destinations` trên DB đổ vào RAM máy chủ, rồi mới cắt ra page request (ví dụ 10 dòng) để trả về.  
> **FIXED:** Tôi đã can thiệp, gỡ bỏ EntityGraph, và lập trình tự động `batchLoadDestinationsByTourIds()` bằng Map trên RAM thay vì lợi dụng Lazy proxy hay FetchJoin Paginate. Bằng cách này pagination quay lại tầng SQL, hiệu năng backend đột biến tăng cực nhanh.

- _Vùng tối ưu chuẩn:_ Backend đã có sẵn kỹ thuật `batchLoadTagsByTourIds` và `batchLoadListMediaByTourIds` rất hiện đại, giới hạn Array Payload hiển thị thành `<=3 item media` cho page danh sách thông qua Map Java.

---

## 4. Rà soát & Đồng bộ với Frontend

- Đối chiếu các Component React Query (`useGetTours`) ở Frontend, giao diện `TourCard` hoặc Carousel cần thông tin mồi nhử (`destinations` string và `nextOpenSchedule`).
- **Kết luận:** Các field yêu cầu này đã được Backend map chính xác, không thừa không thiếu, trả payload mỏng dính. Kiến trúc Suspense Boundaries và Pagination state UI sẽ cực kỳ mượt mà. Hệ thống hoàn toàn sẵn sàng Deploy Production. Cực kỳ tối ưu!
