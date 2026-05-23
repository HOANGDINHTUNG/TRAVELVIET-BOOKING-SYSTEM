import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronLeft, Clock, MapPin, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import type { TourResponse } from '../../types/publicTour'
import {
  buildTourBreadcrumbTrail,
  extractTourRouteStops,
} from '../../utils/tourRoutePath'
import { TourDetailBreadcrumbs } from './TourDetailBreadcrumbs'
import { ChecklistPanel } from './ChecklistPanel'
import { ItineraryTimeline } from './ItineraryTimeline'
import { ProductDetailsTabs } from './ProductDetailsTabs'
import { RatingSummary } from './RatingSummary'
import { RelatedToursSection } from './RelatedToursSection'
import { SeasonalityStrip } from './SeasonalityStrip'
import { TagRow } from './TagRow'
import { TourPublicDetailImageGallery } from './TourPublicDetailImageGallery'
import { TourPublicServiceChips } from './TourPublicServiceChips'
import { TourPublicDetailMobileCtaBar } from './TourPublicDetailMobileCtaBar'
import { TourStickyPurchaseCard } from './TourStickyPurchaseCard'
import { TourSustainabilityScores } from './TourSustainabilityScores'
import {
  TOUR_BOOKING_ANCHOR_ID,
  TOUR_SCHEDULES_ANCHOR_ID,
} from './tourPublicDetailConstants'

type TourPublicDetailShellProps = {
  tour: TourResponse
  bookingPanel: ReactNode
  /** Chỉ phần `<TourScheduleSelector />` — shell bọc section + tiêu đề. */
  scheduleSelector: ReactNode
  /** Đã chọn lịch khởi hành — mobile CTA cuộn tới form đặt chỗ. */
  hasSelectedSchedule?: boolean
}

/**
 * LCP: H1 + giá trong aside render sớm; ảnh gallery slide đầu có fetchPriority + aspect-ratio cố định.
 * Desktop: grid 2 cột — trái gallery + nội dung cuộn; phải sticky đặt tour; gợi ý tour full width.
 */
export function TourPublicDetailShell({
  tour,
  bookingPanel,
  scheduleSelector,
  hasSelectedSchedule = false,
}: TourPublicDetailShellProps) {
  const { t } = useTranslation('tours')
  const routeStops = useMemo(() => extractTourRouteStops(tour), [tour])
  const breadcrumbTrail = useMemo(
    () => buildTourBreadcrumbTrail(tour, routeStops),
    [tour, routeStops],
  )

  const scheduleSection = (
    <section
      id={TOUR_SCHEDULES_ANCHOR_ID}
      className="tour-detail-schedule-section"
    >
      <div className="flex flex-wrap items-start gap-3">
        <span className="tour-detail-step-num" aria-hidden>
          1
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="tour-public-title font-serif text-lg font-bold md:text-xl">
            {String(t('detail.schedulesTitle'))}
          </h2>
          <p className="tour-public-lead mt-1.5 text-sm leading-relaxed">
            {String(t('detail.bookingBandHint'))}
          </p>
        </div>
      </div>
      <div className="mt-5">{scheduleSelector}</div>
    </section>
  )

  const bookingAside = (
    <aside className="tour-public-layout__booking w-full shrink-0 space-y-5">
      <div className="tour-detail-booking-card">
        {tour.isFeatured ? (
          <p className="tour-detail-featured-badge">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {String(t('detail.featured'))}
          </p>
        ) : null}

        <div className="tour-detail-chips">
          {tour.destinationName ? (
            <span className="tour-detail-chip tour-detail-chip--primary">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {tour.destinationName}
              {tour.destinationProvince ? ` · ${tour.destinationProvince}` : ''}
            </span>
          ) : null}
          {tour.durationDays != null ? (
            <span className="tour-detail-chip">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {tour.durationDays} {String(t('detail.daysShort'))}
              {tour.durationNights != null
                ? ` · ${tour.durationNights} ${String(t('detail.nightsShort'))}`
                : ''}
            </span>
          ) : null}
        </div>

        <h1 className="tour-detail-main-title">
          {tour.name ?? '—'}
        </h1>

        {tour.shortDescription ? (
          <p className="tour-detail-short-desc">
            {tour.shortDescription}
          </p>
        ) : null}

        <TourPublicServiceChips tour={tour} />

        {(tour.transportType || tour.tripMode || tour.code) ? (
          <div className="tour-detail-meta-tags">
            {tour.transportType ? (
              <span className="tour-detail-meta-tag">
                {tour.transportType}
              </span>
            ) : null}
            {tour.tripMode ? (
              <span className="tour-detail-meta-tag">
                {tour.tripMode}
              </span>
            ) : null}
            {tour.code ? (
              <span className="tour-detail-meta-tag tour-detail-meta-tag--mono">
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
        <div className="mt-5 space-y-4">
          <TourSustainabilityScores tour={tour} />
          <TourStickyPurchaseCard tour={tour} />
        </div>
      </div>

      <div className="hidden lg:block">{scheduleSection}</div>

      <div className="tour-detail-booking-panel hidden lg:block">
        {bookingPanel}
      </div>
    </aside>
  )

  return (
    <div className="tour-public-shell relative overflow-x-clip pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-10">
      <div className="tour-detail-blob tour-detail-blob--left" aria-hidden />
      <div className="tour-detail-blob tour-detail-blob--right" aria-hidden />
      <div className="tour-detail-blob tour-detail-blob--bottom" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-2 lg:px-8 lg:pb-8 lg:pt-3">
        <TourDetailBreadcrumbs trail={breadcrumbTrail} />

        <Link
          to="/tours?domesticOnly=true"
          className="tour-detail-back-btn"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          {String(t('detail.backToList'))}
        </Link>

        <div className="tour-public-layout mt-6">
          <div className="tour-public-layout__body">
            <div className="tour-public-layout__main flex flex-col gap-8 lg:gap-10">
              <div className="tour-public-detail-main min-w-0">
                <TourPublicDetailImageGallery
                  media={tour.media}
                  altFallback={tour.name}
                />
                <ProductDetailsTabs tour={tour} className="mt-4 lg:mt-5" />
              </div>

              <div className="lg:hidden">{scheduleSection}</div>

              <div
                id={TOUR_BOOKING_ANCHOR_ID}
                className="tour-detail-booking-panel scroll-mt-24 lg:hidden"
              >
                {bookingPanel}
              </div>

              <div className="space-y-10 md:space-y-12">
                <ItineraryTimeline tour={tour} />
                <SeasonalityStrip tour={tour} />
                <ChecklistPanel tour={tour} />
              </div>
            </div>

            {bookingAside}
          </div>

          <div className="tour-public-layout__below mt-10 lg:mt-12">
            <RelatedToursSection tour={tour} />
          </div>
        </div>
      </div>

      <TourPublicDetailMobileCtaBar hasSelectedSchedule={hasSelectedSchedule} />
    </div>
  )
}
