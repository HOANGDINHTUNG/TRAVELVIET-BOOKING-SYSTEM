import { apiClient } from '../../../lib/apiClient'
import type {
  VnpayCreateCheckoutPayload,
  VnpayCreateCheckoutResult,
} from '../types/vnpay'

/**
 * VNPay API client.
 *
 * @see backend/src/main/java/com/wedservice/backend/module/payments/controller/VnpayController.java
 *
 * Notes về kiến trúc VNPay:
 * - BE handle IPN (server-to-server) tại `GET /payments/vnpay/ipn` để verify
 *   checksum và update DB → FE **KHÔNG** cần gọi verify endpoint.
 * - FE chỉ cần (1) gọi `POST /payments/vnpay/checkout` để lấy URL redirect,
 *   (2) sau khi user redirect lại từ VNPay → poll `GET /bookings/{id}` đến khi
 *   `paymentStatus` cập nhật.
 */
export const VnpayApi = {
  /**
   * `POST /payments/vnpay/checkout` — tạo URL thanh toán cho 1 booking.
   * Auth required.
   */
  async createCheckout(
    payload: VnpayCreateCheckoutPayload,
  ): Promise<VnpayCreateCheckoutResult> {
    const response = await apiClient.post<VnpayCreateCheckoutResult>(
      'payments/vnpay/checkout',
      {
        bookingId: payload.bookingId,
        amount: payload.amount,
      },
    )
    return response.data
  },
}

/* -------------------------------------------------------------------------- */
/*                FE-side mapping `txnRef → bookingId` (sessionStorage)       */
/* -------------------------------------------------------------------------- */

/**
 * ⚠️ BE GAP: Không có endpoint `GET /payments/by-txn-ref/{vnp_TxnRef}` để FE
 * tra cứu bookingId từ `vnp_TxnRef` query param. Workaround: lưu mapping vào
 * `sessionStorage` ngay khi user nhấn "Pay" (trước redirect). PaymentReturnPage
 * sẽ tra ngược.
 *
 * Khi BE bổ sung endpoint, swap helper này sang call BE — UI không đổi.
 */
const STORAGE_KEY = 'vnpay:txnRef-to-bookingId'

type TxnRefMap = Record<string, number>

function readMap(): TxnRefMap {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object') {
      return parsed as TxnRefMap
    }
    return {}
  } catch {
    return {}
  }
}

function writeMap(map: TxnRefMap) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // sessionStorage có thể bị tắt (private mode) — bỏ qua, fallback về null lookup
  }
}

export function rememberVnpayTxnRef(txnRef: string, bookingId: number): void {
  if (!txnRef || !bookingId) return
  const map = readMap()
  map[txnRef] = bookingId
  writeMap(map)
}

export function lookupBookingIdByTxnRef(txnRef: string | null | undefined): number | null {
  if (!txnRef) return null
  const map = readMap()
  const value = map[txnRef]
  return typeof value === 'number' && value > 0 ? value : null
}

export function forgetVnpayTxnRef(txnRef: string): void {
  if (!txnRef) return
  const map = readMap()
  if (txnRef in map) {
    delete map[txnRef]
    writeMap(map)
  }
}
