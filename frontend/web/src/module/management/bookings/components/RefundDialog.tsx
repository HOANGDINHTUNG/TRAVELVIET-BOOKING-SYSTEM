import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, X } from 'lucide-react'
import { formatCurrencyVnd } from '../../schedules/utils/currency'
import { useCreateRefund } from '../hooks/useManagementBookings'
import type { ManagementBookingResponse } from '../types/managementBooking'

type RefundDialogProps = {
  open: boolean
  booking: ManagementBookingResponse | null
  onClose: () => void
}

const FIELD_CLASS =
  'w-full rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20'

function RefundDialog(props: RefundDialogProps) {
  const { t } = useTranslation('management')
  const mutation = useCreateRefund()

  const maxAmount = props.booking?.finalAmount ?? 0
  const [amount, setAmount] = useState<number | ''>(maxAmount || '')
  const [reason, setReason] = useState('')

  const bookingId = props.booking?.id ?? null
  const [prevBookingId, setPrevBookingId] = useState<number | null>(bookingId)
  if (bookingId !== prevBookingId) {
    setPrevBookingId(bookingId)
    setAmount(props.booking?.finalAmount ?? '')
    setReason('')
  }

  if (!props.open || !props.booking) return null

  const hasAmount = maxAmount > 0
  const canSubmit =
    hasAmount &&
    typeof amount === 'number' &&
    amount > 0 &&
    amount <= maxAmount

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const booking = props.booking
    if (!booking || !canSubmit || typeof amount !== 'number') return
    mutation.mutate(
      {
        bookingId: booking.id,
        requestedAmount: amount,
        reasonDetail: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          props.onClose()
        },
      },
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-base font-semibold">
            {String(t('bookings.refund.title'))}
          </h2>
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-md p-1 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <form className="flex flex-col gap-3 p-4 text-sm" onSubmit={handleSubmit}>
          <div>
            <p className="text-xs text-[var(--color-muted,#64748b)]">
              {String(t('bookings.refund.bookingLabel'))}
            </p>
            <p className="font-mono">
              {props.booking.bookingCode ?? `#${props.booking.id}`}
            </p>
          </div>

          {!hasAmount ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {String(t('bookings.refund.noAmount'))}
            </p>
          ) : null}

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {String(t('bookings.refund.amount'))}{' '}
              <span className="font-normal text-[var(--color-muted,#64748b)]">
                ({String(t('bookings.refund.maxAmount'))}:{' '}
                {formatCurrencyVnd(maxAmount)})
              </span>
            </span>
            <input
              type="number"
              min={0}
              max={maxAmount}
              value={amount}
              onChange={(e) => {
                const value = e.target.value
                setAmount(value === '' ? '' : Number(value))
              }}
              disabled={!hasAmount}
              className={FIELD_CLASS}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {String(t('bookings.refund.reason'))}
            </span>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={String(t('bookings.refund.reasonPlaceholder'))}
              className={FIELD_CLASS}
              disabled={!hasAmount}
            />
          </label>

          <footer className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
            >
              {String(t('bookings.refund.cancel'))}
            </button>
            <button
              type="submit"
              disabled={!canSubmit || mutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {mutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : null}
              {String(t('bookings.refund.submit'))}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default RefundDialog
