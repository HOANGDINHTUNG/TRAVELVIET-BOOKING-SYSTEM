/**
 * Types Booking phía public — map BE DTO.
 *
 * @see backend/src/main/java/com/wedservice/backend/module/bookings/dto/request/CreateBookingRequest.java
 * @see backend/src/main/java/com/wedservice/backend/module/bookings/dto/response/BookingResponse.java
 * @see backend/src/main/java/com/wedservice/backend/module/bookings/dto/response/BookingQuoteResponse.java
 */

export type BookingPassengerCount = {
  adults: number
  children: number
  infants: number
  seniors: number
}

export type BookingQuotePayload = {
  tourId: number
  scheduleId: number
  adults: number
  children?: number
  infants?: number
  seniors?: number
  voucherCode?: string
  comboId?: number
}

export type AppliedVoucherQuote = {
  voucherId?: number | null
  code?: string | null
  name?: string | null
  discountAmount?: number | null
  discountType?: string | null
}

export type AppliedComboQuote = {
  comboId?: number | null
  name?: string | null
  finalPrice?: number | null
}

export type AppliedProductQuote = {
  productId?: number | null
  name?: string | null
  quantity?: number | null
  totalAmount?: number | null
}

export type BookingQuoteResult = {
  tourId: number
  scheduleId: number
  adults: number | null
  children: number | null
  infants: number | null
  seniors: number | null
  seatCount: number | null
  travellerCount: number | null
  subtotalAmount: number | null
  discountAmount: number | null
  voucherDiscountAmount: number | null
  loyaltyDiscountAmount: number | null
  addonAmount: number | null
  productsAmount: number | null
  taxAmount: number | null
  finalAmount: number | null
  currency: string | null
  appliedVoucher?: AppliedVoucherQuote | null
  appliedCombo?: AppliedComboQuote | null
  appliedProducts?: AppliedProductQuote[] | null
}

export type CreateBookingPayload = BookingQuotePayload & {
  contactName: string
  contactPhone: string
  contactEmail?: string
  bookingSource?: string
  specialRequests?: string
}

/** Slim list row from `GET /bookings/me` (Phase 2). */
export type BookingSummaryResponse = {
  id: number
  bookingCode: string | null
  tourTitle: string | null
  totalPrice: number | null
  currency: string | null
  status: string | null
  paymentStatus: string | null
  createdAt: string | null
  travelDate: string | null
}

export type BookingResponse = {
  id: number
  bookingCode: string | null
  orderId: number | null
  tourId: number
  scheduleId: number
  status: string | null
  paymentStatus: string | null
  contactName: string | null
  contactPhone: string | null
  contactEmail: string | null
  adults: number | null
  children: number | null
  infants: number | null
  seniors: number | null
  subtotalAmount: number | null
  discountAmount: number | null
  voucherDiscountAmount: number | null
  loyaltyDiscountAmount: number | null
  addonAmount: number | null
  taxAmount: number | null
  finalAmount: number | null
  voucherId: number | null
  comboId: number | null
  currency: string | null
  bookingSource: string | null
  specialRequests: string | null
  cancelReason: string | null
  cancelledAt: string | null
  completedAt: string | null
  createdAt: string | null
  updatedAt: string | null
}
