import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { CalendarRange, CheckCircle2, Loader2, Users } from 'lucide-react'
import {
  formatCurrencyVnd,
  formatDateTime,
  formatNumberVi,
} from '../../management/schedules/utils/currency'
import { deriveEffectiveStatus } from '../../management/schedules/utils/scheduleStatus'
import type { TourScheduleResponse } from '../types/publicTour'

type TourScheduleSelectorProps = {
  schedules: TourScheduleResponse[] | null | undefined
  isLoading?: boolean
  selectedId: number | null
  onSelect: (schedule: TourScheduleResponse) => void
}

/**
 * Public schedule selector — chỉ hiển thị các đợt có `status` cho phép book
 * (open/draft với còn slot). Sắp xếp theo `departureAt` tăng dần.
 */
function TourScheduleSelector(props: TourScheduleSelectorProps) {
  const { t } = useTranslation('tours')

  const bookable = useMemo(() => {
    const list = (props.schedules ?? []).filter((s) => {
      const eff = deriveEffectiveStatus(s)
      return eff === 'open' || eff === 'draft'
    })
    return list.sort((a, b) => {
      const ad = a.departureAt ? new Date(a.departureAt).getTime() : 0
      const bd = b.departureAt ? new Date(b.departureAt).getTime() : 0
      return ad - bd
    })
  }, [props.schedules])

  if (props.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border,#e2e8f0)] bg-slate-50 px-3 py-6 text-xs text-[var(--color-muted,#64748b)]">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {String(t('detail.schedules.loading'))}
      </div>
    )
  }

  if (bookable.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border,#e2e8f0)] bg-slate-50 px-4 py-6 text-center text-sm text-[var(--color-muted,#64748b)]">
        <CalendarRange
          className="mx-auto mb-2 h-6 w-6 text-slate-400"
          aria-hidden
        />
        {String(t('detail.schedules.empty'))}
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {bookable.map((schedule) => {
        const isSelected = schedule.id === props.selectedId
        const remaining = schedule.remainingSeats ?? null
        return (
          <li key={schedule.id}>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => props.onSelect(schedule)}
              className={`relative flex w-full flex-col gap-1 rounded-xl border px-4 py-3 text-left transition ${
                isSelected
                  ? 'border-[var(--color-primary,#0ea5e9)] bg-[var(--color-primary,#0ea5e9)]/10 ring-2 ring-[var(--color-primary,#0ea5e9)]/30'
                  : 'border-[var(--color-border,#e2e8f0)] bg-white hover:border-[var(--color-primary,#0ea5e9)]/60'
              }`}
            >
              {isSelected ? (
                <CheckCircle2
                  className="absolute right-2 top-2 h-4 w-4 text-[var(--color-primary,#0ea5e9)]"
                  aria-hidden
                />
              ) : null}
              <span className="text-xs uppercase tracking-wide text-[var(--color-muted,#64748b)]">
                {schedule.scheduleCode ?? `#${schedule.id}`}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {formatDateTime(schedule.departureAt)}
              </span>
              <span className="text-[11px] text-[var(--color-muted,#64748b)]">
                → {formatDateTime(schedule.returnAt)}
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                  <Users className="h-3 w-3" aria-hidden />
                  {String(t('detail.schedules.remaining'))}:{' '}
                  {remaining != null ? formatNumberVi(remaining) : '—'}
                </span>
                <span className="text-sm font-bold text-[var(--color-primary,#0ea5e9)]">
                  {formatCurrencyVnd(schedule.adultPrice)}
                </span>
              </div>
            </motion.button>
          </li>
        )
      })}
    </ul>
  )
}

export default TourScheduleSelector
