import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Circle } from 'lucide-react'
import type { TourResponse } from '../../types/publicTour'
import { normalizeChecklistItems } from './tourPublicDetailNormalize'

type ChecklistPanelProps = {
  tour: TourResponse
}

export function ChecklistPanel({ tour }: ChecklistPanelProps) {
  const { t } = useTranslation('tours')
  const items = useMemo(() => normalizeChecklistItems(tour.checklistItems), [tour.checklistItems])
  if (items.length === 0) return null

  const byGroup = items.reduce<Record<string, typeof items>>((acc, it) => {
    const g = it.itemGroup || '—'
    acc[g] = acc[g] ?? []
    acc[g].push(it)
    return acc
  }, {})

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/75 p-5 shadow-lg backdrop-blur-md md:p-7">
      <h2 className="font-serif text-lg font-semibold text-slate-900 md:text-xl">
        {String(t('detail.checklistTitle'))}
      </h2>
      <div className="mt-4 space-y-5">
        {Object.entries(byGroup).map(([group, list]) => (
          <div key={group}>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{group}</p>
            <ul className="mt-2 space-y-2">
              {list.map((it) => (
                <li
                  key={it.id}
                  className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-800"
                >
                  {it.isRequired ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" aria-hidden />
                  )}
                  <span>{it.itemName}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
