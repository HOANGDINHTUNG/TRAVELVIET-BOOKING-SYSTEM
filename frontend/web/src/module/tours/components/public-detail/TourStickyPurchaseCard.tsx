import { useTranslation } from 'react-i18next'
import { CalendarRange, Sparkles } from 'lucide-react'
import { formatCurrencyVnd } from '../../../management/schedules/utils/currency'
import type { TourResponse } from '../../types/publicTour'
import { resolveListPrice } from '../../utils/tourSustainability'
import { TOUR_SCHEDULES_ANCHOR_ID } from './tourPublicDetailConstants'

type TourStickyPurchaseCardProps = {
  tour: TourResponse
  schedulesAnchorId?: string
}

function scrollToSchedules(anchorId: string) {
  document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Card glass: giá niêm yết (listPrice từ BE) + giá bán, badge chỗ, CTA cuộn tới lịch khởi hành.
 */
export function TourStickyPurchaseCard({
  tour,
  schedulesAnchorId = TOUR_SCHEDULES_ANCHOR_ID,
}: TourStickyPurchaseCardProps) {
  const { t } = useTranslation('tours')
  const base = tour.basePrice ?? 0
  const listPrice = resolveListPrice({
    price: base,
    listPrice: tour.listPrice,
    basePrice: tour.basePrice,
  })
  const stockLimited = (tour.totalBookings ?? 0) < 25

  return (
    <div className="rounded-2xl border border-white/25 bg-gradient-to-br from-white/75 via-white/55 to-teal-50/30 p-5 shadow-xl shadow-teal-900/10 ring-1 ring-teal-500/15 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
            stockLimited
              ? 'bg-orange-100 text-orange-900 ring-1 ring-orange-200/80'
              : 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80'
          }`}
        >
          {stockLimited ? String(t('detail.stock.limited')) : String(t('detail.stock.inStock'))}
        </span>
        {tour.isFeatured ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/90 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
            <Sparkles className="h-3 w-3" aria-hidden />
            {String(t('detail.featured'))}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {String(t('detail.fromPrice'))}
          </p>
          <div className="flex flex-wrap items-baseline gap-2">
            {listPrice != null && listPrice > base ? (
              <span className="text-sm text-slate-400 line-through">
                {formatCurrencyVnd(listPrice)}
              </span>
            ) : null}
            <span className="font-serif text-3xl font-bold tracking-tight text-teal-700 md:text-4xl">
              {formatCurrencyVnd(base)}
            </span>
          </div>
        </div>
      </div>

      {(tour.durationDays ?? tour.durationNights) != null ? (
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
          <CalendarRange className="h-4 w-4 text-teal-600" aria-hidden />
          {tour.durationDays != null ? (
            <>
              {tour.durationDays} {String(t('detail.daysShort'))}
            </>
          ) : null}
          {tour.durationNights != null ? (
            <>
              {tour.durationDays != null ? ' · ' : null}
              {tour.durationNights} {String(t('detail.nightsShort'))}
            </>
          ) : null}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => scrollToSchedules(schedulesAnchorId)}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-teal-500 hover:to-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:scale-[0.99]"
      >
        {String(t('detail.cta.pickSchedule'))}
      </button>
    </div>
  )
}
