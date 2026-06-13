import { useTranslation } from 'react-i18next'
import { isPaymentStatus, type PaymentStatus } from '../constants/bookingStatus'

type PaymentStatusBadgeProps = {
  status: string | null | undefined
  size?: 'sm' | 'md'
}

const STATUS_TONE: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-900 ring-1 ring-amber-200',
  processing: 'bg-sky-100 text-sky-900 ring-1 ring-sky-200',
  paid: 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200',
  failed: 'bg-rose-100 text-rose-900 ring-1 ring-rose-200',
  refunded: 'bg-violet-100 text-violet-900 ring-1 ring-violet-200',
  partially_refunded:
    'bg-accentuchsia-100 text-fuchsia-900 ring-1 ring-fuchsia-200',
}

const UNKNOWN_TONE = 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'

function PaymentStatusBadge({ status, size = 'sm' }: PaymentStatusBadgeProps) {
  const { t } = useTranslation('bookings')
  const isKnown = isPaymentStatus(status)
  const tone = isKnown ? STATUS_TONE[status as PaymentStatus] : UNKNOWN_TONE
  const label = isKnown
    ? String(t(`status.payment.${status}`, { defaultValue: status }))
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

export default PaymentStatusBadge
