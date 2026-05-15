import { useEffect, useMemo, useState } from 'react'
import type { DestinationDetail } from '../../database/interface/destination'
import type {
  DestinationDetailCopy,
  DestinationDetailLocale,
} from '../../utils/destinationDetailCopy'
import { formatDateTime, formatScore } from '../../utils/destinationDetailFormatters'

type TabKey = 'food' | 'specialty' | 'activity' | 'tip' | 'event'

type DestinationExperienceTabsProps = {
  detail: DestinationDetail
  copy: DestinationDetailCopy
  locale: DestinationDetailLocale
}

export function DestinationExperienceTabs({
  detail,
  copy,
  locale,
}: DestinationExperienceTabsProps) {
  const tabs = useMemo(() => {
    const list: { key: TabKey; label: string; count: number }[] = [
      { key: 'food', label: copy.foodTitle, count: detail.foods.length },
      { key: 'specialty', label: copy.specialtyTitle, count: detail.specialties.length },
      { key: 'activity', label: copy.activityTitle, count: detail.activities.length },
      { key: 'tip', label: copy.tipTitle, count: detail.tips.length },
      { key: 'event', label: copy.eventTitle, count: detail.events.length },
    ]
    return list.filter((t) => t.count > 0)
  }, [
    copy.activityTitle,
    copy.eventTitle,
    copy.foodTitle,
    copy.specialtyTitle,
    copy.tipTitle,
    detail.activities.length,
    detail.events.length,
    detail.foods.length,
    detail.specialties.length,
    detail.tips.length,
  ])

  const firstKey = tabs[0]?.key ?? 'food'
  const [tab, setTab] = useState<TabKey>(firstKey)

  useEffect(() => {
    setTab((prev) => (tabs.some((t) => t.key === prev) ? prev : firstKey))
  }, [firstKey, tabs])

  if (tabs.length === 0) {
    return null
  }

  const safeTab = tabs.some((t) => t.key === tab) ? tab : firstKey

  return (
    <section
      id="section-experience"
      className="scroll-mt-28 rounded-2xl border border-white/30 bg-white/55 p-4 shadow-lg shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-md md:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700/90">
        {copy.contentBlocks}
      </p>
      <h2 className="mt-1 font-serif text-xl font-semibold text-slate-900 md:text-2xl">
        {copy.contentBlocksNote}
      </h2>

      <div
        role="tablist"
        aria-label={copy.contentBlocks}
        className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={safeTab === t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              safeTab === t.key
                ? 'bg-slate-900 text-white shadow-md'
                : 'border border-slate-200/80 bg-white/70 text-slate-700 hover:border-teal-300/60'
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs font-normal opacity-80">({t.count})</span>
          </button>
        ))}
      </div>

      <div className="mt-6" role="tabpanel">
        {safeTab === 'food' ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {detail.foods.map((f) => (
              <li
                key={f.id}
                className="rounded-xl border border-slate-200/60 bg-white/80 p-4 shadow-sm transition hover:border-teal-200/80 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900">{f.foodName}</p>
                  {f.isFeatured ? (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                      {copy.featured}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.description?.trim() || copy.noItemDescription}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {safeTab === 'specialty' ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {detail.specialties.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-slate-200/60 bg-white/80 p-4 shadow-sm transition hover:border-teal-200/80 hover:shadow-md"
              >
                <p className="font-semibold text-slate-900">{s.specialtyName}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.description?.trim() || copy.noItemDescription}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {safeTab === 'activity' ? (
          <ul className="space-y-4">
            {detail.activities.map((a) => (
              <li
                key={a.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200/60 bg-white/80 p-4 shadow-sm transition hover:border-teal-200/80 hover:shadow-md sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{a.activityName}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {a.description?.trim() || copy.noItemDescription}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-teal-700">
                  {formatScore(a.activityScore, copy)}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {safeTab === 'tip' ? (
          <ul className="space-y-3">
            {detail.tips.map((t) => (
              <li
                key={t.id}
                className="rounded-xl border border-slate-200/60 bg-gradient-to-r from-white to-slate-50/80 p-4 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{t.tipTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.tipContent}</p>
              </li>
            ))}
          </ul>
        ) : null}

        {safeTab === 'event' ? (
          <ul className="space-y-4">
            {detail.events.map((e) => (
              <li
                key={e.id}
                className="rounded-xl border border-slate-200/60 bg-white/80 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{e.eventName}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {e.eventType || copy.event}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{e.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {e.startsAt ? formatDateTime(e.startsAt, locale, copy) : copy.updating}
                  {e.endsAt ? ` → ${formatDateTime(e.endsAt, locale, copy)}` : ''}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
