# 8. MỔ XẺ GIAO DIỆN VÀ HIỆU ỨNG TƯƠNG TÁC (UI/UX Action & GSAP Animation)

Chất lượng của dự án này đạt phân khúc AAA+ phần lớn nằm ở các dòng Code Motion Animation được xử lý cực chi tiết tại Component Layer, đem lại cảm giác mượt mà (smooth) "táo khuyết".

## 1. CUỘN TRANG LÕI VẬT LÝ VỚI LENIS (Physics Smooth Scrolling)

Các Web React truyền thống dùng Thanh Cuộn mặc định của Browser rất gián đoạn (Khập khập).

- **Áp dụng Lenis:** Framework cuộn DOM ảo (`lenis v1.3`) bao quát thẻ Root `#root`. Mọi vòng lăn trỏ chuột (Mouse Wheel) được Map qua `requestAnimationFrame()`.
- Trải nghiệm mang lại sự hãm tốc vật lý (Inertia scrolling, Drag friction). Khi cào mạnh chuột, màn hình trôi nhanh rồi từ từ chậm lại thanh thoát thay vì dừng khựng cục súc.

## 2. TIMELINE & SCRUBBING VỚI GSAP (GreenSock)

Component Hoạt ảnh phức tạp như Trang Hero / Complex Destionation View / Booking Timeline.

- **ScrollTrigger:** Kỹ thuật cuộn tới đâu Parallax tới đó. Background Ảnh Vịnh Hạ Long cố định, Text Description trôi mềm qua (Tên Kỹ thuật MASK Trượt).
- Toàn bộ Timeline GSAP được nhúng trong Dependency Arrays của UseEffect, được dọn dẹp kĩ lưỡng hàm `revert()` chạy hàm Hủy lúc trang web unmount để triệt tiêu Leak Memory FPS.

## 3. CHUỖI MOTION PAGE TRANSITIONS BẰNG FRAMER MOTION

Module thư viện `motion (Framer Motion v12)` thực thi Layout Transitions.

- **Giao diện AuthLogin:** Thẻ Form Đăng Nhập vs Đăng Ký sử dụng Animation `layoutId` tự động Morph (biến hình) kích thước khối Nhập Liệu. Khung Mật Khẩu trượt từ trên xuống cực dẻo (`initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}}`).
- **Hiệu ứng Liệu Kính (Liquid Glassmorphism):** Thẻ Hot Deals Flights xài kĩ thuật CSS Backdrop Blur hòa quyện trên Layer màu Cyan Neon vệt bóng ma mượt mà. Đạt đỉnh cao Cybernetics CSS.

## 4. RADIX UI VÀ TỐI ƯU TÍNH TRỢ NĂNG (A11Y)

Component siêu đẳng "Cửa sổ chọn Ngày/Người" Picker (VD `FlightDatePicker.tsx`)

- Sử dụng màng bọc Headless Modal của Radix UI. Chống Rerender.
- Hỗ trợ tương tác Hành Vĩ (Keyboard Interaction): Bấm Tab đổi Component, Bấm `Esc` tự đóng mượt mà Popup chọn Ngày mà không bị lỗi mắc kẹt Tiêu điểm Nhập liệu (Focus Trap) thường thấy ở Modal lỏ ngoài thư viện.
- **Icon Set Lucide:** Đồng bộ Viền 1.5px Stroke Icon Siêu Nết. Không bao giờ xuất hiện hiện tượng vỡ hạt ảnh Bitmap cổ lỗ sĩ. Cực kì vector.
