import {
  getBackendData,
  patchBackendData,
  postBackendData,
} from './serverApiClient'

export type PassengerPayload = {
  fullName: string
  passengerType: 'adult' | 'child' | 'infant' | 'senior' | string
  gender?: string
  dateOfBirth?: string
  identityNo?: string
  passportNo?: string
  phone?: string
  email?: string
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

export type CreateBookingPayload = BookingQuotePayload & {
  userId?: string
  contactName: string
  contactPhone: string
  contactEmail?: string
  passengers?: PassengerPayload[]
}

export type BookingQuote = {
  tourId: number
  scheduleId: number
  adults?: number
  children?: number
  infants?: number
  seniors?: number
  seatCount?: number
  travellerCount?: number
  currency?: string
  subtotalAmount?: number | string
  discountAmount?: number | string
  voucherDiscountAmount?: number | string
  loyaltyDiscountAmount?: number | string
  addonAmount?: number | string
  taxAmount?: number | string
  finalAmount?: number | string
  appliedVoucher?: {
    claimId?: number
    voucherId?: number
    voucherCode?: string
    voucherName?: string
    discountType?: string
    discountValue?: number | string
    maxDiscountAmount?: number | string
  }
  appliedCombo?: {
    comboId?: number
    comboCode?: string
    comboName?: string
    unitPrice?: number | string
    discountAmount?: number | string
    finalPrice?: number | string
  }
}

export type Booking = {
  id: number
  bookingCode?: string
  tourId?: number
  scheduleId?: number
  status?: string
  paymentStatus?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  adults?: number
  children?: number
  infants?: number
  seniors?: number
  subtotalAmount?: number | string
  discountAmount?: number | string
  voucherDiscountAmount?: number | string
  loyaltyDiscountAmount?: number | string
  addonAmount?: number | string
  taxAmount?: number | string
  finalAmount?: number | string
  voucherId?: number
  comboId?: number
  currency?: string
  createdAt?: string
  updatedAt?: string
}

export type BookingStatusHistory = {
  id: number
  oldStatus?: string
  newStatus?: string
  changedBy?: string
  changeReason?: string
  createdAt?: string
}

export type BookingStatusPayload = {
  reason?: string
}

export const bookingApi = {
  quote(payload: BookingQuotePayload) {
    return postBackendData<BookingQuote>('bookings/quote', payload)
  },

  create(payload: CreateBookingPayload) {
    return postBackendData<Booking>('bookings', payload)
  },

  getById(id: number) {
    return getBackendData<Booking>(`bookings/${id}`)
  },

  getMine() {
    return getBackendData<Booking[]>('bookings/me')
  },

  getStatusHistory(id: number) {
    return getBackendData<BookingStatusHistory[]>(`bookings/${id}/status-history`)
  },

  cancel(id: number, payload?: BookingStatusPayload) {
    return patchBackendData<Booking>(`bookings/${id}/cancel`, payload)
  },

  checkIn(id: number, payload?: BookingStatusPayload) {
    return patchBackendData<Booking>(`bookings/${id}/check-in`, payload)
  },

  complete(id: number, payload?: BookingStatusPayload) {
    return patchBackendData<Booking>(`bookings/${id}/complete`, payload)
  },
}
