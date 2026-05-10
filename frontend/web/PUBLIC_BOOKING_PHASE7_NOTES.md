# Public Catalog & Booking — Phase 7 Notes

> Tài liệu này tóm tắt **các quyết định kiến trúc** và **gap ở Backend** mà
> frontend Phase 7 phát hiện được khi xây dựng luồng public từ catalog → tour
> detail → booking → confirmation.

## 1. ⚠️ BE GAP — Không có `GET /tours/by-slug/{slug}`

| Item | Trạng thái |
|------|-----------|
| `GET /tours` (search) | ✅ Public, có `slug` trong response |
| `GET /tours/{id}` (numeric) | ✅ Public |
| **`GET /tours/by-slug/{slug}`** | ❌ Không có |

**Quyết định FE — slug encode pattern:**

URL public dùng pattern `/tour/<slug>-<id>` (encode id ở cuối, kiểu Tiki / Booking.com).

- Ví dụ: `/tour/halong-bay-3-days-2-nights-42` (slug = `halong-bay-3-days-2-nights`, id = 42)
- Helper `extractTourIdFromSlug()` parse `-(\d+)$` → number, fallback chấp nhận numeric thuần (`/tour/42`)
- Helper `buildTourSlug(slug, id)` để TourListPage build links forward-compatible
- Khi BE bổ sung endpoint `/tours/by-slug/{slug}`, chỉ cần đổi resolver trong `usePublicTours` — UI không cần thay đổi

**Lý do chọn pattern này:**

1. **SEO-friendly**: Google index tốt với slug-trong-URL
2. **Robust**: Slug đổi không ảnh hưởng — id vẫn unique
3. **Stateless**: Không cần round-trip search-by-slug
4. **Forward-compatible**: Khi BE thêm endpoint by-slug, chỉ thay 1 dòng code

**Đề xuất sửa BE:**

```java
@GetMapping("/by-slug/{slug}")
public ApiResponse<TourResponse> getTourBySlug(@PathVariable String slug) {
    return ApiResponse.success(tourFacade.getTourBySlug(slug));
}
```

Khi sẵn, có thể thêm 301 redirect `/tour/<slug>-<id>` → `/tour/<slug>` ở FE để SEO sạch hơn.

## 2. ⚠️ BE GAP — Không có `POST /vouchers/validate`

| Item | Trạng thái |
|------|-----------|
| `GET /users/me/vouchers` | ✅ Auth, danh sách voucher đã claim |
| `POST /vouchers/claim` | ✅ Auth, claim voucher mới |
| `POST /bookings/quote` (voucherCode) | ✅ Auth, **đã implicit validate** voucher khi quote |
| **`POST /vouchers/validate`** | ❌ Không có endpoint riêng |

**Quyết định FE — re-quote pattern:**

Thay vì gọi `POST /vouchers/validate` riêng, FE dùng `POST /bookings/quote` với
`voucherCode` để vừa validate vừa lấy giá break-down chính xác:

- Nhập mã voucher → "Apply" → re-trigger debounced quote (`useBookingQuote`)
- Đọc `quoteData.appliedVoucher.discountAmount`:
  - `> 0` → voucher hợp lệ, hiển thị badge xanh + số tiền giảm
  - `null` hoặc `0` → voucher không hợp lệ / không áp dụng được, hiển thị thông báo đỏ
- Không cần state riêng cho voucher validation; tận dụng cache TanStack Query

**Lợi ích:**

- BE chỉ cần duy trì 1 nguồn sự thật (`bookings/quote` đã có logic validate)
- Tránh trường hợp `validate` báo OK nhưng `quote/create` reject (race conditions)
- FE đơn giản: mỗi lần đổi counts/voucher đều quote lại

