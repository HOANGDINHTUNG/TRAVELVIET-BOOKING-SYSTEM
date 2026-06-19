# 6. MÔ HÌNH DÒNG CHẢY DỮ LIỆU & STATE MANAGEMENT (Data Flow)

Để xử lý hàng nghìn records JSON mà Server BE đẩy về mà không làm "giật tung màn hình" (lag render) trên Browser Client, Frontend phải áp dụng mô hình phân tách State 3 Cấp Độ Rất Nâng Cao.

## 1. CẤP ĐỘ 1: GLOBAL SERVER-STATE VỚI TANSTACK QUERY

Lỗi ngớ ngẩn nhất của React Dev là gọi `axios.get` bên trong `useEffect`, dẫn tới việc lội DOM Component, re-render hàng loạt lúc Load ảnh, chớp nháy Layout (Layout Shift) và tự động dính nợ kĩ thuật (Race condition if fetch is slow).

- **Giải pháp dự án:** Mọi hàm gọi `flight.api.ts` đều được bọc bên trong cấu trúc của **Tanstack Object Queries**.
- **Điểm lợi hạt nhân:**
  - `Stale-While-Revalidate`: Màn hình `FlightHotDeals` ngay khi render ra lập tức lấy Data Cũ trong RAM (Disk Cache) vẽ lên ngay lập tức (0 mili-giây delay). Sau đó background network tự động chạy ngầm đi hỏi Java Server xem "Vé tàu có ai mua mất chưa". Nếu chưa -> Giữ nguyên DOM, không render lại giật màn. Nếu có -> Tự thay đổi Cụm Chữ số lượng Vé rất mượt.
  - **Garbage Collector (GC Time):** Nếu User đóng Component Chuyến Bay, 5 phút sau RAM trình duyệt tự động xóa Data Trống rỗng chống tràn Memory.

## 2. CẤP ĐỘ 2: SESSION & APP GLOBAL STATE (REDUX / ZUSTAND)

- **Central Authentication:** JWT Token không được ném lung tung. React Context bọc ngoài cùng Component App. Lõi Redux hoặc Store Component sẽ chọc lấy JWT parse payload ra xem `email` đang đăng nhập là ai. Từ đấy thả nó xuống tất cả nhánh con cây DOM dưới dạng `useSelector(state => state.user)`.
- **Zustand for Micro-States:** Redux quá Boilerplate (lằng nhằng Reducer/Dispatch), nên những thứ nhỏ nhặt như: Biến "Bật/Tắt Menu Sidebar", Biến "Gióng ngang Form Filter" được Code xử lý bằng Zustand -> Cực nhanh gọn 1 dòng `create(set => [...])`.

## 3. CẤP ĐỘ 3: MICRO LOCAL FORM STATE (UNCONTROLLED DOM)

- Hãy tưởng tượng màn hình Điền Form Đặt Vé Máy Bay (Booking Details) có tới 50 Input fields (Tên Đệm, CMND hành khách 1, 2, 3..). Nếu dùng `useState` thông thường gõ cứ 1 kí tự là React Compile Re-render lại sạch bách 50 Fields. Cực xót RAM Điện thoại iPhone.
- **Giải Pháp:** `react-hook-form` + `Zod`. Toàn bộ React Virtual DOM tắt tái vẽ nội bộ. Component Input được chọc thẳng Ref Pointer xuống Real DOM (DOM thực).
- Đầu ra cuối cùng nhấn Nút Submit -> React gom 1 cục Data JSON gọn gàng, Ném qua Zod kiểm tra format CMND, Cccd. -> Pass thì đẩy axios POST `/bookings`.

> Sự phối hợp Thần thánh giữa: **Server Data (Tanstack) -> Auth State (Redux) -> Local Micro (HookForm)** chính là Kim Chỉ Nam kĩ thuật cho FrontEnd Leader.
