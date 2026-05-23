import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
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
import { Footer } from '../../../components/Footer/Footer'
import './PaymentReturn.css'

/**
 * Payment Return Page (route `/payment/vnpay-return`).
 *
 * Security: VNPay checksum verified server-side via IPN. FE only reads
 * query params for display, polls `GET /bookings/{id}` until BE settles.
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

  const reportedAmountVnd = useMemo(() => {
    const raw = vnpay.vnp_Amount
    if (!raw) return null
    const numeric = Number(raw)
    return Number.isFinite(numeric) ? numeric / 100 : null
  }, [vnpay.vnp_Amount])

  const errorCode = vnpay.vnp_ResponseCode ?? '99'
  const errorReasonKey = VNPAY_ERROR_CODES[errorCode] ?? 'unknown'

  const settledStatus = polling.data?.paymentStatus
  const isSettled =
    settledStatus != null && settledStatus !== 'pending' && settledStatus !== ''

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
    vnpayMutation.mutate({ bookingId: polling.data.id, amount: polling.data.finalAmount })
  }

  /* ── Cases ──────────────────────────────────────────────── */

  if (bookingId == null) {
    return (
      <WithLayout>
        <ResultShell
          tone="warn"
          icon={<Loader2 size={28} strokeWidth={1.8} />}
          title={String(t('paymentReturn.lookupFailedTitle'))}
          message={String(t('paymentReturn.lookupFailedMessage'))}
        >
          <div className="pret-actions">
            <Link to="/my-bookings" className="pret-btn pret-btn--primary">
              {String(t('paymentReturn.viewMyBookings'))}
            </Link>
          </div>
        </ResultShell>
      </WithLayout>
    )
  }

  if (polling.isPending) {
    return (
      <WithLayout>
        <ResultShell
          tone="info"
          icon={<Loader2 size={28} strokeWidth={1.8} className="animate-spin" />}
          title={String(t('paymentReturn.pollingTitle'))}
          message={String(t('paymentReturn.pollingMessage'))}
        />
      </WithLayout>
    )
  }

  if (polling.error) {
    return (
      <WithLayout>
        <ResultShell
          tone="error"
          icon={<XCircle size={28} strokeWidth={1.8} />}
          title={String(t('paymentReturn.fetchErrorTitle'))}
          message={String(t('paymentReturn.fetchErrorMessage'))}
        >
          <div className="pret-actions">
            <button type="button" onClick={handleRefresh} className="pret-btn pret-btn--secondary">
              <RefreshCw size={15} strokeWidth={2} aria-hidden="true" />
              {String(t('paymentReturn.refresh'))}
            </button>
          </div>
        </ResultShell>
      </WithLayout>
    )
  }

  const booking = polling.data

  if (!isVnpaySuccess) {
    return (
      <WithLayout>
        <ResultShell
          tone="error"
          icon={<XCircle size={28} strokeWidth={1.8} />}
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
          <div className="pret-actions">
            <Link to="/my-bookings" className="pret-btn pret-btn--secondary">
              {String(t('paymentReturn.viewMyBookings'))}
            </Link>
            {isPayable(booking?.status, booking?.paymentStatus) ? (
              <button
                type="button"
                onClick={handleRetryPay}
                disabled={vnpayMutation.isPending}
                className="pret-btn pret-btn--pay"
              >
                {vnpayMutation.isPending ? (
                  <Loader2 size={15} strokeWidth={2} className="animate-spin" aria-hidden="true" />
                ) : (
                  <CreditCard size={15} strokeWidth={2} aria-hidden="true" />
                )}
                {String(t('paymentReturn.retryPay'))}
              </button>
            ) : null}
          </div>
        </ResultShell>
      </WithLayout>
    )
  }

  if (!isSettled) {
    return (
      <WithLayout>
        <ResultShell
          tone="info"
          icon={<Loader2 size={28} strokeWidth={1.8} className="animate-spin" />}
          title={String(t('paymentReturn.waitingIpnTitle'))}
          message={String(t('paymentReturn.waitingIpnMessage'))}
        >
          <BookingSummary booking={booking} reportedAmountVnd={reportedAmountVnd} />
          <div className="pret-actions">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={polling.isFetching}
              className="pret-btn pret-btn--secondary"
            >
              <RefreshCw
                size={15}
                strokeWidth={2}
                className={polling.isFetching ? 'animate-spin' : ''}
                aria-hidden="true"
              />
              {String(t('paymentReturn.refresh'))}
            </button>
          </div>
        </ResultShell>
      </WithLayout>
    )
  }

  const isPaid = booking?.paymentStatus === 'paid'
  return (
    <WithLayout>
      <ResultShell
        tone={isPaid ? 'success' : 'warn'}
        icon={
          isPaid
            ? <CheckCircle2 size={28} strokeWidth={1.8} />
            : <XCircle size={28} strokeWidth={1.8} />
        }
        title={String(isPaid ? t('paymentReturn.successTitle') : t('paymentReturn.settledNotPaidTitle'))}
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
        <div className="pret-actions">
          <Link to="/my-bookings" className="pret-btn pret-btn--primary">
            {String(t('paymentReturn.viewMyBookings'))}
          </Link>
          {booking ? (
            <Link to={`/booking-confirmation/${booking.id}`} className="pret-btn pret-btn--secondary">
              {String(t('paymentReturn.viewBooking'))}
            </Link>
          ) : null}
        </div>
      </ResultShell>
    </WithLayout>
  )
}

/* ─────────────────────────────────────────────────────────── */

function WithLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="pret-page"
      >
        <div className="pret-inner">{children}</div>
      </motion.div>
      <Footer />
    </>
  )
}

/* ─────────────────────────────────────────────────────────── */

type ResultTone = 'info' | 'success' | 'error' | 'warn'

type ResultShellProps = {
  tone: ResultTone
  icon: ReactNode
  title: string
  message: string
  children?: ReactNode
}

function ResultShell({ tone, icon, title, message, children }: ResultShellProps) {
  return (
    <div className={`pret-shell pret-shell--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <div className="pret-icon" aria-hidden="true">{icon}</div>
      <h1 className="pret-title">{title}</h1>
      <p className="pret-message">{message}</p>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */

type BookingSummaryProps = {
  booking: {
    id: number
    bookingCode: string | null
    status: string | null
    paymentStatus: string | null
    finalAmount: number | null
  } | null | undefined
  reportedAmountVnd: number | null
}

function BookingSummary({ booking, reportedAmountVnd }: BookingSummaryProps) {
  const { t } = useTranslation('bookings')
  if (!booking) return null
  return (
    <dl className="pret-summary">
      <div className="pret-summary-row">
        <dt>{String(t('paymentReturn.summary.bookingCode'))}</dt>
        <dd>{booking.bookingCode ?? `#${booking.id}`}</dd>
      </div>
      <div className="pret-summary-row">
        <dt>{String(t('paymentReturn.summary.status'))}</dt>
        <dd>
          <span className="inline-flex flex-wrap items-center gap-1">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </span>
        </dd>
      </div>
      <div className="pret-summary-row">
        <dt>{String(t('paymentReturn.summary.amount'))}</dt>
        <dd>{formatCurrencyVnd(booking.finalAmount)}</dd>
      </div>
      {reportedAmountVnd != null ? (
        <div className="pret-summary-row">
          <dt>{String(t('paymentReturn.summary.reportedAmount'))}</dt>
          <dd>{formatCurrencyVnd(reportedAmountVnd)}</dd>
        </div>
      ) : null}
    </dl>
  )
}

export default PaymentReturnPage
