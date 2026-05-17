import { Leaf } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TourResponse } from '../../types/publicTour'
import {
  hasSustainabilityScores,
  resolveEsgScore,
  resolveLeiScore,
} from '../../utils/tourSustainability'

type TourSustainabilityScoresProps = {
  tour: TourResponse
}

/** Điểm ESG / LEI từ API — ẩn nếu BE chưa có dữ liệu. */
export function TourSustainabilityScores({ tour }: TourSustainabilityScoresProps) {
  const { t } = useTranslation('tours')
  if (!hasSustainabilityScores(tour)) {
    return null
  }

  const esg = resolveEsgScore(tour)
  const lei = resolveLeiScore(tour)

  return (
    <section className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-4 shadow-sm ring-1 ring-emerald-100/60">
      <div className="flex items-center gap-2 text-emerald-900">
        <Leaf className="h-4 w-4" aria-hidden />
        <p className="text-sm font-semibold">{String(t('detail.sustainabilityTitle'))}</p>
      </div>
      <dl
        className={`mt-3 grid gap-3 ${esg != null && lei != null ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        {esg != null ? (
          <div className="rounded-xl bg-white/90 px-3 py-2.5 text-center shadow-sm ring-1 ring-emerald-100/80">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-emerald-700/90">
              {String(t('detail.esgLabel'))}
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold text-emerald-800">{esg}</dd>
          </div>
        ) : null}
        {lei != null ? (
          <div className="rounded-xl bg-white/90 px-3 py-2.5 text-center shadow-sm ring-1 ring-teal-100/80">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-teal-700/90">
              {String(t('detail.leiLabel'))}
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold text-teal-800">{lei}</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
        {String(t('detail.sustainabilityHint'))}
      </p>
    </section>
  )
}
