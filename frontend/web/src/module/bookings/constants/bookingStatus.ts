/**
 * Booking & Payment status enums (theo BE entity values).
 *
 * @see backend/src/main/java/com/wedservice/backend/module/bookings/entity/Booking.java
 * @see backend/src/main/java/com/wedservice/backend/module/payments/entity/Payment.java
 */

export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'paid',
  'cancelled',
  'checked_in',
  'completed',
  'no_show',
  'refunded',
] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export const PAYMENT_STATUSES = [
  'pending',
  'processing',
  'paid',
  'failed',
  'refunded',
  'partially_refunded',
] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export function isBookingStatus(value: unknown): value is BookingStatus {
  return (
    typeof value === 'string' &&
    (BOOKING_STATUSES as readonly string[]).includes(value)
  )
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return (
    typeof value === 'string' &&
    (PAYMENT_STATUSES as readonly string[]).includes(value)
  )
}

/** Cho phép user re-pay khi BE trả về các trạng thái này. */
export const RE_PAYABLE_PAYMENT_STATUSES: ReadonlyArray<PaymentStatus> = [
  'pending',
  'failed',
]

export function isPayable(
  bookingStatus: string | null | undefined,
  paymentStatus: string | null | undefined,
): boolean {
  if (
    !paymentStatus ||
    !RE_PAYABLE_PAYMENT_STATUSES.includes(paymentStatus as PaymentStatus)
  ) {
    return false
  }
  // Đã hủy thì không cho thanh toán nữa
  if (bookingStatus === 'cancelled' || bookingStatus === 'refunded') return false
  return true
}
