import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import {
  AlertTriangle,
  CheckCircle2,
  Search,
} from 'lucide-react'
import { handleApiError } from '../../../../lib/handleApiError'
import { publicBookingKeys } from '../../../bookings/hooks/useBookingMutation'
import { ManagementBookingsApi } from '../api/managementBookings.api'
import {
  managementBookingKeys,
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
import BookingsDataTable from '../components/BookingsDataTable'
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
  const queryClient = useQueryClient()
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
  const [bulkBusy, setBulkBusy] = useState(false)

  const total = query.data?.page.totalElements ?? 0
  const usedFallback = query.data?.fallback === true

  const invalidateAfterBulk = useCallback(
    (touchedIds: number[]) => {
      void queryClient.invalidateQueries({ queryKey: managementBookingKeys.all })
      for (const id of touchedIds) {
        void queryClient.invalidateQueries({
          queryKey: publicBookingKeys.detail(id),
        })
      }
      void queryClient.invalidateQueries({ queryKey: publicBookingKeys.myList() })
    },
    [queryClient],
  )

  const runBulkCheckIn = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0) return
      setBulkBusy(true)
      let ok = 0
      try {
        for (const id of ids) {
          try {
            await ManagementBookingsApi.checkIn(id)
            ok++
          } catch (err) {
            toast.error(
              handleApiError(err, String(t('bookings.toast.checkInFailed'))),
            )
          }
        }
        invalidateAfterBulk(ids)
        toast.success(
          String(t('bookings.page.bulk.done', { ok, total: ids.length })),
        )
      } finally {
        setBulkBusy(false)
      }
    },
    [invalidateAfterBulk, t],
  )

  const runBulkComplete = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0) return
      setBulkBusy(true)
      let ok = 0
      try {
        for (const id of ids) {
          try {
            await ManagementBookingsApi.complete(id)
            ok++
          } catch (err) {
            toast.error(
              handleApiError(err, String(t('bookings.toast.completeFailed'))),
            )
          }
        }
        invalidateAfterBulk(ids)
        toast.success(
          String(t('bookings.page.bulk.done', { ok, total: ids.length })),
        )
      } finally {
        setBulkBusy(false)
      }
    },
    [invalidateAfterBulk, t],
  )

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
      {query.error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center text-sm text-rose-800">
          {handleApiError(
            query.error,
            String(t('bookings.page.errorMessage')),
          )}
        </div>
      ) : (
        <BookingsDataTable
          rows={visibleBookings}
          isPending={query.isPending}
          busy={
            cancelMutation.isPending ||
            checkInMutation.isPending ||
            completeMutation.isPending ||
            bulkBusy
          }
          bulkSelectionEnabled={!usedFallback}
          onBulkCheckIn={!usedFallback ? runBulkCheckIn : undefined}
          onBulkComplete={!usedFallback ? runBulkComplete : undefined}
          onCancel={(b) => setConfirm({ bookingId: b.id, action: 'cancel' })}
          onCheckIn={(b) => setConfirm({ bookingId: b.id, action: 'checkIn' })}
          onComplete={(b) => setConfirm({ bookingId: b.id, action: 'complete' })}
          onRefund={setRefundBooking}
        />
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
