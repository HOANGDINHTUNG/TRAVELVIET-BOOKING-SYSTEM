import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { handleApiError } from '../../../lib/handleApiError'
import { VnpayApi, rememberVnpayTxnRef } from '../api/vnpay.api'
import type {
  VnpayCreateCheckoutPayload,
  VnpayCreateCheckoutResult,
} from '../types/vnpay'

type VnpayCheckoutOptions = {
  /** Tự redirect tới `paymentUrl` sau khi BE trả về. Mặc định `true`. */
  autoRedirect?: boolean
} & Omit<
  UseMutationOptions<
    VnpayCreateCheckoutResult,
    unknown,
    VnpayCreateCheckoutPayload
  >,
  'mutationFn'
>

/**
 * Hook tạo VNPay checkout. Sau khi BE trả `paymentUrl`:
 * - Lưu mapping `txnRef → bookingId` vào sessionStorage (cho PaymentReturnPage)
 * - Redirect `window.location.href = paymentUrl` (full navigation, rời app)
 */
export function useVnpayCheckout(options: VnpayCheckoutOptions = {}) {
  const { t } = useTranslation('bookings')
  const { autoRedirect = true, onSuccess, onError, ...rest } = options

  return useMutation<
    VnpayCreateCheckoutResult,
    unknown,
    VnpayCreateCheckoutPayload
  >({
    mutationFn: (payload) => VnpayApi.createCheckout(payload),
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      rememberVnpayTxnRef(data.transactionRef, variables.bookingId)
      onSuccess?.(data, variables, context, mutation)
      if (autoRedirect && data.paymentUrl) {
        window.location.href = data.paymentUrl
      }
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('vnpay.toast.checkoutFailed', {
          defaultValue: 'Không khởi tạo được phiên thanh toán VNPay.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}
