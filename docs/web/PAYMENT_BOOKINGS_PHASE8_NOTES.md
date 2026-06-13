# Phase 8 — VNPay Payment & Booking Management Notes

> Tài liệu này tóm tắt **các quyết định kiến trúc** và **gap ở Backend** mà
> frontend Phase 8 phát hiện được khi xây dựng luồng thanh toán VNPay,
> trang "Đơn của tôi", và backoffice Booking management.

## 1. ⚠️ BE GAP — VNPay return handler (FE-callback verify)

**Hiện trạng:**

| Endpoint | Có/Không | Mục đích |
|----------|----------|----------|
| `POST /payments/vnpay/checkout` | ✅ Auth | FE gọi để lấy `paymentUrl` |
| `GET /payments/vnpay/ipn` | ✅ Public (server-to-server) | VNPay → BE verify checksum & update DB |
| **`GET /payments/vnpay/return`** | ❌ Không có | FE gọi để verify khi user redirect về |

**Quyết định FE — Polling pattern (idempotent):**

Vì BE đã verify qua IPN server-to-server nên FE **KHÔNG cần** verify lại
(và cũng không nên — vi phạm best practice security với checksum). FE chỉ:

1. Đọc query params (`vnp_ResponseCode`, `vnp_TxnRef`, ...) để hiển thị tạm
2. Map `vnp_TxnRef → bookingId` (qua `sessionStorage`, set ở bước Pay)
3. Poll `GET /bookings/{id}` (max 6 lần × 1.5s = 9s) đến khi `paymentStatus`
   chuyển từ `pending` sang `paid|failed`
4. Hiển thị kết quả + nút "Cập nhật ngay" để force refetch nếu IPN chậm

**Lợi ích:**

- ✅ **Idempotent**: User F5 nhiều lần chỉ tốn N lần GET booking — không có
  POST nào, không có race condition
- ✅ **Security**: Checksum chỉ do BE verify, FE không tự xử lý hash
- ✅ **UX tốt**: User thấy ngay phản hồi từ VNPay query params, polling chỉ
  chờ BE confirm cuối

**Đề xuất sửa BE (optional):** Có thể thêm helper `GET /payments/by-txn-ref/{txnRef}`
để FE tra `bookingId` thay vì sessionStorage. FE workaround hiện tại
forward-compatible — chỉ cần đổi `lookupBookingIdByTxnRef`.

## 2. ⚠️ BE GAP — `vnp_TxnRef → bookingId` resolver

**Hiện trạng:** `VnpayCreateCheckoutResponse.transactionRef` là chuỗi BE sinh
ra (định dạng không công khai). FE không thể parse trực tiếp ra `bookingId`.

**FE workaround:**

Khi user click "Pay" → BE trả về `{paymentUrl, transactionRef, paymentId}` →
FE lưu mapping `txnRef → bookingId` vào `sessionStorage` **trước khi**
`window.location.href = paymentUrl`. PaymentReturnPage đọc lại từ session.

```ts
// payments/api/vnpay.api.ts
rememberVnpayTxnRef(data.transactionRef, variables.bookingId)
window.location.href = data.paymentUrl
```

**Edge cases:**

- ✅ Same browser tab/window: `sessionStorage` sống xuyên redirect → OK
- ⚠️ User mở tab khác hoặc clear session: PaymentReturnPage hiển thị thông
  báo "không match được booking" + link "Xem đơn của tôi"
- ✅ F5 trên PaymentReturnPage: re-query sessionStorage, không mất

## 3. ⚠️ BE GAP — Admin search bookings

**Hiện trạng:**

| Endpoint | Có/Không | Mục đích |
|----------|----------|----------|
| `GET /bookings/me` | ✅ Auth | Booking của user hiện tại |
| `GET /bookings/{id}` | ✅ Auth | Detail 1 booking |
| **`GET /admin/bookings`** | ❌ Không có | Admin search toàn hệ thống |

**FE workaround (graceful degradation):**

`ManagementBookingsApi.search()`:
1. Try `GET /admin/bookings` với query params (page, size, status, ...)
2. Nếu BE trả 404/405 → catch, fallback sang `GET /bookings/me`
3. Trả `{ page, fallback: true }` để UI hiển thị warning banner amber:
   *"Backend chưa có endpoint admin search bookings. Tạm thời hiển thị
   danh sách của tài khoản đang đăng nhập."*

Khi BE bổ sung endpoint, **xoá nhánh fallback** trong API — UI tự động hết
warning. Forward-compatible 100%.

**Đề xuất BE:** thêm endpoint với phân trang, filter status, paymentStatus,
date range, customer keyword search:

```java
@GetMapping("/admin/bookings")
@PreAuthorize("hasAuthority('booking.list')")
public ApiResponse<PageResponse<BookingResponse>> searchAdmin(
    @ModelAttribute BookingAdminSearchRequest request
) { ... }
```

## 4. ~~BE GAP — `paymentId` trong BookingResponse~~ (đã giải quyết)

