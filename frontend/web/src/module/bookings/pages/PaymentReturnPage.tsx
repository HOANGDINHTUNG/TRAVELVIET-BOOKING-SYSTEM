import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import {
  forgetVnpayTxnRef,
  lookupBookingIdByTxnRef,
} from '../../payments/api/vnpay.api'
import {
  VNPAY_ERROR_CODES,
  VNPAY_SUCCESS_CODE,
  type VnpayReturnQuery,
} from '../../payments/types/vnpay'
import { useVnpayCheckout } from '../../payments/hooks/useVnpay'
import { useBookingPolling } from '../hooks/useBookingPolling'
import { isPayable } from '../constants/bookingStatus'
import { formatCurrencyVnd } from '../../management/schedules/utils/currency'
import BookingStatusBadge from '../components/BookingStatusBadge'
import PaymentStatusBadge from '../components/PaymentStatusBadge'

/**
 * Payment Return Page (route `/payment/vnpay-return`).
 *
 * 🔐 Security: KHÔNG verify checksum ở FE. BE đã verify qua IPN
 * (`GET /payments/vnpay/ipn` server-to-server). Trang này chỉ:
 *   1. Đọc query params từ VNPay (info-only, không trust)
 *   2. Map `vnp_TxnRef` → `bookingId` (qua sessionStorage)
 *   3. Poll `GET /bookings/{id}` cho đến khi BE cập nhật `paymentStatus`
 *
 * 🔁 Idempotency: F5 không gây side-effect. Chỉ là GET booking thuần.
 *
 * ⏱  Polling: tối đa 6 lần × 1.5s (~9s). Sau đó dừng — user dùng nút
 *    "Cập nhật ngay" để force refetch nếu IPN chậm.
 */
