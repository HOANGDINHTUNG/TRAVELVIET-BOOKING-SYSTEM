import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { CalendarDays, MapPin } from 'lucide-react'
import type { PublicItineraryDay, TourResponse } from '../types/publicTour'

type TourItineraryTimelineProps = {
  tour: TourResponse
}

/**
 * Itinerary timeline. `BE TourResponse.itineraryDays` đang là `unknown[]` ở
 * scaffold — ta normalize an toàn (không trust shape) trước khi render.
 */
function normalizeDays(input: unknown): PublicItineraryDay[] {
  if (!Array.isArray(input)) return []
  return input
    .filter((it): it is Record<string, unknown> => typeof it === 'object' && it !== null)
    .map((raw) => ({
      dayNumber:
        typeof raw.dayNumber === 'number' ? (raw.dayNumber as number) : null,
      title: typeof raw.title === 'string' ? raw.title : null,
      description:
        typeof raw.description === 'string' ? raw.description : null,
      overnightDestinationId:
        typeof raw.overnightDestinationId === 'number'
          ? (raw.overnightDestinationId as number)
          : null,
    }))
    .sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0))
}

function TourItineraryTimeline({ tour }: TourItineraryTimelineProps) {
  const { t } = useTranslation('tours')
  const days = normalizeDays(tour.itineraryDays)

  if (days.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted,#64748b)]">
        {String(t('detail.itinerary.empty'))}
      </p>
    )
  }

  return (
    <ol className="relative space-y-4 border-l-2 border-dashed border-[var(--color-border,#e2e8f0)] pl-6">
      {days.map((day, index) => (
        <motion.li
          key={`${day.dayNumber ?? index}`}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.25, delay: Math.min(index, 6) * 0.05 }}
          className="relative"
        >
          <span className="absolute -left-[33px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary,#0ea5e9)] text-[11px] font-semibold text-white shadow">
            {day.dayNumber ?? index + 1}
          </span>
          <div className="rounded-xl border border-[var(--color-border,#e2e8f0)] bg-white p-4 shadow-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted,#64748b)]">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {String(t('detail.itinerary.dayLabel'))} {day.dayNumber ?? index + 1}
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              {day.title ?? String(t('detail.itinerary.untitledDay'))}
            </h4>
            {day.description ? (
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {day.description}
              </p>
            ) : null}
            {day.overnightDestinationId ? (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--color-muted,#64748b)]">
                <MapPin className="h-3 w-3" aria-hidden />
                {String(t('detail.itinerary.overnight'))} #{day.overnightDestinationId}
              </p>
            ) : null}
          </div>
        </motion.li>
      ))}
    </ol>
  )
}

export default TourItineraryTimeline
