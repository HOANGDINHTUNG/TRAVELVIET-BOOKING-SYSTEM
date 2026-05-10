import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
  AlertTriangle,
  CheckCheck,
  CheckCircle2,
  Loader2,
  PackageX,
  Search,
  Undo2,
  UserCheck,
  XCircle,
} from 'lucide-react'
import { handleApiError } from '../../../../lib/handleApiError'
import BookingStatusBadge from '../../../bookings/components/BookingStatusBadge'
import PaymentStatusBadge from '../../../bookings/components/PaymentStatusBadge'
import {
  formatCurrencyVnd,
  formatDateTime,
} from '../../schedules/utils/currency'
import {
  useCancelBooking,
  useCheckInBooking,
  useCompleteBooking,
  useManagementBookingsQuery,
} from '../hooks/useManagementBookings'
import type {
  ManagementBookingResponse,
  ManagementBookingSearchParams,
} from '../types/managementBooking'
import { DEFAULT_MANAGEMENT_BOOKING_SEARCH } from '../types/managementBooking'
import RefundDialog from '../components/RefundDialog'

type ConfirmAction = 'cancel' | 'checkIn' | 'complete'

type ConfirmState = {
  bookingId: number
  action: ConfirmAction
} | null

const FIELD_CLASS =
  'rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-2 py-1.5 text-xs outline-none focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20'

