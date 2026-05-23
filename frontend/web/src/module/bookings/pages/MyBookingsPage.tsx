import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import {
  Bookmark,
  CalendarDays,
  CheckCircle,
  CreditCard,
  Eye,
  Loader2,
  PackageX,
  Users,
  XCircle,
} from 'lucide-react'
import { handleApiError } from '../../../lib/handleApiError'
import { useCancelMyBooking, useMyBookingsQuery } from '../hooks/useBookingMutation'
import { useVnpayCheckout } from '../../payments/hooks/useVnpay'
import { formatCurrencyVnd, formatDateTime } from '../../management/schedules/utils/currency'
import BookingStatusBadge from '../components/BookingStatusBadge'
import PaymentStatusBadge from '../components/PaymentStatusBadge'
import { isPayable } from '../constants/bookingStatus'
import type { BookingResponse } from '../types/publicBooking'
import { CustomerPageHero } from '../../../components/ui/CustomerPageHero/CustomerPageHero'
import { Footer } from '../../../components/Footer/Footer'
import './MyBookings.css'

type StatusFilter = 'all' | 'pending' | 'paid' | 'cancelled' | 'completed'

const FILTER_OPTIONS: ReadonlyArray<StatusFilter> = ['all', 'pending', 'paid', 'cancelled', 'completed']

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'Tất cả',
  pending: 'Chờ xử lý',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy',
  completed: 'Hoàn thành',
}

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
  const [confirmingCancelId, setConfirmingCancelId] = useState<number | null>(null)

  const allBookings = useMemo(() => query.data ?? [], [query.data])

  const bookings = useMemo(() => {
    return [...allBookings]
      .sort((a, b) => {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bd - ad
      })
      .filter((b) => matchesFilter(b, filter))
  }, [allBookings, filter])

  const heroMetrics = useMemo(() => {
    const total = allBookings.length
    const pending = allBookings.filter(
      (b) => b.status === 'pending' || b.status === 'confirmed',
    ).length
    const completed = allBookings.filter((b) => b.status === 'completed').length
    const cancelled = allBookings.filter((b) => b.status === 'cancelled').length
    return [
      { icon: <Bookmark size={14} strokeWidth={2} />, value: total || '—', label: 'Tổng chuyến đi' },
      { icon: <CalendarDays size={14} strokeWidth={2} />, value: pending || '—', label: 'Chờ xử lý' },
      { icon: <CheckCircle size={14} strokeWidth={2} />, value: completed || '—', label: 'Hoàn thành' },
      { icon: <XCircle size={14} strokeWidth={2} />, value: cancelled || '—', label: 'Đã hủy' },
    ]
  }, [allBookings])

  function handlePay(booking: BookingResponse) {
    if (booking.finalAmount == null) return
    vnpayMutation.mutate({ bookingId: booking.id, amount: booking.finalAmount })
  }

  function handleConfirmCancel(booking: BookingResponse) {
    cancelMutation.mutate({ id: booking.id }, { onSettled: () => setConfirmingCancelId(null) })
  }

  return (
    <>
      <CustomerPageHero
        variant="ocean"
        kicker="Tài khoản của tôi"
        title={String(t('myBookings.title'))}
        lead={String(t('myBookings.subtitle'))}
        metrics={heroMetrics}
      />

      <div className="mybk-page">
        <div className="mybk-inner">
          {/* Filter bar */}
          <div className="mybk-filters" role="toolbar" aria-label="Lọc theo trạng thái">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`mybk-filter-chip${option === filter ? ' is-active' : ''}`}
                onClick={() => setFilter(option)}
                aria-pressed={option === filter}
              >
                {FILTER_LABELS[option]}
              </button>
            ))}
            <span className="mybk-filter-count" aria-live="polite">
              {bookings.length} kết quả
            </span>
          </div>

          {/* Content */}
          {query.isPending ? (
            <div className="mybk-state" role="status" aria-live="polite">
              <span className="mybk-spinner" aria-hidden="true" />
              <p className="mybk-state__desc">{String(t('myBookings.loading'))}</p>
            </div>
          ) : query.error ? (
            <div className="mybk-state mybk-state--error" role="alert">
              <XCircle size={36} strokeWidth={1.4} aria-hidden="true" />
              <p className="mybk-state__title">Không thể tải dữ liệu</p>
              <p className="mybk-state__desc">
                {handleApiError(query.error, String(t('myBookings.errorMessage')))}
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="mybk-state" role="status">
              <PackageX size={36} strokeWidth={1.4} aria-hidden="true" />
              <p className="mybk-state__title">Không có chuyến đi nào</p>
              <p className="mybk-state__desc">{String(t('myBookings.empty'))}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3" aria-label="Danh sách chuyến đi">
              <AnimatePresence initial={false}>
                {bookings.map((booking, index) => (
                  <motion.li
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{
                      duration: 0.28,
                      delay: Math.min(index, 8) * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ '--card-idx': index } as CSSProperties}
                  >
                    <BookingCard
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
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

/* ─────────────────────────────────────────────────────────── */

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
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'

  const passengerCount =
    (booking.adults ?? 0) +
    (booking.children ?? 0) +
    (booking.infants ?? 0) +
    (booking.seniors ?? 0)

  return (
    <article className="mybk-card">
      <div className="mybk-card__body">
        <div className="mybk-card__left">
          {/* Code + badges */}
          <div className="mybk-card__meta-row">
            <span className="mybk-card__code">{booking.bookingCode ?? `#${booking.id}`}</span>
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>

          {/* Title */}
          <p className="mybk-card__title">
            {String(t('myBookings.tourLabel'))} #{booking.tourId}
            {' · '}
            {String(t('myBookings.scheduleLabel'))} #{booking.scheduleId}
          </p>

          {/* Meta */}
          <div className="mybk-card__info">
            <span className="mybk-card__info-item">
              <CalendarDays size={13} strokeWidth={2} aria-hidden="true" />
              {formatDateTime(booking.createdAt)}
            </span>
            <span className="mybk-card__info-item">
              <Users size={13} strokeWidth={2} aria-hidden="true" />
              {passengerCount} hành khách
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="mybk-card__amount">
          <div className="mybk-card__amount-label">Tổng tiền</div>
          <div className="mybk-card__amount-value">{formatCurrencyVnd(booking.finalAmount)}</div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mybk-card__footer">
        <Link
          to={`/booking-confirmation/${booking.id}`}
          className="mybk-btn mybk-btn--view"
          aria-label={`Xem chi tiết booking ${booking.bookingCode ?? booking.id}`}
        >
          <Eye size={14} strokeWidth={2} aria-hidden="true" />
          {String(t('myBookings.viewDetail'))}
        </Link>

        {canPay ? (
          <button
            type="button"
            onClick={props.onPay}
            disabled={props.isPaying}
            className="mybk-btn mybk-btn--pay"
            aria-label={`Thanh toán booking ${booking.bookingCode ?? booking.id}`}
          >
            {props.isPaying ? (
              <Loader2 size={14} strokeWidth={2} className="animate-spin" aria-hidden="true" />
            ) : (
              <CreditCard size={14} strokeWidth={2} aria-hidden="true" />
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
            <span className="inline-flex items-center gap-2">
              <span className="mybk-cancel-confirm-text">
                {String(t('myBookings.cancelConfirm'))}
              </span>
              <button
                type="button"
                onClick={props.onCancelCancel}
                disabled={props.isCancelling}
                className="mybk-btn mybk-btn--neutral"
              >
                {String(t('myBookings.cancelKeep'))}
              </button>
              <button
                type="button"
                onClick={props.onConfirmCancel}
                disabled={props.isCancelling}
                className="mybk-btn mybk-btn--cancel-confirm"
              >
                {props.isCancelling ? (
                  <Loader2 size={13} strokeWidth={2} className="animate-spin" aria-hidden="true" />
                ) : null}
                {String(t('myBookings.cancelConfirmYes'))}
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={props.onRequestCancel}
              className="mybk-btn mybk-btn--cancel"
            >
              <XCircle size={14} strokeWidth={2} aria-hidden="true" />
              {String(t('myBookings.cancel'))}
            </button>
          )
        ) : null}
      </div>
    </article>
  )
}

export default MyBookingsPage
