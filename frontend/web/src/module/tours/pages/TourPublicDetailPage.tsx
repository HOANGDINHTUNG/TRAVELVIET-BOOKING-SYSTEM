import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
  ChevronLeft,
  Clock,
  MapPin,
  Sparkles,
  Star,
} from 'lucide-react'
import { handleApiError } from '../../../lib/handleApiError'
import {
  usePublicTourSchedulesQuery,
  useTourDetailQuery,
} from '../hooks/usePublicTours'
import { extractTourIdFromSlug } from '../utils/slug'
import { formatCurrencyVnd } from '../../management/schedules/utils/currency'
import TourGallery from '../components/TourGallery'
import TourItineraryTimeline from '../components/TourItineraryTimeline'
import TourScheduleSelector from '../components/TourScheduleSelector'
import BookingPanel from '../components/BookingPanel'
import type { TourScheduleResponse } from '../types/publicTour'

/**
 * Trang chi tiết Tour PUBLIC.
 * - URL: `/tour/:slug` (slug encode id ở cuối, vd: `halong-bay-3-days-42`)
 * - Resolve id: `extractTourIdFromSlug(slug)` (fallback về numeric id thuần)
 * - Layout: 2 cột — nội dung trái, BookingPanel sticky phải
 */
function TourPublicDetailPage() {
  const { t } = useTranslation('tours')
  const params = useParams<{ slug: string }>()
  const tourId = extractTourIdFromSlug(params.slug)

  const tourQuery = useTourDetailQuery(tourId)
  const schedulesQuery = usePublicTourSchedulesQuery(tourId)

  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  )

  const selectedSchedule = useMemo<TourScheduleResponse | null>(() => {
    if (selectedScheduleId == null) return null
    return (
      (schedulesQuery.data ?? []).find((s) => s.id === selectedScheduleId) ??
      null
    )
  }, [schedulesQuery.data, selectedScheduleId])

  if (tourId == null) {
    return <Navigate to="/tours" replace />
  }

  if (tourQuery.isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="h-72 w-full animate-pulse rounded-2xl bg-slate-100" />
      </div>
    )
  }

  if (tourQuery.error || !tourQuery.data) {
    const errorMessage = tourQuery.error
      ? handleApiError(
          tourQuery.error,
          String(t('detail.errorMessage')),
        )
      : String(t('detail.notFound'))
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{String(t('detail.errorTitle'))}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted,#64748b)]">
          {errorMessage}
        </p>
        <Link
          to="/tours"
          className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--color-primary,#0ea5e9)] hover:underline"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {String(t('detail.backToList'))}
        </Link>
      </div>
    )
  }

  const tour = tourQuery.data

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 py-6 lg:px-6"
    >
      <Link
        to="/tours"
        className="inline-flex items-center gap-1 text-xs text-[var(--color-muted,#64748b)] hover:text-slate-900"
      >
        <ChevronLeft className="h-3 w-3" aria-hidden />
        {String(t('detail.backToList'))}
      </Link>

      <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: content */}
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {tour.destinationName ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                  <MapPin className="h-3 w-3" aria-hidden />
                  {tour.destinationName}
                  {tour.destinationProvince
                    ? ` · ${tour.destinationProvince}`
                    : ''}
                </span>
              ) : null}
              {tour.durationDays ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                  <Clock className="h-3 w-3" aria-hidden />
                  {tour.durationDays} {String(t('detail.daysShort'))}
                  {tour.durationNights
                    ? ` · ${tour.durationNights} ${String(t('detail.nightsShort'))}`
                    : ''}
                </span>
              ) : null}
              {tour.averageRating != null && tour.totalReviews ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-800">
                  <Star className="h-3 w-3 fill-current" aria-hidden />
                  {tour.averageRating.toFixed(1)} ({tour.totalReviews})
                </span>
              ) : null}
              {tour.isFeatured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-100 px-2 py-0.5 text-fuchsia-800">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  {String(t('detail.featured'))}
                </span>
              ) : null}
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {tour.name ?? '—'}
            </h1>
            {tour.shortDescription ? (
              <p className="text-sm text-[var(--color-muted,#475569)]">
                {tour.shortDescription}
              </p>
            ) : null}
            <p className="text-sm">
              <span className="text-[var(--color-muted,#64748b)]">
                {String(t('detail.fromPrice'))}:{' '}
              </span>
              <strong className="text-lg text-[var(--color-primary,#0ea5e9)]">
                {formatCurrencyVnd(tour.basePrice)}
              </strong>
            </p>
          </header>

          {/* Gallery */}
          <TourGallery media={tour.media} altFallback={tour.name ?? undefined} />

          {/* Description */}
          {tour.description ? (
            <section>
              <h2 className="mb-2 text-lg font-semibold">
                {String(t('detail.descriptionTitle'))}
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {tour.description}
              </p>
            </section>
          ) : null}

          {tour.highlights ? (
            <section>
              <h2 className="mb-2 text-lg font-semibold">
                {String(t('detail.highlightsTitle'))}
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {tour.highlights}
              </p>
            </section>
          ) : null}

          {/* Itinerary */}
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              {String(t('detail.itineraryTitle'))}
            </h2>
            <TourItineraryTimeline tour={tour} />
          </section>

          {/* Inclusions / Exclusions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {tour.inclusions ? (
              <section className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                <h3 className="mb-1 text-sm font-semibold text-emerald-900">
                  {String(t('detail.inclusionsTitle'))}
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-emerald-900/80">
                  {tour.inclusions}
                </p>
              </section>
            ) : null}
            {tour.exclusions ? (
              <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-3">
                <h3 className="mb-1 text-sm font-semibold text-rose-900">
                  {String(t('detail.exclusionsTitle'))}
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-rose-900/80">
                  {tour.exclusions}
                </p>
              </section>
            ) : null}
          </div>

          {/* Schedules */}
          <section id="schedules" className="scroll-mt-20">
            <h2 className="mb-3 text-lg font-semibold">
              {String(t('detail.schedulesTitle'))}
            </h2>
            <TourScheduleSelector
              schedules={schedulesQuery.data}
              isLoading={schedulesQuery.isPending}
              selectedId={selectedScheduleId}
              onSelect={(s) => setSelectedScheduleId(s.id)}
            />
          </section>
        </div>

        {/* Right: sticky booking panel */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <BookingPanel tourId={tour.id} schedule={selectedSchedule} />
        </aside>
      </div>
    </motion.section>
  )
}

export default TourPublicDetailPage
