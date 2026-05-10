import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Loader2,
  XCircle,
} from 'lucide-react'
import { handleApiError } from '../../../lib/handleApiError'
import { useBookingDetail } from '../hooks/useBookingMutation'
import { formatCurrencyVnd } from '../../management/schedules/utils/currency'
import { useVnpayCheckout } from '../../payments/hooks/useVnpay'
import BookingStatusBadge from '../components/BookingStatusBadge'
import PaymentStatusBadge from '../components/PaymentStatusBadge'
import { isPayable } from '../constants/bookingStatus'

function parseId(value: string | undefined): number | null {
  if (!value) return null
  const id = Number(value)
  return Number.isFinite(id) && id > 0 ? id : null
}

/**
 * Trang xác nhận sau khi đặt chỗ thành công.
 * Route gợi ý: `/booking-confirmation/:bookingId` (có thể alias `/bookings/:id`).
 * Cần `RequireAuthenticated` ở router cha.
 */
function BookingConfirmationPage() {
  const { t } = useTranslation('bookings')
  const params = useParams<{ bookingId?: string; id?: string }>()
  const id = parseId(params.bookingId ?? params.id)

  const query = useBookingDetail(id)
  const vnpayMutation = useVnpayCheckout()

  function handlePayNow() {
    if (!query.data || query.data.finalAmount == null) return
    vnpayMutation.mutate({
      bookingId: query.data.id,
      amount: query.data.finalAmount,
    })
  }

  if (id == null) {
    return <Navigate to="/account" replace />
  }

  if (query.isPending) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" aria-hidden />
        <p className="text-sm text-[var(--color-muted,#64748b)]">
          {String(t('confirmation.loading'))}
        </p>
      </div>
    )
  }

  if (query.error || !query.data) {
    const errorMessage = query.error
      ? handleApiError(query.error, String(t('confirmation.errorMessage')))
      : String(t('confirmation.notFound'))
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <XCircle
          className="mx-auto mb-2 h-10 w-10 text-rose-500"
          aria-hidden
        />
        <h1 className="text-xl font-semibold">
          {String(t('confirmation.errorTitle'))}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted,#64748b)]">
          {errorMessage}
        </p>
      </div>
    )
  }

  const booking = query.data

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl px-4 py-10"
    >
      <Link
        to="/account"
        className="inline-flex items-center gap-1 text-xs text-[var(--color-muted,#64748b)] hover:text-slate-900"
      >
        <ChevronLeft className="h-3 w-3" aria-hidden />
        {String(t('confirmation.back'))}
      </Link>

      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 text-center">
        <CheckCircle2
          className="mx-auto h-10 w-10 text-emerald-600"
          aria-hidden
        />
        <h1 className="mt-2 text-2xl font-bold text-emerald-900">
          {String(t('confirmation.title'))}
        </h1>
        <p className="mt-1 text-sm text-emerald-900/80">
          {String(
            t('confirmation.subtitle', {
              defaultValue: 'Mã đơn: {{code}}',
              code: booking.bookingCode ?? `#${booking.id}`,
            }),
          )}
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-[var(--color-border,#e2e8f0)] bg-white p-4 text-sm">
        <Row label={String(t('confirmation.bookingCode'))}>
          {booking.bookingCode ?? `#${booking.id}`}
        </Row>
        <Row label={String(t('confirmation.tourId'))}>
          #{booking.tourId} · {String(t('confirmation.scheduleId'))}: #
          {booking.scheduleId}
        </Row>
        <Row label={String(t('confirmation.status'))}>
          <span className="inline-flex flex-wrap items-center gap-1">
            <BookingStatusBadge status={booking.status} />
            {booking.paymentStatus ? (
              <PaymentStatusBadge status={booking.paymentStatus} />
            ) : null}
          </span>
        </Row>
        <Row label={String(t('confirmation.passengers'))}>
          {booking.adults ?? 0} {String(t('panel.passengers.adult'))}
          {booking.children ? ` · ${booking.children} ${String(t('panel.passengers.child'))}` : ''}
          {booking.infants ? ` · ${booking.infants} ${String(t('panel.passengers.infant'))}` : ''}
          {booking.seniors ? ` · ${booking.seniors} ${String(t('panel.passengers.senior'))}` : ''}
        </Row>
        <Row label={String(t('confirmation.contact'))}>
          {booking.contactName} · {booking.contactPhone}
          {booking.contactEmail ? ` · ${booking.contactEmail}` : ''}
        </Row>
        <Row label={String(t('confirmation.subtotal'))}>
          {formatCurrencyVnd(booking.subtotalAmount)}
        </Row>
        {booking.voucherDiscountAmount && booking.voucherDiscountAmount > 0 ? (
          <Row label={String(t('confirmation.voucherDiscount'))}>
            -{formatCurrencyVnd(booking.voucherDiscountAmount)}
          </Row>
        ) : null}
        <Row label={String(t('confirmation.total'))}>
          <span className="text-lg font-bold text-[var(--color-primary,#0ea5e9)]">
            {formatCurrencyVnd(booking.finalAmount)}
          </span>
        </Row>
      </dl>

      {isPayable(booking.status, booking.paymentStatus) ? (
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={handlePayNow}
            disabled={vnpayMutation.isPending || booking.finalAmount == null}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary,#0ea5e9)] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-95 disabled:opacity-60"
          >
            {vnpayMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <CreditCard className="h-4 w-4" aria-hidden />
            )}
            {vnpayMutation.isPending
              ? String(t('confirmation.payRedirecting'))
              : String(t('confirmation.payNow'))}
          </button>
          <p className="text-center text-[10px] text-[var(--color-muted,#94a3b8)]">
            {String(t('confirmation.payNote'))}
          </p>
        </div>
      ) : null}

      <p className="mt-4 text-center text-xs text-[var(--color-muted,#64748b)]">
        {String(t('confirmation.disclaimer'))}
      </p>
    </motion.section>
  )
}

type RowProps = {
  label: string
  children: React.ReactNode
}

function Row({ label, children }: RowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
      <dt className="text-xs uppercase tracking-wide text-[var(--color-muted,#64748b)]">
        {label}
      </dt>
      <dd className="text-right text-sm">{children}</dd>
    </div>
  )
}

export default BookingConfirmationPage
