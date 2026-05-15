import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, ChevronDown, ChevronRight, MapPin } from 'lucide-react'
import type { TourResponse } from '../../types/publicTour'
import { normalizeItineraryDays } from './tourPublicDetailNormalize'

type ItineraryTimelineProps = {
  tour: TourResponse
}

export function ItineraryTimeline({ tour }: ItineraryTimelineProps) {
  const { t } = useTranslation('tours')
  const days = useMemo(() => normalizeItineraryDays(tour.itineraryDays), [tour.itineraryDays])
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (days.length === 0 && !tour.itinerarySummary?.trim()) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300/90 bg-white/50 p-8 text-center text-sm text-slate-600 shadow-inner backdrop-blur-sm">
        {String(t('detail.itinerary.empty'))}
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-white/40 bg-white/60 p-5 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-md md:p-7">
      <h2 className="font-serif text-xl font-semibold text-slate-900 md:text-2xl">
        {String(t('detail.itineraryTitle'))}
      </h2>

      {tour.itinerarySummary?.trim() ? (
        <div className="mt-4 rounded-xl border border-teal-100/80 bg-gradient-to-r from-teal-50/80 to-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
            {String(t('detail.itinerarySummaryTitle'))}
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-800">
            {tour.itinerarySummary}
          </p>
        </div>
      ) : null}

      {days.length > 0 ? (
        <ol className="relative mt-8 space-y-5 border-l-2 border-dashed border-teal-200/80 pl-6">
          {days.map((day, index) => (
            <li key={`${day.id}-${index}`} className="relative">
              <span className="absolute -left-[31px] top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 text-xs font-bold text-white shadow-md">
                {day.dayNumber ?? index + 1}
              </span>
              <div className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  {String(t('detail.itinerary.dayLabel'))} {day.dayNumber ?? index + 1}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {day.title ?? String(t('detail.itinerary.untitledDay'))}
                </h3>
                {day.description ? (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {day.description}
                  </p>
                ) : null}
                {day.overnightDestinationId != null ? (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" aria-hidden />
                    {String(t('detail.itinerary.overnight'))} #{day.overnightDestinationId}
                  </p>
                ) : null}

                {day.items.length > 0 ? (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      {String(t('detail.itineraryItems'))}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {day.items.map((it) => {
                        const key = `${day.id}-${it.id}`
                        const isOpen = open[key]
                        const hasBody =
                          Boolean(it.description?.trim()) ||
                          Boolean(it.locationName?.trim()) ||
                          Boolean(it.itemType?.trim())
                        return (
                          <li key={it.id} className="rounded-lg bg-slate-50/90">
                            {hasBody ? (
                              <button
                                type="button"
                                onClick={() => toggle(key)}
                                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-100/90"
                              >
                                <span className="min-w-0">
                                  <span className="text-slate-400">{it.sequenceNo}. </span>
                                  {it.title}
                                </span>
                                {isOpen ? (
                                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                                ) : (
                                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                                )}
                              </button>
                            ) : (
                              <div className="px-3 py-2 text-sm text-slate-800">
                                <span className="text-slate-400">{it.sequenceNo}. </span>
                                {it.title}
                              </div>
                            )}
                            {hasBody && isOpen ? (
                              <div className="border-t border-slate-200/80 px-3 py-2 text-sm text-slate-600">
                                {it.itemType ? (
                                  <p className="text-xs uppercase text-slate-400">{it.itemType}</p>
                                ) : null}
                                {it.locationName ? (
                                  <p className="mt-1 flex items-center gap-1 text-slate-700">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                    {it.locationName}
                                  </p>
                                ) : null}
                                {it.description ? (
                                  <p className="mt-2 whitespace-pre-line leading-relaxed">
                                    {it.description}
                                  </p>
                                ) : null}
                              </div>
                            ) : null}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  )
}