function ManagementBookingsPage() {
  const { t } = useTranslation('management')
  const [params, setParams] = useState<ManagementBookingSearchParams>(
    DEFAULT_MANAGEMENT_BOOKING_SEARCH,
  )

  const query = useManagementBookingsQuery(params)
  const cancelMutation = useCancelBooking()
  const checkInMutation = useCheckInBooking()
  const completeMutation = useCompleteBooking()

  const [confirm, setConfirm] = useState<ConfirmState>(null)
  const [refundBooking, setRefundBooking] =
    useState<ManagementBookingResponse | null>(null)

  const total = query.data?.page.totalElements ?? 0
  const usedFallback = query.data?.fallback === true

  const visibleBookings = useMemo(() => {
    const bookings = query.data?.page.content ?? []
    if (!params.keyword?.trim()) return bookings
    const keyword = params.keyword.trim().toLowerCase()
    return bookings.filter((b) => {
      const haystack = [
        b.bookingCode,
        b.contactName,
        b.contactPhone,
        b.contactEmail,
        String(b.id),
        String(b.tourId),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(keyword)
    })
  }, [query.data?.page.content, params.keyword])

  function handleConfirmAction() {
    if (!confirm) return
    const args = { id: confirm.bookingId }
    if (confirm.action === 'cancel') cancelMutation.mutate(args)
    else if (confirm.action === 'checkIn') checkInMutation.mutate(args)
    else if (confirm.action === 'complete') completeMutation.mutate(args)
    setConfirm(null)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-7xl px-4 py-6"
    >
      <header className="mb-3 flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight">
          {String(t('bookings.page.title'))}
        </h1>
        <p className="text-sm text-[var(--color-muted,#64748b)]">
          {String(t('bookings.page.subtitle'))}
        </p>
      </header>

      {usedFallback ? (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <AlertTriangle
            className="mt-0.5 h-4 w-4 flex-shrink-0"
            aria-hidden
          />
          <p>{String(t('bookings.page.fallbackWarning'))}</p>
        </div>
      ) : null}

      {/* Filters */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search
            className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="text"
            value={params.keyword ?? ''}
            onChange={(e) =>
              setParams((p) => ({ ...p, keyword: e.target.value, page: 0 }))
            }
            placeholder={String(t('bookings.page.searchPlaceholder'))}
            className={`${FIELD_CLASS} w-56 pl-7`}
          />
        </div>
        <select
          value={params.status ?? ''}
          onChange={(e) =>
            setParams((p) => ({
              ...p,
              status: e.target.value || undefined,
              page: 0,
            }))
          }
          className={FIELD_CLASS}
        >
          <option value="">{String(t('bookings.page.allStatus'))}</option>
          {[
            'pending',
            'confirmed',
            'paid',
            'cancelled',
            'checked_in',
            'completed',
            'no_show',
            'refunded',
          ].map((s) => (
            <option key={s} value={s}>
              {String(t(`status.booking.${s}`, { defaultValue: s, ns: 'bookings' }))}
            </option>
          ))}
        </select>
        <select
          value={params.paymentStatus ?? ''}
          onChange={(e) =>
            setParams((p) => ({
              ...p,
              paymentStatus: e.target.value || undefined,
              page: 0,
            }))
          }
          className={FIELD_CLASS}
        >
          <option value="">{String(t('bookings.page.allPayment'))}</option>
          {[
            'pending',
            'processing',
            'paid',
            'failed',
            'refunded',
            'partially_refunded',
          ].map((s) => (
            <option key={s} value={s}>
              {String(t(`status.payment.${s}`, { defaultValue: s, ns: 'bookings' }))}
            </option>
          ))}
        </select>
      </div>

      {/* Body */}
      {query.isPending ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border,#e2e8f0)] bg-slate-50 px-3 py-12 text-sm text-[var(--color-muted,#64748b)]">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {String(t('bookings.page.loading'))}
        </div>
      ) : query.error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center text-sm text-rose-800">
          {handleApiError(
            query.error,
            String(t('bookings.page.errorMessage')),
          )}
        </div>
      ) : visibleBookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border,#e2e8f0)] bg-slate-50 px-4 py-12 text-center text-sm text-[var(--color-muted,#64748b)]">
          <PackageX
            className="mx-auto mb-2 h-8 w-8 text-slate-400"
            aria-hidden
          />
          {String(t('bookings.page.empty'))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border,#e2e8f0)] bg-white">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-600">
              <tr>
                <Th>{String(t('bookings.page.col.id'))}</Th>
                <Th>{String(t('bookings.page.col.contact'))}</Th>
                <Th>{String(t('bookings.page.col.tour'))}</Th>
                <Th>{String(t('bookings.page.col.bookedAt'))}</Th>
                <Th>{String(t('bookings.page.col.status'))}</Th>
                <Th className="text-right">
                  {String(t('bookings.page.col.amount'))}
                </Th>
                <Th className="text-right">
                  {String(t('bookings.page.col.actions'))}
                </Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleBookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  busy={
                    cancelMutation.isPending ||
                    checkInMutation.isPending ||
                    completeMutation.isPending
                  }
                  onCancel={() =>
                    setConfirm({ bookingId: booking.id, action: 'cancel' })
                  }
                  onCheckIn={() =>
                    setConfirm({ bookingId: booking.id, action: 'checkIn' })
                  }
                  onComplete={() =>
                    setConfirm({ bookingId: booking.id, action: 'complete' })
                  }
                  onRefund={() => setRefundBooking(booking)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-2 text-right text-[10px] text-[var(--color-muted,#94a3b8)]">
        {String(
          t('bookings.page.totalCount', {
            defaultValue: 'Tổng: {{count}}',
            count: total,
          }),
        )}
      </p>

      {/* Confirm dialog */}
      {confirm ? (
        <ConfirmDialog
          action={confirm.action}
          onClose={() => setConfirm(null)}
          onConfirm={handleConfirmAction}
        />
      ) : null}

      {/* Refund dialog */}
      <RefundDialog
        open={refundBooking != null}
        booking={refundBooking}
        onClose={() => setRefundBooking(null)}
      />
    </motion.section>
  )
}

/* -------------------------------------------------------------------------- */

function Th(props: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`px-3 py-2 text-left font-semibold ${props.className ?? ''}`}
    >
      {props.children}
    </th>
  )
}

type BookingRowProps = {
  booking: ManagementBookingResponse
  busy: boolean
  onCancel: () => void
  onCheckIn: () => void
  onComplete: () => void
  onRefund: () => void
}

function BookingRow({ booking, busy, ...handlers }: BookingRowProps) {
  const { t } = useTranslation('management')
  const canCheckIn =
    booking.status === 'paid' || booking.status === 'confirmed'
  const canComplete = booking.status === 'checked_in'
  const canCancel =
    booking.status === 'pending' || booking.status === 'confirmed'
  const canRefund =
    booking.paymentStatus === 'paid' || booking.paymentStatus === 'partially_refunded'

  return (
    <tr className="hover:bg-slate-50/60">
      <td className="px-3 py-2 align-top font-mono text-[11px]">
        {booking.bookingCode ?? `#${booking.id}`}
      </td>
      <td className="px-3 py-2 align-top">
        <div className="font-medium">{booking.contactName ?? '—'}</div>
        <div className="text-[10px] text-[var(--color-muted,#64748b)]">
          {booking.contactPhone ?? ''}
          {booking.contactEmail ? ` · ${booking.contactEmail}` : ''}
        </div>
      </td>
      <td className="px-3 py-2 align-top">
        #{booking.tourId} · #{booking.scheduleId}
      </td>
      <td className="px-3 py-2 align-top text-xs text-[var(--color-muted,#64748b)]">
        {formatDateTime(booking.createdAt)}
      </td>
      <td className="px-3 py-2 align-top">
        <div className="flex flex-wrap items-center gap-1">
          <BookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>
      </td>
      <td className="px-3 py-2 text-right align-top tabular-nums">
        {formatCurrencyVnd(booking.finalAmount)}
      </td>
      <td className="px-3 py-2 align-top">
        <div className="flex flex-wrap items-center justify-end gap-1">
          {canCheckIn ? (
            <ActionBtn
              icon={UserCheck}
              label={String(t('bookings.page.actions.checkIn'))}
              onClick={handlers.onCheckIn}
              disabled={busy}
              tone="indigo"
            />
          ) : null}
          {canComplete ? (
            <ActionBtn
              icon={CheckCheck}
              label={String(t('bookings.page.actions.complete'))}
              onClick={handlers.onComplete}
              disabled={busy}
              tone="emerald"
            />
          ) : null}
          {canRefund ? (
            <ActionBtn
              icon={Undo2}
              label={String(t('bookings.page.actions.refund'))}
              onClick={handlers.onRefund}
              disabled={busy}
              tone="violet"
            />
          ) : null}
          {canCancel ? (
            <ActionBtn
              icon={XCircle}
              label={String(t('bookings.page.actions.cancel'))}
              onClick={handlers.onCancel}
              disabled={busy}
              tone="rose"
            />
          ) : null}
        </div>
      </td>
    </tr>
  )
}

const TONE_CLASS = {
  indigo:
    'border-indigo-200 text-indigo-800 hover:bg-indigo-50 focus-visible:ring-indigo-200',
  emerald:
    'border-emerald-200 text-emerald-800 hover:bg-emerald-50 focus-visible:ring-emerald-200',
  rose: 'border-rose-200 text-rose-800 hover:bg-rose-50 focus-visible:ring-rose-200',
  violet:
    'border-violet-200 text-violet-800 hover:bg-violet-50 focus-visible:ring-violet-200',
} as const

type ActionBtnProps = {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  tone: keyof typeof TONE_CLASS
  onClick: () => void
  disabled?: boolean
}

function ActionBtn(props: ActionBtnProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.label}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition disabled:opacity-50 ${TONE_CLASS[props.tone]}`}
    >
      <props.icon className="h-3 w-3" aria-hidden />
      {props.label}
    </button>
  )
}

type ConfirmDialogProps = {
  action: ConfirmAction
  onClose: () => void
  onConfirm: () => void
}

function ConfirmDialog({ action, onClose, onConfirm }: ConfirmDialogProps) {
  const { t } = useTranslation('management')
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <header className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <CheckCircle2
            className="h-5 w-5 text-[var(--color-primary,#0ea5e9)]"
            aria-hidden
          />
          <h2 className="text-base font-semibold">
            {String(t(`bookings.page.confirm.${action}.title`))}
          </h2>
        </header>
        <p className="px-4 py-3 text-sm text-slate-700">
          {String(t(`bookings.page.confirm.${action}.message`))}
        </p>
        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
          >
            {String(t('bookings.page.confirm.btnCancel'))}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {String(t('bookings.page.confirm.btnConfirm'))}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default ManagementBookingsPage
