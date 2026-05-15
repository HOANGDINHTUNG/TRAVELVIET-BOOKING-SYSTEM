import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TourResponse } from '../../types/publicTour'

type RatingSummaryProps = {
  tour: TourResponse
}

export function RatingSummary({ tour }: RatingSummaryProps) {
  const { t } = useTranslation('tours')
  const rating = tour.averageRating
  const reviews = tour.totalReviews ?? 0
  const bookings = tour.totalBookings ?? 0

  if (rating == null && reviews === 0 && bookings === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
      {rating != null ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-amber-900 ring-1 ring-amber-200/60">
          <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden />
          <strong className="text-base text-slate-900">{rating.toFixed(1)}</strong>
          <span className="text-slate-500">
            ({reviews} {String(t('detail.reviewsShort'))})
          </span>
        </span>
      ) : reviews > 0 ? (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {reviews} {String(t('detail.reviewsShort'))}
        </span>
      ) : null}
      {bookings > 0 ? (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {bookings} {String(t('detail.bookingsShort'))}
        </span>
      ) : null}
    </div>
  )
}
