# Backoffice Tours — Phase 6 Notes (Schedules · Passenger Pricing)

> Tài liệu này mô tả các quyết định kiến trúc và **gap ở Backend** mà frontend
> Phase 6 phát hiện được khi xây dựng module Tour Schedules.

## 1. Adapter `passengerPrices` ↔ flat fields

| Layer | Cấu trúc |
|-------|---------|
| **Backend** (`TourScheduleRequest.java` / `TourScheduleResponse.java`) | Flat fields: `adultPrice`, `childPrice`, `infantPrice`, `seniorPrice` (BigDecimal) |
| **Frontend** (`ScheduleForm` + `useFieldArray`) | `passengerPrices: { passengerType: 'adult'\|'child'\|'infant'\|'senior', price: number }[]` |

**Lý do:** Mảng object UX thân thiện hơn với `useFieldArray` (thêm/xoá/đổi loại
khách); đồng thời phù hợp nghiệp vụ "tour có thể chỉ cấu hình giá cho 1-2 loại
khách".

**Adapter** ở `validation/scheduleSchema.ts`:

- `toSchedulePayload(form)` → gom array → flat trước khi POST/PUT.
- `scheduleResponseToFormDefaults(resp)` → spread flat → array đủ 4 dòng để
  edit-mode render mượt.

Nếu sau này BE muốn đổi sang nested `passengerPrices[]` thật, chỉ cần sửa adapter,
không phải sửa form/UI.

## 2. ⚠️ BE GAP — Không có `DELETE /admin/tours/{tourId}/schedules/{scheduleId}`

| Item | Trạng thái |
|------|-----------|
| `GET /admin/tours/{tourId}/schedules` | ✅ |
| `GET /admin/tours/{tourId}/schedules/{scheduleId}` | ✅ |
| `POST /admin/tours/{tourId}/schedules` | ✅ |
| `PUT /admin/tours/{tourId}/schedules/{scheduleId}` | ✅ |
| `PATCH /admin/tours/{tourId}/schedules/{scheduleId}/status` | ✅ |
| **`DELETE /admin/tours/{tourId}/schedules/{scheduleId}`** | ❌ **Không có** |

**Workaround FE:**
- `ManagementSchedulesApi.cancel({ tourId, scheduleId })` → gọi `PATCH .../status`
  với `{ status: 'cancelled' }`.
- Trong UI, action "Xoá" được đổi tên thành **"Huỷ đợt"**, message confirm có
  ghi rõ: _"Đợt khởi hành sẽ chuyển sang trạng thái 'Đã huỷ'. (Backend chưa hỗ trợ xoá thật.) Bạn có chắc chắn?"_

**Đề xuất sửa BE:** thêm endpoint hard-delete với perm `schedule.delete` (xoá
mềm hoặc hard tuỳ business). Khi có rồi, sửa `ManagementSchedulesApi.cancel`
sang gọi DELETE thật, **không cần đổi UI**.

```java
@DeleteMapping("/{tourId}/schedules/{scheduleId}")
@PreAuthorize("hasAuthority('schedule.delete')")
public ApiResponse<Void> deleteTourSchedule(
        @PathVariable Long tourId,
        @PathVariable Long scheduleId
) {
    tourFacade.deleteTourSchedule(tourId, scheduleId);
    return ApiResponse.success(null, "Tour schedule deleted");
}
```

## 3. Trạng thái `FULL` — derive vs persisted

Backend lưu `bookedSeats`, `capacityTotal`, `remainingSeats` riêng biệt với
`status` enum (`draft/open/closed/full/departed/completed/cancelled`). Vì vậy
có thể tồn tại trường hợp `status='open'` nhưng `bookedSeats >= capacityTotal`.

**Quyết định FE:** `deriveEffectiveStatus(schedule)` ở
`utils/scheduleStatus.ts` tính trạng thái hiển thị:

- Giữ nguyên các trạng thái terminal (`cancelled`, `completed`, `departed`,
  `closed`, `full`).
- Nếu `status='open'` (hoặc `draft`) **và** `bookedSeats ≥ capacityTotal` ⇒
  hiển thị badge `FULL` kèm hậu tố `·auto` để admin biết là "auto-derived"
  (không phải BE đã cập nhật).
- **Không tự gọi PATCH** để tránh side-effect ngoài ý định; admin có thể chủ
  động "Đóng đợt" bằng cách edit và đặt `status='closed'`.

## 4. Cache invalidation

Mỗi mutation (`useCreateSchedule`, `useUpdateSchedule`, `useUpdateScheduleStatus`,
`useCancelSchedule`) đều invalidate:

1. `scheduleKeys.tourList(tourId)` — refresh bảng schedules đang mở.
2. `tourKeys.detail(tourId)` — đề phòng có cache `TourResponse` riêng.
3. `tourKeys.all` — refresh list Tour (số đợt khởi hành tổng quát).

Đảm bảo UI luôn đồng bộ giữa list Tour ngoài ↔ Schedules trong drawer.

## 5. DateTime — input strategy

Backend nhận `LocalDateTime` (Spring) định dạng `YYYY-MM-DDTHH:mm:ss`. FE dùng
native `<input type="datetime-local">` (định dạng `YYYY-MM-DDTHH:mm`) và adapter
`fromDatetimeLocalValue` thêm `:00` giây trước khi submit. Hiển thị dùng
`formatDateTime` (Intl + locale `vi-VN`).

Cross-field: schema `.refine()` đảm bảo `returnAt > departureAt`.

## 6. Currency

`Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` được wrap
ở `utils/currency.ts`. Đồng/lẻ về 0 decimal cho VND. Reuse được ở mọi place hiển
thị giá tour/schedule sau này.

## Tổng kết tác động lên FE khi BE bổ sung

| BE update | Sửa FE? |
|-----------|---------|
| Thêm `DELETE /admin/tours/{tourId}/schedules/{scheduleId}` | Chỉ sửa `ManagementSchedulesApi.cancel` — UI không đổi |
| BE tự sync `status='full'` khi seats đầy | Không cần sửa: badge auto-derived sẽ tự khớp |
| BE đổi pricing sang nested `passengerPrices[]` | Chỉ sửa adapter `toSchedulePayload` / `scheduleResponseToFormDefaults` |
