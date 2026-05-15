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
 * Public schedule selector — thẻ lớn, dễ chạm, trạng thái chọn rõ ràng.
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
      <div className="flex min-h-[140px] items-center justify-center gap-3 rounded-2xl border border-teal-100/80 bg-white/70 px-4 py-8 text-sm text-slate-600 shadow-inner backdrop-blur-sm">
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-teal-600" aria-hidden />
        {String(t('detail.schedules.loading'))}
      </div>
    )
  }

  if (bookable.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300/90 bg-white/60 px-4 py-10 text-center shadow-inner backdrop-blur-sm">
        <CalendarRange
          className="mx-auto mb-3 h-8 w-8 text-teal-500/80"
          aria-hidden
        />
        <p className="text-sm font-medium text-slate-700">
          {String(t('detail.schedules.empty'))}
        </p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
      {bookable.map((schedule) => {
        const isSelected = schedule.id === props.selectedId
        const remaining = schedule.remainingSeats ?? null
        return (
          <li key={schedule.id}>
            <motion.button
              type="button"
              whileTap={{ scale: 0.985 }}
              onClick={() => props.onSelect(schedule)}
              className={`relative flex min-h-[132px] w-full flex-col gap-1.5 rounded-2xl border-2 px-4 py-4 text-left shadow-sm transition md:min-h-[140px] md:px-5 md:py-4 ${
                isSelected
                  ? 'border-teal-500 bg-gradient-to-br from-teal-50 via-white to-cyan-50/80 shadow-lg shadow-teal-600/15 ring-2 ring-teal-400/35'
                  : 'border-slate-200/90 bg-white/90 hover:border-teal-300/70 hover:shadow-md'
              }`}
            >
              {isSelected ? (
                <CheckCircle2
                  className="absolute right-3 top-3 h-5 w-5 text-teal-600 drop-shadow-sm"
                  aria-hidden
                />
              ) : null}
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700/90">
                {schedule.scheduleCode ?? `#${schedule.id}`}
              </span>
              <span className="text-base font-bold leading-snug text-slate-900 md:text-lg">
                {formatDateTime(schedule.departureAt)}
              </span>
              <span className="text-xs font-medium text-slate-500">
                → {formatDateTime(schedule.returnAt)}
              </span>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 pt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                  <Users className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                  {String(t('detail.schedules.remaining'))}:{' '}
                  {remaining != null ? formatNumberVi(remaining) : '—'}
                </span>
                <span className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-3 py-1.5 text-sm font-bold text-white shadow-md">
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
