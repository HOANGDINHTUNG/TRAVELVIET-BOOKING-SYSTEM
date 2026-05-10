import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import {
  CheckCircle2,
  Loader2,
  LogIn,
  Minus,
  Plus,
  Tag,
  XCircle,
} from 'lucide-react'
import {
  selectCurrentUser,
  selectIsAuthenticated,
  useAuthStore,
} from '../../../stores/authStore'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import {
  formatCurrencyVnd,
  formatNumberVi,
} from '../../management/schedules/utils/currency'
import {
  useBookingQuote,
  useCreateBooking,
} from '../../bookings/hooks/useBookingMutation'
import type {
  BookingPassengerCount,
  BookingQuotePayload,
  CreateBookingPayload,
} from '../../bookings/types/publicBooking'
import type { TourScheduleResponse } from '../types/publicTour'

type BookingPanelProps = {
  tourId: number
  schedule: TourScheduleResponse | null
}

const FIELD_INPUT_CLASS =
  'w-full rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

const QUOTE_DEBOUNCE_MS = 400

/**
 * Panel đặt chỗ public:
 * - Bộ đếm 4 loại khách (adult/child/infant/senior)
 * - Tính giá client-side **instant preview** từ schedule.{adult|child|...}Price
 * - Authoritative pricing qua `POST /bookings/quote` (debounce 400ms)
 * - Voucher: nhập mã → "Apply" gọi quote với voucherCode, đọc `appliedVoucher`
 * - Submit: check auth, nếu chưa đăng nhập → toast + redirect /login
 */