**Cập nhật:** `CreateRefundRequest.java` dùng **`bookingId`** + **`requestedAmount`**
(`BigDecimal`), không yêu cầu `paymentId`. FE đã map đúng payload:

```json
{ "bookingId": 123, "requestedAmount": 1500000, "reasonDetail": "..." }
```

`RefundDialog` gửi `bookingId` từ `booking.id`; nếu `finalAmount` ≤ 0 thì disable form
và hiển thị cảnh báo `bookings.refund.noAmount`.

## 5. Idempotency Matrix (User F5)

| Trang | F5 hành vi | Side-effect? |
|-------|------------|--------------|
| `BookingConfirmationPage` | Re-fetch GET booking | ❌ None |
| `PaymentReturnPage` | Re-poll GET booking, đọc lại query params + session | ❌ None (chỉ GET) |
| `MyBookingsPage` | Re-fetch GET /bookings/me | ❌ None |
| `ManagementBookingsPage` | Re-fetch GET admin/bookings | ❌ None |
| Click Pay button | POST /payments/vnpay/checkout | ⚠️ Tạo VNPay session mới (nhưng OK — VNPay tự dedupe theo bookingId+amount, BE chỉ tạo Payment record mới) |
| Click Cancel/CheckIn/Complete | PATCH /bookings/{id}/... | ⚠️ Idempotent ở BE side (state machine) |

## 6. Re-payment Logic

`isPayable(bookingStatus, paymentStatus)` ở `bookings/constants/bookingStatus.ts`:

- ✅ Cho phép pay khi `paymentStatus ∈ {pending, failed}`
- ✅ Cho phép pay khi `bookingStatus !== cancelled && !== refunded`
- ❌ Không cho pay khi đã `paid`, `refunded`, hoặc booking `cancelled`

UI hiển thị "Pay" hoặc "Pay again" tuỳ `paymentStatus`:
- `pending` → "Thanh toán" / "Pay"
- `failed` → "Thanh toán lại" / "Pay again"

Xuất hiện ở 3 nơi:
- `BookingConfirmationPage` (sau create)
- `MyBookingsPage` (mỗi card)
- `PaymentReturnPage` (khi failure code)

## 7. Routing Phase 8

**Mới:**

| Path | Auth/Public | Page |
|------|-------------|------|
| `/payment/vnpay-return` | Auth | `PaymentReturnPage` (idempotent F5) |
| `/my-bookings` | Auth | `MyBookingsPage` |
| `/management/bookings-v2` | Auth + Manager | `ManagementBookingsPage` |

**Nâng cấp BE đề xuất**: cấu hình `vnp_ReturnUrl` ở BE trỏ về:
```
{FE_BASE_URL}/payment/vnpay-return
```

Set trong `application.yml`:

```yaml
vnpay:
  return-url: ${FRONTEND_BASE_URL}/payment/vnpay-return
```

## 8. i18n keys mới

**`bookings.json`** thêm:
- `status.booking.*` (8 statuses) — used bởi `BookingStatusBadge`
- `status.payment.*` (6 statuses) — used bởi `PaymentStatusBadge`
- `vnpay.toast.checkoutFailed`, `vnpay.errorCodes.*` — VNPay error mapping
- `paymentReturn.*` — full PaymentReturnPage UI
- `myBookings.*` — full MyBookingsPage UI
- `confirmation.payNow`, `confirmation.payRedirecting`, `confirmation.payNote`
- `toast.cancelSuccess`, `toast.cancelFailed`

**`management.json`** thêm:
- `bookings.page.*` — table, filters, confirm dialogs
- `bookings.refund.*` — RefundDialog
- `bookings.toast.*` — action toasts

## 9. Components reusable

| Component | Sử dụng tại |
|-----------|-------------|
| `BookingStatusBadge` | Confirmation, MyBookings, Management table, PaymentReturn |
| `PaymentStatusBadge` | Cùng các nơi trên |
| `useVnpayCheckout` | BookingConfirmation, MyBookings, PaymentReturn (retry) |
| `useBookingPolling` | PaymentReturn |
| `isPayable()` | Quyết định show Pay button ở 3 nơi |

## 10. Tổng kết tác động khi BE cập nhật

| BE update | Sửa FE? |
|-----------|---------|
| Thêm `GET /admin/bookings` | Xoá nhánh fallback trong `ManagementBookingsApi.search()` (1 file, ~10 dòng) |
| Thêm `paymentId` vào `BookingResponse` | RefundDialog auto-enable. Truyền `booking.paymentId` từ ManagementBookingsPage |
| Thêm `GET /payments/by-txn-ref/{txnRef}` | Đổi `lookupBookingIdByTxnRef` thành async + call BE (1 file, ~5 dòng) |
| BE refund body chỉ cần `bookingId` | Đã hỗ trợ — FE gửi `bookingId` + `requestedAmount` |

Tất cả gap ở Phase 8 đều có workaround clean và **forward-compatible**.
