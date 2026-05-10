import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
  CalendarDays,
  CreditCard,
  Eye,
  Loader2,
  PackageX,
  XCircle,
} from 'lucide-react'
import { handleApiError } from '../../../lib/handleApiError'
import {
  useCancelMyBooking,
  useMyBookingsQuery,
} from '../hooks/useBookingMutation'
import { useVnpayCheckout } from '../../payments/hooks/useVnpay'
import {
  formatCurrencyVnd,
  formatDateTime,
} from '../../management/schedules/utils/currency'
import BookingStatusBadge from '../components/BookingStatusBadge'
import PaymentStatusBadge from '../components/PaymentStatusBadge'
import { isPayable } from '../constants/bookingStatus'
import type { BookingResponse } from '../types/publicBooking'

type StatusFilter = 'all' | 'pending' | 'paid' | 'cancelled' | 'completed'

const FILTER_OPTIONS: ReadonlyArray<StatusFilter> = [
  'all',
  'pending',
  'paid',
  'cancelled',
  'completed',
]

function matchesFilter(booking: BookingResponse, filter: StatusFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'pending') {
    return (
      booking.status === 'pending' ||
      booking.paymentStatus === 'pending' ||
      booking.status === 'confirmed'
    )
  }
  if (filter === 'paid') {
    return booking.paymentStatus === 'paid' || booking.status === 'paid'
  }
  return booking.status === filter
}

function MyBookingsPage() {
  const { t } = useTranslation('bookings')
  const query = useMyBookingsQuery()
  const cancelMutation = useCancelMyBooking()
  const vnpayMutation = useVnpayCheckout()

  const [filter, setFilter] = useState<StatusFilter>('all')
  const [confirmingCancelId, setConfirmingCancelId] = useState<number | null>(
    null,
  )

  const bookings = useMemo(() => {
    const list = query.data ?? []
    return [...list]
      .sort((a, b) => {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bd - ad
      })
      .filter((b) => matchesFilter(b, filter))
  }, [query.data, filter])

  function handlePay(booking: BookingResponse) {
    if (booking.finalAmount == null) return
    vnpayMutation.mutate({
      bookingId: booking.id,
      amount: booking.finalAmount,
    })
  }

  function handleConfirmCancel(booking: BookingResponse) {
    cancelMutation.mutate(
      { id: booking.id },
      {
        onSettled: () => setConfirmingCancelId(null),
      },
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-5xl px-4 py-8"
    >
      <header className="mb-4 flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {String(t('myBookings.title'))}
        </h1>
        <p className="text-sm text-[var(--color-muted,#64748b)]">
          {String(t('myBookings.subtitle'))}
        </p>
      </header>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTER_OPTIONS.map((option) => {
          const active = option === filter
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                active
                  ? 'bg-[var(--color-primary,#0ea5e9)] text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {String(t(`myBookings.filters.${option}`))}
            </button>
          )
        })}
      </div>

      {query.isPending ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border,#e2e8f0)] bg-slate-50 px-3 py-12 text-sm text-[var(--color-muted,#64748b)]">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {String(t('myBookings.loading'))}
        </div>
      ) : query.error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center text-sm text-rose-800">
          {handleApiError(query.error, String(t('myBookings.errorMessage')))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border,#e2e8f0)] bg-slate-50 px-4 py-12 text-center text-sm text-[var(--color-muted,#64748b)]">
          <PackageX
            className="mx-auto mb-2 h-8 w-8 text-slate-400"
            aria-hidden
          />
          {String(t('myBookings.empty'))}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isConfirmingCancel={confirmingCancelId === booking.id}
              onRequestCancel={() => setConfirmingCancelId(booking.id)}
              onCancelCancel={() => setConfirmingCancelId(null)}
              onConfirmCancel={() => handleConfirmCancel(booking)}
              isCancelling={
                cancelMutation.isPending &&
                cancelMutation.variables?.id === booking.id
              }
              onPay={() => handlePay(booking)}
              isPaying={
                vnpayMutation.isPending &&
                vnpayMutation.variables?.bookingId === booking.id
              }
            />
          ))}
        </ul>
      )}
    </motion.section>
  )
}

/* -------------------------------------------------------------------------- */

type BookingCardProps = {
  booking: BookingResponse
  isConfirmingCancel: boolean
  isCancelling: boolean
  isPaying: boolean
  onRequestCancel: () => void
  onCancelCancel: () => void
  onConfirmCancel: () => void
  onPay: () => void
}

function BookingCard(props: BookingCardProps) {
  const { t } = useTranslation('bookings')
  const { booking } = props
  const canPay = isPayable(booking.status, booking.paymentStatus)
  const canCancel =
    booking.status === 'pending' || booking.status === 'confirmed'

  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-[var(--color-border,#e2e8f0)] bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-[11px] text-[var(--color-muted,#64748b)]">
              {booking.bookingCode ?? `#${booking.id}`}
            </span>
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {String(t('myBookings.tourLabel'))} #{booking.tourId} ·{' '}
            {String(t('myBookings.scheduleLabel'))} #{booking.scheduleId}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted,#64748b)]">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" aria-hidden />
              {String(t('myBookings.bookedAt'))}:{' '}
              {formatDateTime(booking.createdAt)}
            </span>
            <span>
              {String(t('myBookings.passengers'))}:{' '}
              {(booking.adults ?? 0) +
                (booking.children ?? 0) +
                (booking.infants ?? 0) +
                (booking.seniors ?? 0)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--color-muted,#64748b)]">
            {String(t('myBookings.total'))}
          </div>
          <div className="text-lg font-bold text-[var(--color-primary,#0ea5e9)] tabular-nums">
            {formatCurrencyVnd(booking.finalAmount)}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
        <Link
          to={`/booking-confirmation/${booking.id}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden />
          {String(t('myBookings.viewDetail'))}
        </Link>

        {canPay ? (
          <button
            type="button"
            onClick={props.onPay}
            disabled={props.isPaying}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary,#0ea5e9)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {props.isPaying ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <CreditCard className="h-3.5 w-3.5" aria-hidden />
            )}
            {props.isPaying
              ? String(t('myBookings.payingRedirect'))
              : booking.paymentStatus === 'failed'
                ? String(t('myBookings.payAgain'))
                : String(t('myBookings.payNow'))}
          </button>
        ) : null}

        {canCancel ? (
          props.isConfirmingCancel ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="text-xs text-rose-700">
                {String(t('myBookings.cancelConfirm'))}
              </span>
              <button
                type="button"
                onClick={props.onCancelCancel}
                disabled={props.isCancelling}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium hover:bg-slate-50"
              >
                {String(t('myBookings.cancelKeep'))}
              </button>
              <button
                type="button"
                onClick={props.onConfirmCancel}
                disabled={props.isCancelling}
                className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-60"
              >
                {props.isCancelling ? (
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                ) : null}
                {String(t('myBookings.cancelConfirmYes'))}
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={props.onRequestCancel}
              className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
            >
              <XCircle className="h-3.5 w-3.5" aria-hidden />
              {String(t('myBookings.cancel'))}
            </button>
          )
        ) : null}
      </div>
    </motion.li>
  )
}

export default MyBookingsPage
