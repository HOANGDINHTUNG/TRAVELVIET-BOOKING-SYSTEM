import { apiClient } from '../../../../lib/apiClient'
import { ApiClientError, type PageResponse } from '../../../../types/api'
import { PublicBookingsApi } from '../../../bookings/api/publicBookings.api'
import type {
  BookingResponse,
  BookingSummaryResponse,
} from '../../../bookings/types/publicBooking'
import type {
  CreateRefundPayload,
  ManagementBookingResponse,
  ManagementBookingSearchParams,
  RefundResponse,
} from '../types/managementBooking'

/**
 * Build query params bỏ undefined/null/''.
 */
function toQueryParams(
  params: ManagementBookingSearchParams,
): Record<string, string> {
  const output: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    output[key] = String(value)
  }
  return output
}

/**
 * Quy ước hợp nhất kết quả list giữa "page" và "array".
 */
/** Fallback `GET /bookings/me` trả summary — map tối thiểu cho bảng admin. */
function summaryAsManagementRow(
  row: BookingSummaryResponse,
): ManagementBookingResponse {
  return {
    id: row.id,
    bookingCode: row.bookingCode,
    orderId: null,
    tourId: 0,
    scheduleId: 0,
    status: row.status,
    paymentStatus: row.paymentStatus,
    contactName: null,
    contactPhone: null,
    contactEmail: null,
    adults: null,
    children: null,
    infants: null,
    seniors: null,
    subtotalAmount: null,
    discountAmount: null,
    voucherDiscountAmount: null,
    loyaltyDiscountAmount: null,
    addonAmount: null,
    taxAmount: null,
    finalAmount: row.totalPrice,
    voucherId: null,
    comboId: null,
    currency: row.currency,
    bookingSource: null,
    specialRequests: null,
    cancelReason: null,
    cancelledAt: null,
    completedAt: null,
    createdAt: row.createdAt,
    updatedAt: null,
  }
}

function toPage<T>(input: PageResponse<T> | T[]): PageResponse<T> {
  if (Array.isArray(input)) {
    return {
      content: input,
      page: 0,
      size: input.length,
      totalElements: input.length,
      totalPages: 1,
      last: true,
    }
  }
  return input
}

export const ManagementBookingsApi = {
  /**
   * Admin search bookings.
   *
   * ⚠️ BE GAP: Hiện tại BE chỉ expose `GET /bookings/me` (chỉ trả booking của
   * user đang login). KHÔNG có `GET /admin/bookings` cho admin search toàn hệ
   * thống. Workaround:
   *   1. Thử `GET /admin/bookings` (giả định BE sẽ bổ sung)
   *   2. Nếu 404 → fallback `GET /bookings/me` (admin sẽ chỉ thấy booking của
   *      bản thân) + đánh dấu để UI hiển thị warning
   *
   * Forward-compat: khi BE thêm endpoint, chỉ cần xoá nhánh fallback.
   */
  async search(
    params: ManagementBookingSearchParams = {},
  ): Promise<{
    page: PageResponse<ManagementBookingResponse>
    fallback: boolean
  }> {
    const merged = { ...params }
    try {
      const response = await apiClient.get<
        PageResponse<ManagementBookingResponse> | ManagementBookingResponse[]
      >('admin/bookings', { params: toQueryParams(merged) })
      return { page: toPage(response.data), fallback: false }
    } catch (error) {
      const isNotFound =
        error instanceof ApiClientError &&
        (error.httpStatus === 404 || error.httpStatus === 405)
      if (!isNotFound) throw error
      const fallbackList = await PublicBookingsApi.listMine()
      const mapped = fallbackList.map(summaryAsManagementRow)
      return { page: toPage(mapped), fallback: true }
    }
  },

  /**
   * `PATCH /bookings/{id}/cancel` — Admin/User cancel.
   * Body optional: `{ reason }`.
   */
  async cancel(id: number, reason?: string): Promise<BookingResponse> {
    const body = reason ? { reason } : undefined
    const response = await apiClient.patch<BookingResponse>(
      `bookings/${id}/cancel`,
      body,
    )
    return response.data
  },

  /** `PATCH /bookings/{id}/check-in` — perm `booking.checkin`. */
  async checkIn(id: number, reason?: string): Promise<BookingResponse> {
    const body = reason ? { reason } : undefined
    const response = await apiClient.patch<BookingResponse>(
      `bookings/${id}/check-in`,
      body,
    )
    return response.data
  },

  /** `PATCH /bookings/{id}/complete` — perm `booking.update`. */
  async complete(id: number, reason?: string): Promise<BookingResponse> {
    const body = reason ? { reason } : undefined
    const response = await apiClient.patch<BookingResponse>(
      `bookings/${id}/complete`,
      body,
    )
    return response.data
  },

  /**
   * `POST /refunds` — tạo refund request (perm `refund.create`).
   * @see backend/src/main/java/com/wedservice/backend/module/payments/controller/RefundController.java
   */
  async createRefund(payload: CreateRefundPayload): Promise<RefundResponse> {
    const body = {
      bookingId: payload.bookingId,
      requestedAmount: payload.requestedAmount,
      reasonDetail: payload.reasonDetail,
      reasonType: payload.reasonType,
      requestedBy: payload.requestedBy,
    }
    const response = await apiClient.post<RefundResponse>('refunds', body)
    return response.data
  },
}
