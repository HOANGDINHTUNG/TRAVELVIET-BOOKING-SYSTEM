import { apiClient } from '../../../lib/apiClient'
import type {
  BookingQuotePayload,
  BookingQuoteResult,
  BookingResponse,
  BookingSummaryResponse,
  CreateBookingPayload,
} from '../types/publicBooking'

/**
 * Public Booking API.
 *
 * ⚠️ Auth required: Cả `POST /bookings/quote` lẫn `POST /bookings` đều cần
 * permission `booking.create`. UI phải check `useAuthStore.isAuthenticated`
 * trước khi gọi (xem BookingPanel).
 *
 * @see backend/src/main/java/com/wedservice/backend/module/bookings/controller/BookingController.java
 */

function emptyToUndefined(value: string | undefined): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  return trimmed.length === 0 ? undefined : trimmed
}

function normalizeQuotePayload(input: BookingQuotePayload): BookingQuotePayload {
  return {
    tourId: input.tourId,
    scheduleId: input.scheduleId,
    adults: Math.max(1, Math.floor(input.adults || 1)),
    children: Math.max(0, Math.floor(input.children ?? 0)),
    infants: Math.max(0, Math.floor(input.infants ?? 0)),
    seniors: Math.max(0, Math.floor(input.seniors ?? 0)),
    voucherCode: emptyToUndefined(input.voucherCode),
    comboId: input.comboId,
  }
}

export const PublicBookingsApi = {
  /**
   * `POST /bookings/quote` — server-side authoritative pricing.
   * Trả `appliedVoucher`, `appliedCombo`, `appliedProducts` để hiển thị break-down.
   */
  async quote(payload: BookingQuotePayload): Promise<BookingQuoteResult> {
    const response = await apiClient.post<BookingQuoteResult>(
      'bookings/quote',
      normalizeQuotePayload(payload),
    )
    return response.data
  },

  /**
   * `POST /bookings` — tạo booking mới (auth required).
   * Trả `BookingResponse` với `id`, `bookingCode`, `orderId`, `finalAmount`.
   * UI redirect sang `/bookings/{id}` để hiển thị confirmation.
   */
  async create(payload: CreateBookingPayload): Promise<BookingResponse> {
    const body = {
      ...normalizeQuotePayload(payload),
      contactName: payload.contactName.trim(),
      contactPhone: payload.contactPhone.trim(),
      contactEmail: emptyToUndefined(payload.contactEmail),
      bookingSource: emptyToUndefined(payload.bookingSource) ?? 'web',
      specialRequests: emptyToUndefined(payload.specialRequests),
    }
    const response = await apiClient.post<BookingResponse>('bookings', body)
    return response.data
  },

  /** `GET /bookings/{id}` — lấy chi tiết để hiển thị confirmation. */
  async detail(id: number): Promise<BookingResponse> {
    const response = await apiClient.get<BookingResponse>(`bookings/${id}`)
    return response.data
  },

  /**
   * `GET /bookings/me` — danh sách booking của user hiện tại (auth required,
   * perm `booking.view`).
   *
   * BE trả về `List<BookingSummaryResponse>` — không phân trang.
   */
  async listMine(): Promise<BookingSummaryResponse[]> {
    const response = await apiClient.get<BookingSummaryResponse[]>('bookings/me')
    return response.data
  },

  /**
   * `PATCH /bookings/{id}/cancel` — hủy đơn (perm `booking.cancel`).
   * Body optional: `{ reason: string }`.
   */
  async cancel(id: number, reason?: string): Promise<BookingResponse> {
    const body = reason ? { reason } : undefined
    const response = await apiClient.patch<BookingResponse>(
      `bookings/${id}/cancel`,
      body,
    )
    return response.data
  },
}
