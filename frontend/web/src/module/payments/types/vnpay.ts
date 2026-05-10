/**
 * VNPay payment types — map BE DTO.
 *
 * @see backend/src/main/java/com/wedservice/backend/module/payments/dto/request/VnpayCreateCheckoutRequest.java
 * @see backend/src/main/java/com/wedservice/backend/module/payments/dto/response/VnpayCreateCheckoutResponse.java
 */

export type VnpayCreateCheckoutPayload = {
  bookingId: number
  /** BigDecimal ở BE — JSON gửi number (VND, không có thập phân thường gặp). */
  amount: number
}

export type VnpayCreateCheckoutResult = {
  /** Full URL để redirect browser sang cổng VNPay sandbox/production. */
  paymentUrl: string
  paymentId: number
  /** Mã `vnp_TxnRef` BE đã sinh — FE lưu mapping để PaymentReturnPage tra cứu. */
  transactionRef: string
}

/**
 * Bộ Query params VNPay gửi về `vnp_ReturnUrl` sau khi user thanh toán.
 * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html (mục "Trả kết quả về website")
 */
export type VnpayReturnQuery = {
  vnp_ResponseCode?: string | null
  vnp_TransactionStatus?: string | null
  vnp_TxnRef?: string | null
  vnp_Amount?: string | null
  vnp_OrderInfo?: string | null
  vnp_TransactionNo?: string | null
  vnp_PayDate?: string | null
  vnp_BankCode?: string | null
  vnp_CardType?: string | null
  vnp_SecureHash?: string | null
}

/** VNPay trả `00` khi giao dịch thành công. */
export const VNPAY_SUCCESS_CODE = '00'

/** Mã lỗi VNPay phổ biến — phục vụ i18n. */
export const VNPAY_ERROR_CODES: Record<string, string> = {
  '00': 'success',
  '07': 'suspicious',
  '09': 'cardNotEnrolled',
  '10': 'verifyTooMany',
  '11': 'paymentExpired',
  '12': 'cardLocked',
  '13': 'wrongOtp',
  '24': 'cancelled',
  '51': 'insufficient',
  '65': 'overLimit',
  '75': 'bankMaintenance',
  '79': 'wrongPin',
  '99': 'unknown',
}
