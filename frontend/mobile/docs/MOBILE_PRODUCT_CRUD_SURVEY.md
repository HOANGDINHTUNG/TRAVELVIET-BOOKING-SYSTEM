# Khảo sát Mobile — CRUD Sản phẩm (UI/UX & Kỹ thuật)

> Tài liệu khảo sát trước khi thiết kế chi tiết / viết code.  
> Cập nhật: 2026-05-25  
> Stack mobile: **Expo Router** (`frontend/mobile`)

---

## 1. Mục tiêu thiết kế

- **Tối giản (Minimalist)**: ít màu, ít cấp chữ, thao tác rõ.
- **Tiện lợi**: thao tác một tay, FAB tạo mới, vuốt / menu xóa.
- **Hiện đại & dễ dùng**: skeleton loading, snackbar phản hồi, empty state có CTA.

---

## 2. User Flow — Số màn hình tối thiểu

### Kết luận: **3 màn hình chính + Dialog xác nhận**

| Màn hình | Vai trò | CRUD |
|----------|---------|------|
| **Danh sách (Home)** | Hub chính, tìm kiếm, refresh | **R** (list) |
| **Form (Create / Edit)** | Một form, hai chế độ | **C**, **U** |
| **Chi tiết** | Xem đầy đủ, sửa, vô hiệu hóa | **R** (item) |

**Delete** không cần màn riêng → Dialog / Bottom Sheet.

### Luồng đề xuất

```
Danh sách ──chạm dòng──► Chi tiết ──Sửa──► Form (edit)
    │                        │
    ├── FAB (+) ──► Form (create)
    └── Vuốt / menu ──► Dialog xác nhận vô hiệu hóa
```

### Phương án MVP (2 màn)

Chỉ dùng khi app nội bộ, không cần màn chi tiết: **List + Form**.

### Ánh xạ route (Expo Router) — đã triển khai

| Màn hình | Route |
|----------|-------|
| Danh sách | `/products` |
| Chi tiết | `/products/[id]` |
| Form tạo | `/products/form` |
| Form sửa | `/products/form?id={id}` |

---

## 3. UI/UX Minimalist

### Bảng màu (gợi ý token)

```
Primary:        #2563EB (hoặc màu thương hiệu — app dùng #0a7ea4 trong theme.ts)
Background:     #F8FAFC
Surface:        #FFFFFF
Text chính:     #0F172A / #11181C
Text phụ:       #64748B
Viền:           #E2E8F0
Lỗi:            #DC2626
Thành công:     #16A34A
```

**Tham chiếu app thực tế:** Notion Mobile, Apple Reminders, Stripe Dashboard, Google Keep (FAB).

### Typography

- Font hệ thống: **SF Pro** (iOS), **Roboto** (Android).
- 2–3 cấp: Title 20–22 / Body 16 / Caption 13–14.
- Giá & số lượng: font mono / tabular nếu có.

**Tham chiếu:** Linear Mobile, Revolut, Things 3.

### Spacing

- Lưới **8pt**: 4 / 8 / 16 / 24 / 32.
- Chiều cao dòng list ≥ **56–64dp**.
- Padding ngang **16–20**.
- Khoảng cách form **12–16**.

**Tham chiếu:** Material Design 3, Apple HIG, Gmail list.

### Pattern tương tác

- FAB **+** → tạo sản phẩm.
- Pull-to-refresh danh sách.
- Snackbar 2–3s sau lưu / vô hiệu hóa.
- Nút **Lưu** cố định cuối form.

---

## 4. Xử lý trạng thái (State Handling)

| Trạng thái | Danh sách | Form | Xóa / vô hiệu hóa |
|------------|-----------|------|-------------------|
| **Loading** | Skeleton 3–5 dòng | Nút disabled + spinner | Spinner trên Dialog |
| **Success** | Hiển thị data | Snackbar + quay lại | Snackbar + refresh list |
| **Error** | Màn lỗi + Thử lại | Inline field / banner | Snackbar, giữ dòng |
| **Empty** | Illustration + CTA «Thêm sản phẩm đầu tiên» | — | — |

### Chi tiết lỗi