function BookingPanel({ tourId, schedule }: BookingPanelProps) {
  const { t } = useTranslation('bookings')
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const currentUser = useAuthStore(selectCurrentUser)

  const [counts, setCounts] = useState<BookingPassengerCount>({
    adults: 1,
    children: 0,
    infants: 0,
    seniors: 0,
  })

  // Voucher: dùng 2 state — `voucherInput` (đang gõ) và `appliedVoucherCode`
  // (đã apply → mới được include vào quote payload).
  const [voucherInput, setVoucherInput] = useState('')
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string | null>(
    null,
  )

  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  // Hydrate contact info khi `currentUser` đổi — pattern "adjusting state
  // during render" (https://react.dev/reference/react/useState#storing-information-from-previous-renders)
  // tránh `react-hooks/set-state-in-effect`.
  const [prevUserId, setPrevUserId] = useState<string | null>(
    currentUser?.id ?? null,
  )
  if ((currentUser?.id ?? null) !== prevUserId) {
    setPrevUserId(currentUser?.id ?? null)
    if (currentUser) {
      const seedName =
        currentUser.fullName || currentUser.displayName || ''
      const seedPhone = currentUser.phone ?? ''
      const seedEmail = currentUser.email ?? ''
      if (!contactName && seedName) setContactName(seedName)
      if (!contactPhone && seedPhone) setContactPhone(seedPhone)
      if (!contactEmail && seedEmail) setContactEmail(seedEmail)
    }
  }

  /* ----------------------------- Pricing ----------------------------- */

  /** Client-side instant preview (chưa có discount/voucher). */
  const clientSubtotal = useMemo(() => {
    if (!schedule) return 0
    const a = (schedule.adultPrice ?? 0) * counts.adults
    const c = (schedule.childPrice ?? 0) * counts.children
    const i = (schedule.infantPrice ?? 0) * counts.infants
    const s = (schedule.seniorPrice ?? 0) * counts.seniors
    return a + c + i + s
  }, [schedule, counts])

  /**
   * Live payload (sync). Truyền qua `useDebouncedValue` để chỉ refetch quote
   * sau khi user dừng thao tác `QUOTE_DEBOUNCE_MS` ms.
   */
  const livePayload = useMemo<BookingQuotePayload | null>(() => {
    if (!schedule || !isAuthenticated) return null
    return {
      tourId,
      scheduleId: schedule.id,
      adults: counts.adults,
      children: counts.children,
      infants: counts.infants,
      seniors: counts.seniors,
      voucherCode: appliedVoucherCode ?? undefined,
    }
  }, [tourId, schedule, counts, appliedVoucherCode, isAuthenticated])

  const debouncedQuotePayload = useDebouncedValue(
    livePayload,
    QUOTE_DEBOUNCE_MS,
  )

  const quoteQuery = useBookingQuote(debouncedQuotePayload)

  const totalSeats = counts.adults + counts.children + counts.seniors // infants không chiếm chỗ
  const seatLimit = schedule?.remainingSeats ?? schedule?.capacityTotal ?? 0
  const overCapacity = seatLimit > 0 && totalSeats > seatLimit

  /* ----------------------------- Mutation ----------------------------- */
  const createMutation = useCreateBooking()

  /* ------------------------------ Handlers ------------------------------ */

  function bump(key: keyof BookingPassengerCount, delta: number) {
    setCounts((prev) => {
      const next = { ...prev, [key]: Math.max(0, (prev[key] ?? 0) + delta) }
      // Đảm bảo có ít nhất 1 adult
      if (next.adults < 1) next.adults = 1
      return next
    })
  }

  function handleApplyVoucher() {
    const code = voucherInput.trim()
    if (!code) {
      setAppliedVoucherCode(null)
      return
    }
    setAppliedVoucherCode(code)
    // Quote sẽ tự re-fetch qua effect debounce.
  }

  function handleClearVoucher() {
    setVoucherInput('')
    setAppliedVoucherCode(null)
  }

  function handleSubmit() {
    if (!schedule) return
    if (!isAuthenticated) {
      toast.info(String(t('panel.authRequired')))
      const from = `${window.location.pathname}${window.location.search}`
      navigate('/login', { state: { from } })
      return
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      toast.error(String(t('panel.contactRequired')))
      return
    }
    if (overCapacity) {
      toast.error(String(t('panel.overCapacity')))
      return
    }

    const payload: CreateBookingPayload = {
      tourId,
      scheduleId: schedule.id,
      adults: counts.adults,
      children: counts.children,
      infants: counts.infants,
      seniors: counts.seniors,
      voucherCode: appliedVoucherCode ?? undefined,
      contactName,
      contactPhone,
      contactEmail,
      specialRequests,
      bookingSource: 'web',
    }
    createMutation.mutate(payload)
  }

  /* ------------------------------ Render ------------------------------ */

  if (!schedule) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border,#e2e8f0)] bg-slate-50 px-4 py-6 text-center text-sm text-[var(--color-muted,#64748b)]">
        {String(t('panel.selectSchedulePrompt'))}
      </div>
    )
  }

  const quoteData = quoteQuery.data
  const finalAmount =
    quoteData?.finalAmount != null && quoteData.finalAmount > 0
      ? quoteData.finalAmount
      : clientSubtotal
  const voucherDiscount = quoteData?.voucherDiscountAmount ?? 0
  const totalDiscount = quoteData?.discountAmount ?? 0

  const appliedVoucherInfo = quoteData?.appliedVoucher
  const isVoucherInvalid =
    appliedVoucherCode != null &&
    quoteQuery.isSuccess &&
    (!appliedVoucherInfo || (appliedVoucherInfo.discountAmount ?? 0) === 0)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border,#e2e8f0)] bg-white p-4 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted,#64748b)]">
          {String(t('panel.title'))}
        </p>
        <p className="text-sm font-semibold text-slate-900">
          {schedule.scheduleCode ?? `#${schedule.id}`}
        </p>
      </div>

      {/* Passenger counts */}
      <div className="flex flex-col gap-2">
        {(
          [
            { key: 'adults', label: 'panel.passengers.adult', min: 1 },
            { key: 'children', label: 'panel.passengers.child', min: 0 },
            { key: 'infants', label: 'panel.passengers.infant', min: 0 },
            { key: 'seniors', label: 'panel.passengers.senior', min: 0 },
          ] as const
        ).map((row) => {
          const count = counts[row.key]
          const unitPrice =
            row.key === 'adults'
              ? schedule.adultPrice
              : row.key === 'children'
                ? schedule.childPrice
                : row.key === 'infants'
                  ? schedule.infantPrice
                  : schedule.seniorPrice
          return (
            <div
              key={row.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border,#e2e8f0)] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{String(t(row.label))}</p>
                <p className="text-xs text-[var(--color-muted,#64748b)]">
                  {formatCurrencyVnd(unitPrice)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => bump(row.key, -1)}
                  disabled={count <= row.min}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  aria-label="-"
                >
                  <Minus className="h-3 w-3" aria-hidden />
                </button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums">
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => bump(row.key, 1)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
                  aria-label="+"
                >
                  <Plus className="h-3 w-3" aria-hidden />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Voucher */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          {String(t('panel.voucher.label'))}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag
              className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="text"
              value={voucherInput}
              onChange={(event) => setVoucherInput(event.target.value)}
              placeholder={String(t('panel.voucher.placeholder'))}
              className={`${FIELD_INPUT_CLASS} pl-7`}
              maxLength={50}
            />
          </div>
          {appliedVoucherCode ? (
            <button
              type="button"
              onClick={handleClearVoucher}
              className="rounded-md border border-rose-200 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50"
            >
              {String(t('panel.voucher.clear'))}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApplyVoucher}
              disabled={voucherInput.trim().length === 0 || quoteQuery.isFetching}
              className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {String(t('panel.voucher.apply'))}
            </button>
          )}
        </div>
        <AnimatePresence>
          {appliedVoucherInfo && (appliedVoucherInfo.discountAmount ?? 0) > 0 ? (
            <motion.p
              key="voucher-success"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 text-xs text-emerald-700"
            >
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              {String(t('panel.voucher.appliedHint'))}{' '}
              <strong>
                -{formatCurrencyVnd(appliedVoucherInfo.discountAmount)}
              </strong>
            </motion.p>
          ) : null}
          {isVoucherInvalid ? (
            <motion.p
              key="voucher-invalid"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 text-xs text-rose-700"
            >
              <XCircle className="h-3 w-3" aria-hidden />
              {String(t('panel.voucher.invalid'))}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-3">
        <input
          type="text"
          value={contactName}
          onChange={(event) => setContactName(event.target.value)}
          placeholder={String(t('panel.contact.name'))}
          className={FIELD_INPUT_CLASS}
        />
        <input
          type="tel"
          value={contactPhone}
          onChange={(event) => setContactPhone(event.target.value)}
          placeholder={String(t('panel.contact.phone'))}
          className={FIELD_INPUT_CLASS}
        />
        <input
          type="email"
          value={contactEmail}
          onChange={(event) => setContactEmail(event.target.value)}
          placeholder={String(t('panel.contact.email'))}
          className={FIELD_INPUT_CLASS}
        />
        <textarea
          rows={2}
          value={specialRequests}
          onChange={(event) => setSpecialRequests(event.target.value)}
          placeholder={String(t('panel.contact.note'))}
          className={FIELD_INPUT_CLASS}
        />
      </div>

      {/* Pricing summary */}
      <dl className="space-y-1 border-t border-slate-100 pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--color-muted,#64748b)]">
            {String(t('panel.summary.subtotal'))}
          </dt>
          <dd className="font-medium tabular-nums">
            {formatCurrencyVnd(clientSubtotal)}
          </dd>
        </div>
        {voucherDiscount > 0 ? (
          <div className="flex justify-between text-emerald-700">
            <dt>{String(t('panel.summary.voucherDiscount'))}</dt>
            <dd className="tabular-nums">-{formatCurrencyVnd(voucherDiscount)}</dd>
          </div>
        ) : null}
        {totalDiscount > 0 && totalDiscount !== voucherDiscount ? (
          <div className="flex justify-between text-emerald-700">
            <dt>{String(t('panel.summary.discount'))}</dt>
            <dd className="tabular-nums">-{formatCurrencyVnd(totalDiscount)}</dd>
          </div>
        ) : null}
        <div className="flex items-baseline justify-between border-t border-slate-100 pt-2">
          <dt className="text-sm font-semibold">
            {String(t('panel.summary.total'))}
            {quoteQuery.isFetching ? (
              <Loader2 className="ml-1 inline h-3 w-3 animate-spin" aria-hidden />
            ) : null}
          </dt>
          <dd className="text-lg font-bold text-[var(--color-primary,#0ea5e9)] tabular-nums">
            {formatCurrencyVnd(finalAmount)}
          </dd>
        </div>
        <p className="text-[10px] text-[var(--color-muted,#94a3b8)]">
          {String(t('panel.summary.totalSeats'))}: {formatNumberVi(totalSeats)}
        </p>
      </dl>

      {overCapacity ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700">
          {String(t('panel.overCapacity'))}
        </p>
      ) : null}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={createMutation.isPending || overCapacity}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary,#0ea5e9)] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-95 disabled:opacity-60"
      >
        {createMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : !isAuthenticated ? (
          <LogIn className="h-4 w-4" aria-hidden />
        ) : null}
        {createMutation.isPending
          ? String(t('panel.submitting'))
          : isAuthenticated
            ? String(t('panel.submit'))
            : String(t('panel.loginToBook'))}
      </button>

      <p className="text-center text-[10px] text-[var(--color-muted,#94a3b8)]">
        {String(t('panel.disclaimer'))}
      </p>
    </div>
  )
}

export default BookingPanel
