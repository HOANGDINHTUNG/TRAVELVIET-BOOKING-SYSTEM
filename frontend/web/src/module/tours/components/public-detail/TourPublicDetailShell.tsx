import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronLeft, Clock, MapPin, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import type { TourResponse } from '../../types/publicTour'
import { ChecklistPanel } from './ChecklistPanel'
import { ItineraryTimeline } from './ItineraryTimeline'
import { ProductDetailsTabs } from './ProductDetailsTabs'
import { RatingSummary } from './RatingSummary'
import { RelatedToursMock } from './RelatedToursMock'
import { SeasonalityStrip } from './SeasonalityStrip'
import { TagRow } from './TagRow'
import { TourPublicDetailImageGallery } from './TourPublicDetailImageGallery'
import { TourPublicDetailMobileCtaBar } from './TourPublicDetailMobileCtaBar'
import { TourStickyPurchaseCard } from './TourStickyPurchaseCard'
import { TOUR_SCHEDULES_ANCHOR_ID } from './tourPublicDetailConstants'

type TourPublicDetailShellProps = {
  tour: TourResponse
  bookingPanel: ReactNode
  /** Chỉ phần `<TourScheduleSelector />` — shell bọc section + tiêu đề. */
  scheduleSelector: ReactNode
}

/**
 * LCP: H1 + giá trong aside render sớm; ảnh gallery slide đầu có fetchPriority + aspect-ratio cố định.
 */
export function TourPublicDetailShell({
  tour,
  bookingPanel,
  scheduleSelector,
}: TourPublicDetailShellProps) {
  const { t } = useTranslation('tours')

  return (
    <div className="tour-public-shell relative overflow-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-10">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-teal-400/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/3 h-[380px] w-[380px] rounded-full bg-cyan-400/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-[280px] w-[280px] rounded-full bg-amber-200/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-md transition hover:border-teal-300/60 hover:bg-white hover:text-teal-900"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          {String(t('detail.backToList'))}
        </Link>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row-reverse lg:items-start lg:gap-12">
          <aside className="w-full shrink-0 space-y-5 lg:sticky lg:top-6 lg:max-w-[420px] lg:self-start">
            <div className="rounded-3xl border border-white/30 bg-white/55 p-5 shadow-2xl shadow-slate-900/10 ring-1 ring-teal-500/10 backdrop-blur-xl md:p-6">
              {tour.isFeatured ? (
                <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400/25 to-orange-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 ring-1 ring-amber-300/40">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {String(t('detail.featured'))}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                {tour.destinationName ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/60 bg-teal-50/80 px-2.5 py-1 font-semibold text-teal-900">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                    {tour.destinationName}
                    {tour.destinationProvince ? ` · ${tour.destinationProvince}` : ''}
                  </span>
                ) : null}
                {tour.durationDays != null ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 px-2.5 py-1 font-medium text-slate-800">
                    <Clock className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                    {tour.durationDays} {String(t('detail.daysShort'))}
                    {tour.durationNights != null
                      ? ` · ${tour.durationNights} ${String(t('detail.nightsShort'))}`
                      : ''}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 font-serif text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl lg:text-[2.1rem]">
                {tour.name ?? '—'}
              </h1>

              {tour.shortDescription ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-[15px]">
                  {tour.shortDescription}
                </p>
              ) : null}

              {(tour.transportType || tour.tripMode || tour.code) ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tour.transportType ? (
                    <span className="rounded-lg bg-slate-900/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
                      {tour.transportType}
                    </span>
                  ) : null}
                  {tour.tripMode ? (
                    <span className="rounded-lg bg-slate-900/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
                      {tour.tripMode}
                    </span>
                  ) : null}
                  {tour.code ? (
                    <span className="rounded-lg bg-slate-900/5 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-500">
                      {tour.code}
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-5">
                <RatingSummary tour={tour} />
              </div>
              <div className="mt-3">
                <TagRow tour={tour} />
              </div>
              <div className="mt-5">
                <TourStickyPurchaseCard tour={tour} />
              </div>
            </div>

            <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/30 bg-white/40 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur-md">
              {bookingPanel}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <TourPublicDetailImageGallery media={tour.media} altFallback={tour.name} />
          </div>
        </div>

        <section
          id={TOUR_SCHEDULES_ANCHOR_ID}
          className="scroll-mt-24 mt-10 rounded-3xl border-2 border-teal-200/60 bg-gradient-to-br from-white via-teal-50/40 to-cyan-50/30 p-5 shadow-xl shadow-teal-900/10 ring-1 ring-teal-900/[0.06] md:p-8"
        >
          <div className="flex flex-wrap items-start gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 text-lg font-black text-white shadow-lg shadow-teal-600/30"
              aria-hidden
            >
              1
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-xl font-bold text-slate-900 md:text-2xl">
                {String(t('detail.schedulesTitle'))}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
                {String(t('detail.bookingBandHint'))}
              </p>
            </div>
          </div>
          <div className="mt-6">{scheduleSelector}</div>
        </section>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/30 bg-white/40 shadow-lg ring-1 ring-slate-900/5 backdrop-blur-md lg:hidden">
          {bookingPanel}
        </div>

        <div className="mt-12 space-y-10 md:space-y-12">
          <ProductDetailsTabs tour={tour} />
          <ItineraryTimeline tour={tour} />
          <SeasonalityStrip tour={tour} />
          <ChecklistPanel tour={tour} />
          <RelatedToursMock />
        </div>
      </div>

      <TourPublicDetailMobileCtaBar />
    </div>
  )
}
