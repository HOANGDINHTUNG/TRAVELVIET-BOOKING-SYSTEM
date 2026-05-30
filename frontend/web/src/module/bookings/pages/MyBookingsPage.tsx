import { useDeferredValue, useMemo, useState, useTransition } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Bookmark,
  CalendarDays,
  CheckCircle,
  CreditCard,
  Eye,
  Loader2,
  PackageX,
  XCircle,
} from 'lucide-react'
import { handleApiError } from '../../../lib/handleApiError'
import { useCancelMyBooking, useMyBookingsQuery } from '../hooks/useBookingMutation'
import { useVnpayCheckout } from '../../payments/hooks/useVnpay'
import { formatCurrencyVnd, formatDateTime } from '../../management/schedules/utils/currency'
import BookingStatusBadge from '../components/BookingStatusBadge'
import PaymentStatusBadge from '../components/PaymentStatusBadge'
import { isPayable } from '../constants/bookingStatus'
import type { BookingSummaryResponse } from '../types/publicBooking'
import { CustomerPageHero } from '../../../components/ui/CustomerPageHero/CustomerPageHero'
import { Footer } from '../../../components/Footer/Footer'
import { MyBookingsPageSkeleton } from '../../../components/ui/skeletons/CustomerPageSkeletons'
import { VirtualScrollList } from '../../../components/common/virtual/VirtualScrollList'
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

/** Chiều cao ước lượng mỗi thẻ booking (px) cho virtualizer. */
const BOOKING_CARD_ESTIMATE_PX = 196

function matchesFilter(booking: BookingSummaryResponse, filter: StatusFilter): boolean {
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
  const deferredFilter = useDeferredValue(filter)
  const [isFilterPending, startFilterTransition] = useTransition()
  const [confirmingCancelId, setConfirmingCancelId] = useState<number | null>(null)

  const allBookings = useMemo(() => query.data ?? [], [query.data])

  const bookings = useMemo(() => {
    return [...allBookings]
      .sort((a, b) => {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bd - ad
      })
      .filter((b) => matchesFilter(b, deferredFilter))
  }, [allBookings, deferredFilter])

  const isStaleFilter = filter !== deferredFilter

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

  function handlePay(booking: BookingSummaryResponse) {
    if (booking.totalPrice == null) return
    vnpayMutation.mutate({ bookingId: booking.id, amount: booking.totalPrice })
  }

  function handleConfirmCancel(booking: BookingSummaryResponse) {
    cancelMutation.mutate({ id: booking.id }, { onSettled: () => setConfirmingCancelId(null) })
  }

  function handleFilterChange(next: StatusFilter) {
    startFilterTransition(() => setFilter(next))
  }

  if (query.isPending || (query.error && allBookings.length === 0)) {
    return (
      <>
        <MyBookingsPageSkeleton />
        <Footer />
      </>
    )
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
          <div className="mybk-filters" role="toolbar" aria-label="Lọc theo trạng thái">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`mybk-filter-chip${option === filter ? ' is-active' : ''}`}
                onClick={() => handleFilterChange(option)}
                aria-pressed={option === filter}
              >
                {FILTER_LABELS[option]}
              </button>
            ))}
            <span
              className={`mybk-filter-count${isStaleFilter || isFilterPending ? ' is-pending' : ''}`}
              aria-live="polite"
            >
              {bookings.length} kết quả
              {isStaleFilter || isFilterPending ? ' …' : ''}
            </span>
          </div>

          {query.error ? (
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
            <VirtualScrollList
              items={bookings}
              estimateSize={BOOKING_CARD_ESTIMATE_PX}
              overscan={4}
              getItemKey={(booking) => booking.id}
              className="mybk-virtual-list"
              style={{ maxHeight: 'min(72vh, 720px)' }}
              role="list"
              aria-label="Danh sách chuyến đi"
              renderItem={(booking) => (
                <div className="mybk-virtual-item" role="listitem">
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
                </div>
              )}
            />
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

type BookingCardProps = {
  booking: BookingSummaryResponse
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

  return (
    <article className="mybk-card">
      <div className="mybk-card__body">
        <div className="mybk-card__left">
          <div className="mybk-card__meta-row">
            <span className="mybk-card__code">{booking.bookingCode ?? `#${booking.id}`}</span>
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>

          <p className="mybk-card__title">{booking.tourTitle ?? String(t('myBookings.tourLabel'))}</p>

          <div className="mybk-card__info">
            <span className="mybk-card__info-item">
              <CalendarDays size={13} strokeWidth={2} aria-hidden="true" />
              {booking.travelDate
                ? formatDateTime(booking.travelDate)
                : formatDateTime(booking.createdAt)}
            </span>
          </div>
        </div>

        <div className="mybk-card__amount">
          <div className="mybk-card__amount-label">Tổng tiền</div>
          <div className="mybk-card__amount-value">{formatCurrencyVnd(booking.totalPrice)}</div>
        </div>
      </div>

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
