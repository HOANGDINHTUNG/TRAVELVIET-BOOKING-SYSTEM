import { useTranslation } from 'react-i18next'
import { SunMedium } from 'lucide-react'
import type { TourResponse } from '../../types/publicTour'
import { normalizeSeasonalityList } from './tourPublicDetailNormalize'

type SeasonalityStripProps = {
  tour: TourResponse
}

export function SeasonalityStrip({ tour }: SeasonalityStripProps) {
  const { t } = useTranslation('tours')
  const rows = normalizeSeasonalityList(tour.seasonality)
  if (rows.length === 0) return null

  return (
    <section className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50/70 via-white to-accent/10/40 p-5 shadow-lg ring-1 ring-amber-100/50 backdrop-blur-md md:p-6">
      <div className="flex items-center gap-2 text-amber-900">
        <SunMedium className="h-5 w-5" aria-hidden />
        <h2 className="font-serif text-lg font-semibold">{String(t('detail.seasonalityTitle'))}</h2>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-xl border border-white/60 bg-white/80 p-3 text-sm shadow-sm backdrop-blur-sm"
          >
            <p className="font-semibold text-slate-900">{row.seasonName}</p>
            {row.monthFrom != null && row.monthTo != null ? (
              <p className="mt-1 text-xs text-slate-600">
                {String(t('detail.seasonMonths', { from: row.monthFrom, to: row.monthTo }))}
              </p>
            ) : null}
            {row.recommendationScore != null ? (
              <p className="mt-1 text-xs font-medium text-teal-700">Score: {row.recommendationScore}</p>
            ) : null}
            {row.notes ? (
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{row.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