function PaymentReturnPage() {
  const { t } = useTranslation('bookings')
  const [searchParams] = useSearchParams()

  const vnpay = useMemo<VnpayReturnQuery>(() => {
    const get = (key: string) => searchParams.get(key)
    return {
      vnp_ResponseCode: get('vnp_ResponseCode'),
      vnp_TransactionStatus: get('vnp_TransactionStatus'),
      vnp_TxnRef: get('vnp_TxnRef'),
      vnp_Amount: get('vnp_Amount'),
      vnp_OrderInfo: get('vnp_OrderInfo'),
      vnp_TransactionNo: get('vnp_TransactionNo'),
      vnp_PayDate: get('vnp_PayDate'),
      vnp_BankCode: get('vnp_BankCode'),
      vnp_CardType: get('vnp_CardType'),
    }
  }, [searchParams])

  const isVnpaySuccess = vnpay.vnp_ResponseCode === VNPAY_SUCCESS_CODE

  const bookingId = useMemo(
    () => lookupBookingIdByTxnRef(vnpay.vnp_TxnRef),
    [vnpay.vnp_TxnRef],
  )

  const polling = useBookingPolling(bookingId)
  const vnpayMutation = useVnpayCheckout()

  // VNPay gửi amount nhân 100 (đơn vị nhỏ nhất). Chia về VND để hiển thị.
  const reportedAmountVnd = useMemo(() => {
    const raw = vnpay.vnp_Amount
    if (!raw) return null
    const numeric = Number(raw)
    if (!Number.isFinite(numeric)) return null
    return numeric / 100
  }, [vnpay.vnp_Amount])

  const errorCode = vnpay.vnp_ResponseCode ?? '99'
  const errorReasonKey = VNPAY_ERROR_CODES[errorCode] ?? 'unknown'

  const settledStatus = polling.data?.paymentStatus
  const isSettled =
    settledStatus != null && settledStatus !== 'pending' && settledStatus !== ''

  // Cleanup mapping `txnRef → bookingId` sau khi BE đã settle. Side-effect
  // ngoài React, dùng useEffect để không chạy lúc render.
  useEffect(() => {
    if (isSettled && vnpay.vnp_TxnRef) {
      forgetVnpayTxnRef(vnpay.vnp_TxnRef)
    }
  }, [isSettled, vnpay.vnp_TxnRef])

  function handleRefresh() {
    void polling.refetch()
  }

  function handleRetryPay() {
    if (!polling.data || polling.data.finalAmount == null) return
    vnpayMutation.mutate({
      bookingId: polling.data.id,
      amount: polling.data.finalAmount,
    })
  }

  /* ----------------------------- Render shells ----------------------------- */

  // Trường hợp không tìm thấy bookingId (sessionStorage bị xoá hoặc browser khác)
  if (bookingId == null) {
    return (
      <ResultShell
        tone="warn"
        Icon={Loader2}
        title={String(t('paymentReturn.lookupFailedTitle'))}
        message={String(t('paymentReturn.lookupFailedMessage'))}
      >
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {String(t('paymentReturn.viewMyBookings'))}
        </Link>
      </ResultShell>
    )
  }

  // Đang polling lần đầu
  if (polling.isPending) {
    return (
      <ResultShell
        tone="info"
        Icon={Loader2}
        iconClassName="animate-spin"
        title={String(t('paymentReturn.pollingTitle'))}
        message={String(t('paymentReturn.pollingMessage'))}
      />
    )
  }

  if (polling.error) {
    return (
      <ResultShell
        tone="error"
        Icon={XCircle}
        title={String(t('paymentReturn.fetchErrorTitle'))}
        message={String(t('paymentReturn.fetchErrorMessage'))}
      >
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          {String(t('paymentReturn.refresh'))}
        </button>
      </ResultShell>
    )
  }

  const booking = polling.data

  /* ----------------------- Trường hợp VNPay báo fail ----------------------- */
  if (!isVnpaySuccess) {
    return (
      <ResultShell
        tone="error"
        Icon={XCircle}
        title={String(t('paymentReturn.failureTitle'))}
        message={String(
          t('paymentReturn.failureMessage', {
            defaultValue: 'Mã lỗi: {{code}} ({{reason}})',
            code: errorCode,
            reason: String(t(`vnpay.errorCodes.${errorReasonKey}`)),
          }),
        )}
      >
        <BookingSummary booking={booking} reportedAmountVnd={reportedAmountVnd} />
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/my-bookings"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {String(t('paymentReturn.viewMyBookings'))}
          </Link>
          {isPayable(booking?.status, booking?.paymentStatus) ? (
            <button
              type="button"
              onClick={handleRetryPay}
              disabled={vnpayMutation.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--color-primary,#0ea5e9)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {vnpayMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <CreditCard className="h-4 w-4" aria-hidden />
              )}
              {String(t('paymentReturn.retryPay'))}
            </button>
          ) : null}
        </div>
      </ResultShell>
    )
  }

  /* ---------------- Trường hợp VNPay báo success — chờ IPN -----------------*/
  if (!isSettled) {
    return (
      <ResultShell
        tone="info"
        Icon={Loader2}
        iconClassName="animate-spin"
        title={String(t('paymentReturn.waitingIpnTitle'))}
        message={String(t('paymentReturn.waitingIpnMessage'))}
      >
        <BookingSummary booking={booking} reportedAmountVnd={reportedAmountVnd} />
        <button
          type="button"
          onClick={handleRefresh}
          disabled={polling.isFetching}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${polling.isFetching ? 'animate-spin' : ''}`}
            aria-hidden
          />
          {String(t('paymentReturn.refresh'))}
        </button>
      </ResultShell>
    )
  }

  /* --------------- Trường hợp BE đã settle — hiển thị kết quả -------------- */
  const isPaid = booking?.paymentStatus === 'paid'
  return (
    <ResultShell
      tone={isPaid ? 'success' : 'warn'}
      Icon={isPaid ? CheckCircle2 : XCircle}
      title={String(
        isPaid
          ? t('paymentReturn.successTitle')
          : t('paymentReturn.settledNotPaidTitle'),
      )}
      message={String(
        isPaid
          ? t('paymentReturn.successMessage')
          : t('paymentReturn.settledNotPaidMessage', {
              defaultValue: 'Trạng thái hiện tại: {{status}}',
              status: booking?.paymentStatus ?? '',
            }),
      )}
    >
      <BookingSummary booking={booking} reportedAmountVnd={reportedAmountVnd} />
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {String(t('paymentReturn.viewMyBookings'))}
        </Link>
        {booking ? (
          <Link
            to={`/booking-confirmation/${booking.id}`}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {String(t('paymentReturn.viewBooking'))}
          </Link>
        ) : null}
      </div>
    </ResultShell>
  )
}

/* -------------------------------------------------------------------------- */

type ResultTone = 'info' | 'success' | 'error' | 'warn'

const TONE_CLASS: Record<ResultTone, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  warn: 'border-amber-200 bg-amber-50 text-amber-900',
}

const ICON_TONE: Record<ResultTone, string> = {
  info: 'text-sky-600',
  success: 'text-emerald-600',
  error: 'text-rose-600',
  warn: 'text-amber-600',
}

type ResultShellProps = {
  tone: ResultTone
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  iconClassName?: string
  title: string
  message: string
  children?: React.ReactNode
}

function ResultShell(props: ResultShellProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl px-4 py-12"
    >
      <div
        className={`flex flex-col items-center gap-3 rounded-2xl border p-6 text-center ${TONE_CLASS[props.tone]}`}
      >
        <props.Icon
          className={`h-10 w-10 ${ICON_TONE[props.tone]} ${props.iconClassName ?? ''}`}
          aria-hidden
        />
        <h1 className="text-xl font-bold">{props.title}</h1>
        <p className="text-sm opacity-90">{props.message}</p>
        {props.children}
      </div>
    </motion.section>
  )
}

type BookingSummaryProps = {
  booking:
    | {
        id: number
        bookingCode: string | null
        status: string | null
        paymentStatus: string | null
        finalAmount: number | null
      }
    | null
    | undefined
  reportedAmountVnd: number | null
}

function BookingSummary({ booking, reportedAmountVnd }: BookingSummaryProps) {
  const { t } = useTranslation('bookings')
  if (!booking) return null
  return (
    <dl className="mt-3 w-full max-w-md space-y-1.5 rounded-xl bg-white/80 p-3 text-left text-xs text-slate-800 ring-1 ring-slate-200">
      <SummaryRow label={String(t('paymentReturn.summary.bookingCode'))}>
        {booking.bookingCode ?? `#${booking.id}`}
      </SummaryRow>
      <SummaryRow label={String(t('paymentReturn.summary.status'))}>
        <span className="inline-flex flex-wrap items-center gap-1">
          <BookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </span>
      </SummaryRow>
      <SummaryRow label={String(t('paymentReturn.summary.amount'))}>
        {formatCurrencyVnd(booking.finalAmount)}
      </SummaryRow>
      {reportedAmountVnd != null ? (
        <SummaryRow label={String(t('paymentReturn.summary.reportedAmount'))}>
          {formatCurrencyVnd(reportedAmountVnd)}
        </SummaryRow>
      ) : null}
    </dl>
  )
}

function SummaryRow(props: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[10px] uppercase tracking-wide text-slate-500">
        {props.label}
      </dt>
      <dd className="text-right">{props.children}</dd>
    </div>
  )
}

export default PaymentReturnPage
