# Backlog Backend — Admin & Báo cáo

Tài liệu bổ sung API để giao diện Admin đạt hiệu suất và độ chính xác cao (theo kế hoạch sản phẩm).

## 1. Dashboard Aggregate API

- **Endpoint đề xuất:** `GET /api/v1/admin/statistics`
- **Mục đích:** Trả KPI (doanh thu, số đơn, tour đang chạy, khách mới), chuỗi doanh thu theo ngày, phân bổ trạng thái đơn, danh sách đơn gần đây — tránh FE tự tổng hợp từ dataset lớn.
- **DTO:** Khớp `AdminDashboardBundle` (frontend) hoặc tách nhỏ theo module Booking/Payment.

### 1b. Admin Payments / Doanh thu

- **Vấn đề:** FE dashboard hiện **ước doanh thu** từ các đơn đã thanh toán trong mẫu booking (xem `DASHBOARD_OVERVIEW_FE_NOTES.md`).
- **Đề xuất:** `GET /admin/payments` (phân trang + filter theo ngày) hoặc trường tổng hợp trong `admin/statistics` để khớp báo cáo thực tế.

## 2. Export API (Excel / PDF)

- Xuất báo cáo kế toán từ server để đảm bảo nhất quán số liệu và quyền truy cập.
- FE hiện dùng `xlsx` client-side là giải pháp tạm; nên chuyển dần sang export do BE tạo file.

## 3. Real-time Notifications

- WebSocket (STOMP) — thông báo “Có đơn hàng mới” cho Admin không cần F5.
- FE: thay panel placeholder trong `AdminLayout` (chuông thông báo).

## 4. Audit Log UI

- Trang “Ai đã sửa Tour / hoàn tiền” dựa trên audit Spring Data JPA (đã có API audit trong nav hệ thống — cần DTO thống nhất cho timeline).

## 5. Bulk Actions

- API bulk cập nhật trạng thái Tour / Booking theo danh sách ID, có transaction và audit.
