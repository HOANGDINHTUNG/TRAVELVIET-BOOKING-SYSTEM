# Dashboard Tổng quan — Ghi chú FE / BE

Tài liệu theo dõi hạn chế dữ liệu và lỗi đã xử lý khi triển khai `DashboardOverview.tsx` + `useDashboardOverviewData.ts`.

## Hạn chế hiện tại (cần BE)

1. **Không có API thanh toán tổng hợp cho admin**  
   FE không có `GET /admin/payments` (chỉ tạo / xem theo id). **Doanh thu** trên dashboard = tổng `finalAmount` các đơn có `paymentStatus` ∈ `paid`, `partial` trong **tối đa 150 đơn** trả về từ `admin/bookings` (hoặc fallback `/bookings/me`). Đây không thay thế báo cáo kế toán thực.

2. **Thiếu `GET /api/v1/admin/statistics` (hoặc tương đương)**  
   KPI, biểu đồ tháng, phân bổ trạng thái và “đơn gần đây” nên được tổng hợp server để tránh lệch mẫu và giảm số request.

3. **Booking DTO không có `tourName`**  
   Cột “Tên tour” dùng `GET /admin/tours/{id}` cho tối đa 5 `tourId` của 5 đơn mới nhất. Nên bổ sung `tourTitle` / `tourSlug` trong `BookingResponse` để giảm N+1.

4. **Người dùng mới (30 ngày)**  
   Đếm từ `GET users` (mẫu 200 user, sắp xếp `createdAt` desc). Nếu thiếu `createdAt` trên một số bản ghi, số có thể thấp hơn thực tế. BE nên hỗ trợ filter `from` / `to` hoặc endpoint `statistics`.

5. **Sparkline “Tour đang hoạt động”**  
   BE không trả chuỗi lịch sử theo ngày; FE vẽ đường xu hướng **giả lập** dựa trên snapshot `totalElements` tour `active` (chỉ để UI không trống).

## Lỗi / việc đã xử lý trong quá trình làm

| Vấn đề | Cách xử lý |
|--------|------------|
| Trong lúc `useQuery` pending, `useMemo` từng trả bundle mock → nguy cơ nháy dữ liệu | Chỉ render nội dung khi `!isLoading`; nhánh pending trong `useMemo` vẫn trả mock nhưng UI dùng skeleton. |
| `BookingResponse` không có tên tour | `useQueries` gọi `ManagementToursApi.detail` theo `tourId` của 5 đơn mới nhất. |
| Phân loại pie 3 nhóm theo yêu cầu UI | `Đã thanh toán`: `paid` / `partial`; `Đã hủy`: `cancelled`, `expired`, `refunded`, `failed` (thanh toán); còn lại → `Chờ xử lý`. |

## File liên quan

- `frontend/web/src/module/management/pages/DashboardOverview.tsx`
- `frontend/web/src/module/management/pages/useDashboardOverviewData.ts`
- `frontend/web/src/module/management/pages/dashboardMock.ts`
- `frontend/web/src/module/management/docs/BACKLOG_BE_ADMIN.md`
