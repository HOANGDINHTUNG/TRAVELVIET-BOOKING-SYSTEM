# 10. PHÂN TÍCH LỖ HỔNG CODE & LỘ TRÌNH VÁ TỐI ƯU (Gap Analysis & Roadmap)

Phần Tài liệu Cốt Tủy này là bảng Báo Cáo Sự Thật (Truth Report) về những vùng Code chưa được "Mượt" hoặc đang có nguy cơ tiềm tàng Bug ẩn được bóc ra từ quá trình duyệt codebase sâu xa.

## 1. CÁC NÚT THẮT (REALITY GAPS & MEMORY LEAKS)

### Gap 1: Nợ Kỹ Thuật (Tech Debt) - Form Rerender Trap ở `DestinationComplexDetailPage.tsx`

- **Vấn đề:** Trình Biên dịch mới của React (React Compiler) đang từ chối Compile file giao diện Admin Quản Lý Điểm Đến, văng lỗi `incompatible library`.
- **Nguyên nhân:** Component này xài API `watch()` của `react-hook-form` bắt nguyên 1 mảng Form rất lớn để hiển thị preview Real-time Hình ảnh Tour. Dẫn đến Rerender liên tục, phá vỡ Logic Memoization bảo vệ bộ nhớ của React 19.

### Gap 2: Sự Lạc Nhịp Của Chức Năng `Hotels` (Feature Offline)

- **Backend đã làm:** Xây nguyên dàn Khung Models `Hotel`, `RoomTypes`, `RoomInventory`, `HotelController` truy vấn xịn.
- **Frontend đang thiếu:** Không hề có Data Binding ở React. Thư mục View React Page Khách sạn hoàn toàn để Layout Cứng (Dummy Layout Text Rỗng). Không có Code gọi Axios `getHotels` tương ứng về nạp vào Redux Store.

### Gap 3: Xử Lý Thiếu Đồng Bộ - Ảnh Mồ Côi Upload Bị Kẹt (Orphaned Media Data)

- **Vấn đề MinIO:** Chức năng Upload ảnh Destination trong Dashboard Admin hoạt động bằng cách gọi lên `/admin/destinations/media` ném thẳng ảnh vào Bucket S3 rồi lấy Link String về lưu.
- **Rủi ro Rác Database:** Nếu Manager up ảnh xong mà... tắt trình duyệt và chưa ấn Nút "Lưu Cấu Hình", File ảnh đó đã lỡ bay nằm ở máy chủ S3 vĩnh viễn (Tốn tiền Cloud Storage rác) nhưng MySQL lại không có Cột Database Entity liên kết. => Không cơ chế Dọn Dẹp. Rụng tiền Cloud S3.

## 2. KẾ HOẠCH BỨT PHÁ (ROADMAP KIẾN TRÚC MỚI)

Để xử lý đám Code Legacy trên, cần Follow quy trình 3 Phase:

### Phase 1: Thượng Tôn Performance FE (Tuần 1)

1. **Gỡ bỏ vòng lặp Render vô hạn:** Gắn lại hook React ở các khối có `watch()`. Dùng cách Binding Input ref riêng (Tách Component Con nạp Uncontrolled UseForm Context) để React Compiler VITE chấp nhận Build thành công mà không Văng lỗi Console.
2. **Setup Lazy Component Tree:** Cắt đôi bundle Frontend `app.js` 15 Megabytes bằng kĩ thuật `React.lazy()` tại Module Routing. Khi khách vào trang Mua Vé Máy bay, KHÔNG BẮT HỌ TẢI CODE trang Khách Sạn và Review (Giảm FCP - First Contentful Paint).

### Phase 2: Nối Cầu Khách Sạn và Bảo Mật Sync (Tuần 2)

1. Mở Khoá Logic UI Khách Sạn. Cho API GET chọc thẳng List Hotel Data về và bọc vào `useQuery` TanStack để map Dữ Liệu Lên Giao diện rỗng hiện tại.
2. Setup **CronJob Server-Side CleanUp**: Viết lớp Java chạy Caching lúc Nửa Đêm 3:00 Sáng để đối chiếu danh sách URL Database MySQL với Storage AWS MinIO. URL nào bên S3 có mà Data SQL không lưu -> Server Xóa Thẳng Rác Đám Mây S3 tiết kiệm Cost Operation.

> [!CAUTION] Báo Cáo Kỹ Thuật Nghiêm Trọng
> Toàn bộ System Architecture đang được chuẩn hóa rất đẹp với Flow 1 chiều và DB Lock Optimistic nhưng Giao diện FrontEnd do quá nhiều View Phức Tạp, dồn nén chung ở Layout chưa Tách Lazy Route nên sẽ bộc phát Vấn đề Render nếu Data Trả về quá nặng. Phải lập tức Audit Clean Code ngay tại View của `Admin Components` ngay ngày mai.
