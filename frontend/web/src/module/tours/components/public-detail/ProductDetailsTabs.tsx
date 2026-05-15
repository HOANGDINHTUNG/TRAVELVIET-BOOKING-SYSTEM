import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TourResponse } from '../../types/publicTour'
import { normalizeCancellationPolicy } from './tourPublicDetailNormalize'

type TabKey = 'description' | 'highlights' | 'inclusions' | 'exclusions' | 'notes' | 'policy'

type ProductDetailsTabsProps = {
  tour: TourResponse
}

export function ProductDetailsTabs({ tour }: ProductDetailsTabsProps) {
  const tourId = tour.id
  const { t } = useTranslation('tours')
  const policy = normalizeCancellationPolicy(tour.cancellationPolicy)

  const tabs = useMemo(() => {
    const list: { key: TabKey; label: string; body: string | null }[] = []
    if (tour.description?.trim()) {
      list.push({
        key: 'description',
        label: String(t('detail.tabs.description')),
        body: tour.description,
      })
    }
    if (tour.highlights?.trim()) {
      list.push({
        key: 'highlights',
        label: String(t('detail.tabs.highlights')),
        body: tour.highlights,
      })
    }
    if (tour.inclusions?.trim()) {
      list.push({
        key: 'inclusions',
        label: String(t('detail.tabs.inclusions')),
        body: tour.inclusions,
      })
    }
    if (tour.exclusions?.trim()) {
      list.push({
        key: 'exclusions',
        label: String(t('detail.tabs.exclusions')),
        body: tour.exclusions,
      })
    }
    if (tour.notes?.trim()) {
      list.push({
        key: 'notes',
        label: String(t('detail.tabs.notes')),
        body: tour.notes,
      })
    }
    if (policy?.description?.trim() || policy?.name) {
      list.push({
        key: 'policy',
        label: String(t('detail.tabs.policy')),
        body: [policy?.name, policy?.description].filter(Boolean).join('\n\n') || null,
      })
    }
    return list
  }, [
    policy,
    t,
    tour.description,
    tour.exclusions,
    tour.highlights,
    tour.inclusions,
    tour.notes,
  ])

  const [tab, setTab] = useState<TabKey | null>(null)

  useEffect(() => {
    setTab(null)
  }, [tourId])

  const active =
    tab && tabs.some((x) => x.key === tab) ? tab : (tabs[0]?.key as TabKey)

  if (tabs.length === 0) {
    return null
  }

  return (
    <section className="rounded-3xl border border-white/35 bg-white/55 p-5 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-md md:p-7">
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active === item.key}
            onClick={() => setTab(item.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === item.key
                ? 'bg-slate-900 text-white shadow-md'
                : 'border border-slate-200/90 bg-white/80 text-slate-700 hover:border-teal-300/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4 min-h-[120px] rounded-xl border border-slate-100 bg-white/70 p-4" role="tabpanel">
        {tabs.map((item) =>
          active === item.key ? (
            <p key={item.key} className="whitespace-pre-line text-sm leading-relaxed text-slate-800 md:text-base">
              {item.body}
            </p>
          ) : null,
        )}
      </div>
      {policy && active === 'policy' ? (
        <p className="mt-3 text-xs text-slate-500">
          {String(t('detail.cta.viewPolicy'))} — {policy.name}
        </p>
      ) : null}
    </section>
  )
}
