import { useTranslation } from 'react-i18next'
import { isBookingStatus, type BookingStatus } from '../constants/bookingStatus'

type BookingStatusBadgeProps = {
  status: string | null | undefined
  size?: 'sm' | 'md'
}

const STATUS_TONE: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-900 ring-1 ring-amber-200',
  confirmed: 'bg-sky-100 text-sky-900 ring-1 ring-sky-200',
  paid: 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200',
  checked_in: 'bg-indigo-100 text-indigo-900 ring-1 ring-indigo-200',
  completed: 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200',
  cancelled: 'bg-rose-100 text-rose-900 ring-1 ring-rose-200',
  no_show: 'bg-zinc-100 text-zinc-900 ring-1 ring-zinc-200',
  refunded: 'bg-violet-100 text-violet-900 ring-1 ring-violet-200',
}

const UNKNOWN_TONE = 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'

function BookingStatusBadge({ status, size = 'sm' }: BookingStatusBadgeProps) {
  const { t } = useTranslation('bookings')
  const isKnown = isBookingStatus(status)
  const tone = isKnown ? STATUS_TONE[status as BookingStatus] : UNKNOWN_TONE
  const label = isKnown
    ? String(t(`status.booking.${status}`, { defaultValue: status }))
    : (status ?? '—')
  const padding = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-wide ${tone} ${padding}`}
    >
      {label}
    </span>
  )
}

export default BookingStatusBadge
