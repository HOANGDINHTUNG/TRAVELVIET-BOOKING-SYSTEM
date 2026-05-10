import type { BookingResponse } from '../../../bookings/types/publicBooking'

/**
 * Admin Booking — re-use public DTO. BE chưa có endpoint riêng cho admin search,
 * nhưng cấu trúc data giống `BookingResponse` (xem bookings/dto/response).
 *
 * @see backend/src/main/java/com/wedservice/backend/module/bookings/dto/response/BookingResponse.java
 */
export type ManagementBookingResponse = BookingResponse

export type ManagementBookingSearchParams = {
  page?: number
  size?: number
  status?: string
  paymentStatus?: string
  keyword?: string
  sortBy?: 'createdAt' | 'finalAmount' | 'id'
  sortDir?: 'asc' | 'desc'
}

export const DEFAULT_MANAGEMENT_BOOKING_SEARCH: ManagementBookingSearchParams = {
  page: 0,
  size: 20,
  sortBy: 'createdAt',
  sortDir: 'desc',
}

/**
 * `POST /refunds` body — tạo yêu cầu hoàn tiền.
 * @see backend/src/main/java/com/wedservice/backend/module/payments/dto/request/CreateRefundRequest.java
 */
export type CreateRefundPayload = {
  bookingId: number
  requestedAmount: number
  reasonDetail?: string
  reasonType?: string
  requestedBy?: string
}

export type RefundResponse = {
  id: number
  refundCode: string | null
  bookingId: number | null
  status: string | null
  requestedAmount: number | null
}