| Loại | UX |
|------|-----|
| Mất mạng | «Không thể kết nối» + **Thử lại** |
| 500 | «Dịch vụ tạm thời không khả dụng» + Thử lại |
| 404 | «Sản phẩm không tồn tại» → về danh sách |
| 400 | Lỗi inline theo field |
| 401/403 | Chuyển đăng nhập / «Không có quyền» |

---

## 5. Backend API thực tế (repo hiện tại)

> Khác với mô hình đơn giản `id, name, price, quantity` — API commerce dùng metadata đầy đủ hơn.

**Base URL:** `EXPO_PUBLIC_API_URL` (mặc định `http://localhost:8088/api/v1`, Android emulator: `http://10.0.2.2:8088/api/v1`)

### Endpoints

| Method | Path | Permission | Mô tả |
|--------|------|------------|-------|
| `GET` | `/products` | `voucher.view` | Danh sách + phân trang + lọc |
| `GET` | `/products/{id}` | `voucher.view` | Chi tiết |
| `POST` | `/products` | `voucher.create` | Tạo mới |
| `PUT` | `/products/{id}` | `voucher.update` | Cập nhật full |
| `PATCH` | `/products/{id}/status` | `voucher.delete` | Bật/tắt `isActive` (soft delete) |

### Query params (`GET /products`)

- `page` (mặc định 0), `size` (1–100, mặc định 10)
- `keyword`: tìm theo `sku` hoặc `name`
- `productType`, `isGiftable`, `isActive`
- `sortBy`, `sortDir`

### Body tạo/sửa (`ProductRequest`)

```json
{
  "sku": "SKU-001",
  "name": "Travel Kit",
  "description": "...",
  "productType": "gear",
  "unitPrice": 150000,
  "stockQty": 20,
  "isGiftable": true,
  "isActive": true
}
```

`productType`: `gear | insurance | food | souvenir | service | gift`

### Response wrapper

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Phân trang: `data.content`, `data.totalElements`, `data.last`, ...

### Auth

- `POST /auth/login` — body: `{ "login": "email", "passwordHash": "..." }`
- Response: `data.accessToken`, `data.refreshToken`
- Header: `Authorization: Bearer <accessToken>`

### Ánh xạ khái niệm đơn giản → API

| Khái niệm đơn giản | Trường API |
|--------------------|------------|
| `price` | `unitPrice` |
| `quantity` | `stockQty` |
| `DELETE` (hard) | Không có — dùng `PATCH .../status` với `isActive: false` |

---

## 6. Hỏi đáp ngược — Cần làm rõ thêm

### Backend

1. Base URL từng môi trường (dev/staging/prod)?
2. Token refresh tự động khi hết hạn?
3. Có hard delete trong tương lai không?
4. Rate limit / timeout policy?

### Người dùng

1. Đối tượng: nhân viên kho, admin, hay khách?
2. Ngôn ngữ: chỉ Việt hay đa ngôn ngữ?
3. Offline có cần không?
4. Quy mô SKU (trăm vs hàng nghìn)?

### Kỹ thuật

1. Đã chọn **Expo / React Native** trong monorepo.
2. Brand guideline có sẵn chưa?
3. V1 có cần ảnh/barcode/category không?

---

## 7. Checklist triển khai

- [x] Lưu tài liệu khảo sát (file này)
- [x] Types + API client + `productsApi`
- [x] Màn danh sách / chi tiết / form
- [x] Loading / Empty / Error states
- [x] Entry từ Preferences + đăng nhập API (token)
- [x] TanStack Query + Snackbar + PrimaryButton / InputField
- [x] Palette `#2563EB`, nhãn đồng bộ web (`Giá`, `Tồn kho`, `Tạm tắt`…)
- [ ] Wireframe Figma (tùy chọn)
- [ ] E2E test trên thiết bị thật
- [ ] Dark mode đồng bộ toàn module

---

## 8. Ghi chú chạy thử

1. Backend chạy tại port `8088`.
2. Copy `.env.example` → `.env`, chỉnh `EXPO_PUBLIC_API_URL` nếu cần.
3. Đăng nhập bằng tài khoản có quyền `voucher.view|create|update|delete`.
4. Vào **Preferences → Quản lý sản phẩm** hoặc route `/products`.
