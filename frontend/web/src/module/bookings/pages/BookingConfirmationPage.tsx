import type { ReactNode } from 'react'
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
import { formatCurrencyVnd } from '@/utils/currency'
import { useVnpayCheckout } from '../../payments/hooks/useVnpay'
import BookingStatusBadge from '../components/BookingStatusBadge'
import PaymentStatusBadge from '../components/PaymentStatusBadge'
import { isPayable } from '../constants/bookingStatus'
import { Footer } from '../../../components/Footer/Footer'
import './BookingConfirmation.css'

function parseId(value: string | undefined): number | null {
  if (!value) return null
  const id = Number(value)
  return Number.isFinite(id) && id > 0 ? id : null
}

function BookingConfirmationPage() {
  const { t } = useTranslation('bookings')
  const params = useParams<{ bookingId?: string; id?: string }>()
  const id = parseId(params.bookingId ?? params.id)

  const query = useBookingDetail(id)
  const vnpayMutation = useVnpayCheckout()

  function handlePayNow() {
    if (!query.data || query.data.finalAmount == null) return
    vnpayMutation.mutate({ bookingId: query.data.id, amount: query.data.finalAmount })
  }

  if (id == null) return <Navigate to="/account" replace />

  if (query.isPending) {
    return (
      <div className="bkconf-state">
        <span className="bkconf-spinner" aria-hidden="true" />
        <p>{String(t('confirmation.loading'))}</p>
      </div>
    )
  }

  if (query.error || !query.data) {
    const errorMessage = query.error
      ? handleApiError(query.error, String(t('confirmation.errorMessage')))
      : String(t('confirmation.notFound'))
    return (
      <div className="bkconf-state bkconf-state--error" role="alert">
        <XCircle size={40} strokeWidth={1.4} aria-hidden="true" />
        <p style={{ fontWeight: 900, color: 'var(--color-heading)' }}>
          {String(t('confirmation.errorTitle'))}
        </p>
        <p style={{ fontSize: 14 }}>{errorMessage}</p>
      </div>
    )
  }

  const booking = query.data
  const bookingCode = booking.bookingCode ?? `#${booking.id}`

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="bkconf-page"
      >
        <div className="bkconf-inner">
          <Link to="/my-bookings" className="bkconf-back">
            <ChevronLeft size={15} strokeWidth={2.4} aria-hidden="true" />
            {String(t('confirmation.back'))}
          </Link>

          {/* Success banner */}
          <div className="bkconf-success-banner" role="status">
            <div className="bkconf-success-icon" aria-hidden="true">
              <CheckCircle2 size={28} strokeWidth={1.8} />
            </div>
            <h1 className="bkconf-success-title">{String(t('confirmation.title'))}</h1>
            <p className="bkconf-success-subtitle">
              {String(t('confirmation.subtitle', { defaultValue: 'Mã đơn:', code: '' }))}{' '}
              <code>{bookingCode}</code>
            </p>
          </div>

          {/* Booking detail rows */}
          <div className="bkconf-card">
            <Row label={String(t('confirmation.bookingCode'))}>
              {bookingCode}
            </Row>
            <Row label={String(t('confirmation.tourId'))}>
              #{booking.tourId} · {String(t('confirmation.scheduleId'))}: #{booking.scheduleId}
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
            <Row label={String(t('confirmation.total'))} isTotal>
              {formatCurrencyVnd(booking.finalAmount)}
            </Row>
          </div>

          {/* Pay CTA */}
          {isPayable(booking.status, booking.paymentStatus) ? (
            <div className="bkconf-pay">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={vnpayMutation.isPending || booking.finalAmount == null}
                className="bkconf-pay-btn"
              >
                {vnpayMutation.isPending ? (
                  <Loader2 size={18} strokeWidth={2} className="animate-spin" aria-hidden="true" />
                ) : (
                  <CreditCard size={18} strokeWidth={2} aria-hidden="true" />
                )}
                {vnpayMutation.isPending
                  ? String(t('confirmation.payRedirecting'))
                  : String(t('confirmation.payNow'))}
              </button>
              <p className="bkconf-pay-note">{String(t('confirmation.payNote'))}</p>
            </div>
          ) : null}

          <p className="bkconf-disclaimer">{String(t('confirmation.disclaimer'))}</p>
        </div>
      </motion.div>

      <Footer />
    </>
  )
}

type RowProps = {
  label: string
  children: ReactNode
  isTotal?: boolean
}

function Row({ label, children, isTotal = false }: RowProps) {
  return (
    <div className={`bkconf-row${isTotal ? ' bkconf-row--total' : ''}`}>
      <dt className="bkconf-row__label">{label}</dt>
      <dd className={isTotal ? 'bkconf-row__value--total' : 'bkconf-row__value'}>{children}</dd>
    </div>
  )
}

export default BookingConfirmationPage