Nếu sau này BE muốn endpoint validate độc lập (ví dụ cho UX "preview voucher
trước khi chọn schedule"), chỉ cần thêm helper mới mà không phá luồng hiện tại.

## 3. Pricing 2 lớp (instant + authoritative)

`BookingPanel` hiển thị 2 nguồn pricing:

| Lớp | Nguồn | Khi nào dùng |
|-----|-------|--------------|
| **Instant preview** | Client-side multiply: `count × schedule.{adult/child/infant/senior}Price` | Hiện ngay khi user đổi counts (UX không lag) |
| **Authoritative** | `POST /bookings/quote` (debounce 400ms) | Cập nhật `finalAmount`, áp voucher discount, tax, addon |

Khi BE quote còn fetch (loading), preview client-side vẫn hiển thị; khi quote
trả về, `finalAmount` thay thế. Spinner nhỏ cạnh "Tổng cộng" báo cho user biết
đang đồng bộ với BE.

## 4. Auth gate cho Booking

- **Browse**: Public, không cần auth
- **`POST /bookings/quote`** + **`POST /bookings`**: Auth required (perm `booking.create`)

**FE strategy:**

- Trang detail mở public — user vô tư xem
- `BookingPanel.useBookingQuote()` chỉ enable khi `isAuthenticated` → tránh gọi
  quote endpoint khi chưa login (sẽ 401 vô nghĩa)
- Nút Submit:
  - Chưa login → text "Đăng nhập để đặt chỗ" + icon `LogIn`, click → toast
    + `navigate('/login', { state: { from: currentPath } })`
  - Đã login → text "Đặt ngay" + icon spinner khi `isPending`
- Sau create thành công → `navigate('/booking-confirmation/{id}')` (route đã
  bọc trong `RequireAuthenticated`)

## 5. Routing thay đổi

**Mới (Phase 7):**

| Path | Public/Auth | Page |
|------|-------------|------|
| `/tour/:slug` | **PUBLIC** | `TourPublicDetailPage` |
| `/booking-confirmation/:bookingId` | Auth | `BookingConfirmationPage` |

**Giữ nguyên (legacy, không phá):**

- `/tours/:id` (auth) → `TourDetailPage` cũ
- `/bookings/:id` (auth) → `BookingDetailPage` cũ
- `/tours` (public list) → `ToursPage` cũ

⚠️ ToursPage cũ link tới `/tours/:id`. Khi cần migrate sang public flow, chỉ
cần update link build sang `/tour/${buildTourSlug(tour.slug, tour.id)}`.

## 6. i18n namespaces mới

Thêm vào `lib/i18n.ts`:

```ts
export const SPLIT_NAMESPACES = ['auth', 'management', 'errors', 'tours', 'bookings']
```

Files:
- `public/locales/{vi,en}/tours.json` — `detail.*`, `detail.itinerary.*`, `detail.schedules.*`
- `public/locales/{vi,en}/bookings.json` — `panel.*`, `confirmation.*`, `toast.*`

## 7. Performance & UX

- **Lazy images**: `<img loading="lazy" />` trong gallery + thumbnail strip
- **`keepPreviousData`** ở `useTourListQuery` để pagination không nhảy layout
- **Debounce quote** 400ms tránh spam BE khi user đổi counts liên tục
- **Motion**: `motion/react` cho fade-in itinerary (whileInView), schedule
  selector (whileTap), gallery transition (initial/animate). Tất cả nhẹ —
  duration ≤ 0.35s, không block render
- **i18n**: BE đã honor `Accept-Language` qua interceptor → text Tour trả đúng
  ngôn ngữ user chọn

## 8. Tổng kết tác động khi BE cập nhật

| BE update | Sửa FE? |
|-----------|---------|
| Thêm `GET /tours/by-slug/{slug}` | Chỉ thay resolver `extractTourIdFromSlug` → call BE |
| Thêm `POST /vouchers/validate` | Optional — có thể tạo `useValidateVoucher` mới, giữ nguyên flow re-quote |
| Thêm field gì đó vào `BookingResponse` | Cập nhật `publicBooking.ts` types và confirmation page hiển thị |

Tất cả gap ở phase này đều có workaround clean và **forward-compatible**.
