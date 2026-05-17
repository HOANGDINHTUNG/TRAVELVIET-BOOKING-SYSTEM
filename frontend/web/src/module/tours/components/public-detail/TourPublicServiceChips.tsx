import { CalendarDays, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TourResponse } from '../../types/publicTour'
import { inclusionBadgeLabels } from '../../utils/tourInclusionBadges'

type TourPublicServiceChipsProps = {
  tour: TourResponse
}

export function TourPublicServiceChips({ tour }: TourPublicServiceChipsProps) {
  const { t, i18n } = useTranslation('tours')
  const dateLocale = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN'
  const badges = inclusionBadgeLabels(tour.inclusionFlags ?? undefined)
  const depart =
    tour.departureHubs
      ?.map((h) => h.cityNameVi?.trim())
      .filter(Boolean)
      .join(' · ') ||
    tour.primaryDepartureCity?.trim() ||
    null

  const nextDate = tour.nextOpenSchedule?.departureAt
  const seats = tour.nextOpenSchedule?.remainingSeats

  if (!badges.length && !depart && !nextDate) {
    return null
  }

  return (
    <div className="mt-4 space-y-3">
      {depart ? (
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-900">
          <MapPin className="h-4 w-4 text-teal-600" aria-hidden />
          {String(t('detail.departureFrom'))}: {depart}
        </p>
      ) : null}
      {nextDate ? (
        <p className="inline-flex items-center gap-1.5 text-sm text-slate-700">
          <CalendarDays className="h-4 w-4 text-teal-600" aria-hidden />
          {String(t('detail.nextDeparture'))}:{' '}
          {new Date(nextDate).toLocaleDateString(dateLocale)}
          {seats != null && Number.isFinite(seats)
            ? ` · ${String(t('detail.schedules.remaining'))} ${seats}`
            : ''}
        </p>
      ) : null}
      {badges.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {badges.map((label) => (
            <li
              key={label}
              className="rounded-full border border-teal-200/70 bg-teal-50/90 px-2.5 py-1 text-xs font-bold text-teal-900"
            >
              {label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
