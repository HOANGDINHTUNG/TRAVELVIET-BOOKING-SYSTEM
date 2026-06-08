# Hướng dẫn test Mobile — Commerce Desk (4 tab)

## Bạn sẽ thấy gì?

- Tab bottom **「Commerce」** + **Preferences** (đã ẩn Home/Tours mock).
- Đăng nhập một lần → đóng app mở lại **vẫn vào Commerce** (SecureStore).
- UI desk màu nâu `#8f5d20` (giống web `PromotionCommercePanel`).
- 4 tab: **Vouchers | Campaigns | Products | Combos** + chip tổng số.
- Toolbar tìm kiếm + tải lại; phân trang `size=12`.
- Nút **Tắt/Bật** trên từng card (quyền khác nhau theo loại — xem bảng dưới).
- **Không** FAB tạo mới, **không** màn chi tiết/form.
- Banner API (chỉ `__DEV__`) hiển thị URL sau failover.

## Các bước test

### 1. Cấu hình API

```bash
cd frontend/mobile
copy .env.example .env
```

**Cách A — URL cố định:**

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8088/api/v1
EXPO_PUBLIC_API_FAILOVER_ENABLED=false
```

**Cách B — Failover (mặc định trong `.env.example`):** thử local rồi Render.

| Môi trường | `EXPO_PUBLIC_API_LOCAL_URL` |
|------------|------------------------------|
| Android Emulator | `http://10.0.2.2:8088/api/v1` |
| iOS Simulator | `http://localhost:8088/api/v1` |
| Điện thoại thật (cùng WiFi) | `http://<IP-LAN>:8088/api/v1` |

`EXPO_PUBLIC_API_PUBLIC_URL` = `https://travelviet-booking-system.onrender.com/api/v1`

### 2. Chạy backend

Spring Boot port **8088**.

### 3. Chạy Expo (xóa cache)

```bash
npx expo start -c
```

### 4. Đăng nhập

- Mở desk: **`voucher.view`** hoặc **`promotion.campaign.view`** (hoặc SUPER_ADMIN).
- Bật/tắt theo tab:

| Tab | Quyền toggle |
|-----|----------------|
| Vouchers | `voucher.publish` |
| Campaigns | `promotion.campaign.publish` |
| Products / Combos | `voucher.delete` |

- Màn login hiển thị **API: …** — kiểm tra URL.

### 5. Kiểm tra

- Kéo refresh hoặc nút **Tải lại**.
- Phân trang Trước/Sau (`size=12`).
- Đổi tab Vouchers / Campaigns / Products / Combos; toggle → snackbar tương ứng.
- Đăng xuất ở **Preferences** → về login.

## Lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách sửa |
|-------------|-------------|----------|
| Vẫn thấy Home tour mock | Đang tab Home | Chọn tab **Sản phẩm** |
| Không kết nối máy chủ | Sai URL / BE tắt | Sửa `.env`, bật BE, IP LAN |
| Không có quyền xem | Thiếu `voucher.view` | Dùng tài khoản admin/commerce |
| Chỉ xem — không bật/tắt | Thiếu `voucher.delete` | Gán quyền hoặc SUPER_ADMIN |
| 401 | Token hết hạn | App tự refresh; nếu refresh fail → login lại |
| UI cũ | Cache Expo | `npx expo start -c` |
