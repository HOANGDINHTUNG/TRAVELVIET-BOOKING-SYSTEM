import { useCallback, useEffect, useMemo, useState } from 'react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  MapPin,
  Ticket,
  Zap,
} from 'lucide-react'
import { catalogTourLinks, tourApi } from '@/api/server/Tour.api'
import { SmoothCarouselTrack } from '@/components/ui/SmoothCarousel/SmoothCarouselTrack'
import { useSmoothInfiniteCarousel } from '@/components/ui/SmoothCarousel/useSmoothInfiniteCarousel'
import {
  TourQuickViewDialog,
  type TourQuickViewPayload,
} from '@/components/ui/TourCard/TourQuickViewDialog'
import type { Tour } from '../../database/interface/publicTravel'
import { tourDetailPath } from '../../../tours/utils/slug'
import {
  dealEndsAtMs,
  displayDepartureCity,
  displayDepartureDate,
  displaySeatsLeft,
  displayTourCode,
  formatCountdown,
  formatDealPriceVnd,
  LAST_MINUTE_DEAL_COUNT,
  resolveListPrice,
  resolveTourCardImage,
} from './lastMinuteDealsUtils'
import { inclusionBadgeLabels } from '@/module/tours/utils/tourInclusionBadges'
import './LastMinuteDealsSection.css'

/** Cùng pattern hàng BEACH & ISLAND: tối đa 8 thẻ, 4 slot, loop vô hạn */
const MAX_TOURS = LAST_MINUTE_DEAL_COUNT
const VISIBLE_SLOTS = 4

function useDealCountdown(tourId: number) {
  const endMs = useMemo(() => dealEndsAtMs(tourId), [tourId])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return formatCountdown(endMs - now)
}

function CountdownBadge({ tourId, t }: { tourId: number; t: TFunction }) {
  const { days, time } = useDealCountdown(tourId)
  const label =
    days > 0
      ? String(t('homePage.lastMinuteDeals.dayCountdown', { days, time }))
      : time

  return <span className="lmd-card__countdown">{label}</span>
}

function FlashDealCard({
  tour,
  t,
  translateTitle,
  translateDays,
  translateLocation,
  onQuickView,
}: {
  tour: Tour
  t: TFunction
  translateTitle: (tour: Tour, fallback: string) => string
  translateDays: (tour: Tour, fallback: string) => string
  translateLocation: (tour: Tour, fallback: string) => string
  onQuickView: () => void
}) {
  const title = translateTitle(tour, tour.title)
  const listPrice = resolveListPrice(tour)
  const detailPath = tourDetailPath(tour.id, tour.title)
  const seats = displaySeatsLeft(tour)
  const imageUrl = resolveTourCardImage(tour)
  const inclusionBadges = inclusionBadgeLabels(tour.inclusionFlags)

  return (
    <article className="lmd-card">
      <div className="lmd-card__media">
        {imageUrl ? (
          <img src={imageUrl} alt={title} loading="lazy" />
        ) : (
          <div className="lmd-card__media-empty" aria-hidden />
        )}
        <CountdownBadge tourId={tour.id} t={t} />
        <button
          type="button"
          className="lmd-card__quick"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onQuickView()
          }}
        >
          <Eye size={15} strokeWidth={2.2} aria-hidden />
          {String(t('homePage.lastMinuteDeals.quickView'))}
        </button>
      </div>

      <div className="lmd-card__body">
        <h3 className="lmd-card__title">{title}</h3>
        <p className="lmd-card__code">
          <Ticket size={14} strokeWidth={2} aria-hidden />
          <span>{displayTourCode(tour)}</span>
        </p>
        {inclusionBadges.length > 0 ? (
          <div className="lmd-card__badges" aria-label="Dịch vụ bao gồm">
            {inclusionBadges.map((label) => (
              <span key={label} className="lmd-card__badge">
                {label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="lmd-card__meta-row">
          <span>
            <Calendar size={14} strokeWidth={2} aria-hidden />
            {displayDepartureDate(tour)}
          </span>
          <span>
            <Clock size={14} strokeWidth={2} aria-hidden />
            {translateDays(tour, tour.days)}
          </span>
        </div>
        <div className="lmd-card__meta-row">
          <span>
            <MapPin size={14} strokeWidth={2} aria-hidden />
            {displayDepartureCity(tour, translateLocation(tour, tour.location))}
          </span>
          <span className="lmd-card__seats">
            {String(t('homePage.lastMinuteDeals.seatsLeft', { count: seats }))}
          </span>
        </div>
      </div>

      <div className="lmd-card__foot">
        <div className="lmd-card__price">
          <p className="lmd-card__price-label">
            {String(t('homePage.lastMinuteDeals.priceFrom'))}{' '}
            {listPrice != null && listPrice > tour.price ? (
              <span className="lmd-card__price-old">{formatDealPriceVnd(listPrice)}</span>
            ) : null}
          </p>
          <p className="lmd-card__price-now">{formatDealPriceVnd(tour.price)}</p>
        </div>
        <Link className="lmd-card__book" to={detailPath}>
          {String(t('homePage.lastMinuteDeals.bookNow'))}
        </Link>
      </div>
    </article>
  )
}

type LastMinuteDealsSectionProps = {
  tours: Tour[]
  loading?: boolean
}

export function LastMinuteDealsSection({ tours, loading = false }: LastMinuteDealsSectionProps) {
  const { t, i18n } = useTranslation()
  const [quickView, setQuickView] = useState<TourQuickViewPayload | null>(null)
  const [fallbackTours, setFallbackTours] = useState<Tour[]>([])
  const [fallbackLoading, setFallbackLoading] = useState(false)

  /** Redux có thể rỗng khi fetch destinations lỗi — tự gọi API flash (cùng query homeSlice). */
  useEffect(() => {
    if (loading || tours.length > 0) {
      setFallbackTours([])
      return
    }

    let cancelled = false
    setFallbackLoading(true)

    void tourApi
      .searchPublicTours({
        tagCodes: ['HOME_FLASH_SALE'],
        featuredOnly: true,
        size: 12,
        sortBy: 'totalBookings',
        sortDir: 'desc',
      })
      .then((rows) => {
        if (!cancelled) {
          setFallbackTours(rows.slice(0, MAX_TOURS))
        }
      })
      .catch(() => {
        if (!cancelled) setFallbackTours([])
      })
      .finally(() => {
        if (!cancelled) setFallbackLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [loading, tours.length])

  const displayTours = tours.length > 0 ? tours : fallbackTours
  const showLoading = loading || (displayTours.length === 0 && fallbackLoading)

  const list = useMemo(() => displayTours.slice(0, MAX_TOURS), [displayTours])
  const n = list.length

  const carousel = useSmoothInfiniteCarousel({
    itemCount: n,
    visibleCount: VISIBLE_SLOTS,
    loop: true,
  })

  const trackTours = useMemo(() => {
    if (n === 0) return []
    const clones = carousel.cloneCount > 0 ? list.slice(0, carousel.cloneCount) : []
    return [...list, ...clones]
  }, [carousel.cloneCount, list, n])

  const translateTourField = useCallback(
    (tour: Tour, field: 'title' | 'days' | 'location', fallback: string) => {
      if (!tour.translationKey) return fallback
      const key = `data.tours.${tour.translationKey}.${field}`
      return i18n.exists(key) ? t(key) : fallback
    },
    [i18n, t],
  )

  const openQuickView = useCallback(
    (tour: Tour) => {
      setQuickView({
        title: translateTourField(tour, 'title', tour.title),
        imageUrl: resolveTourCardImage(tour) || tour.image,
        location: translateTourField(tour, 'location', tour.location),
        duration: translateTourField(tour, 'days', tour.days),
        price: tour.price,
        programCode: displayTourCode(tour),
        attractions:
          tour.highlights?.[0]?.trim() ||
          translateTourField(tour, 'location', tour.location),
        cuisine:
          tour.highlights?.[1]?.trim() ||
          String(t('tourCard.quickViewModal.defaultCuisine')),
        detailPath: tourDetailPath(tour.id, tour.title),
      })
    },
    [t, translateTourField],
  )

  const sectionTitle = String(t('homePage.lastMinuteDeals.sectionTitle'))
  const viewMoreLabel = String(t('homePage.lastMinuteDeals.viewMore'))
  const ariaPrev = String(t('homePage.lastMinuteDeals.prev'))
  const ariaNext = String(t('homePage.lastMinuteDeals.next'))

  return (
    <section className="lmd-section" aria-labelledby="last-minute-deals-title">
      <div className="lmd-section__burst" aria-hidden />

      <div className="lmd-section__inner">
        <header className="lmd-head">
          <div className="lmd-head__copy">
            <h2 id="last-minute-deals-title" className="lmd-head__title">
              <Zap className="lmd-head__bolt" size={28} strokeWidth={2.5} aria-hidden />
              {sectionTitle}
            </h2>
            <p className="lmd-head__lead">{String(t('homePage.lastMinuteDeals.sectionLead'))}</p>
          </div>
          <div className="lmd-head__actions">
            <Link className="lmd-head__more" to={catalogTourLinks.lastMinuteDeals}>
              <span>{viewMoreLabel}</span>
              <span className="lmd-head__more-icon" aria-hidden>
                <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </Link>
            {carousel.canNavigate && (
              <div className="lmd-row-nav">
                <button
                  type="button"
                  aria-label={ariaPrev}
                  onClick={carousel.goPrev}
                  className="lmd-row-arrow"
                >
                  <ChevronLeft size={22} aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={ariaNext}
                  onClick={carousel.goNext}
                  className="lmd-row-arrow"
                >
                  <ChevronRight size={22} aria-hidden />
                </button>
              </div>
            )}
          </div>
        </header>

        {!showLoading && displayTours.length === 0 ? (
          <p className="lmd-empty">{String(t('homePage.lastMinuteDeals.empty'))}</p>
        ) : (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={sectionTitle}
            className="lmd-row-viewport-wrap"
          >
            {showLoading && list.length === 0 ? (
              <div className="lmd-track lmd-track--skeleton" aria-hidden>
                {Array.from({ length: VISIBLE_SLOTS }).map((_, i) => (
                  <div key={`lmd-skel-${i}`} className="lmd-slide" data-carousel-slide>
                    <div className="lmd-card lmd-card--skeleton" />
                  </div>
                ))}
              </div>
            ) : (
              <SmoothCarouselTrack
                viewportRef={carousel.viewportRef}
                offsetX={carousel.offsetX}
                durationSec={carousel.durationSec}
                onTransitionComplete={carousel.onTransitionComplete}
                className="lmd-viewport"
                trackClassName="lmd-track"
              >
                {trackTours.map((tour, index) => (
                  <div key={`${tour.id}-${index}`} className="lmd-slide" data-carousel-slide>
                    <FlashDealCard
                      tour={tour}
                      t={t}
                      translateTitle={(item, fb) => translateTourField(item, 'title', fb)}
                      translateDays={(item, fb) => translateTourField(item, 'days', fb)}
                      translateLocation={(item, fb) =>
                        translateTourField(item, 'location', fb)
                      }
                      onQuickView={() => openQuickView(tour)}
                    />
                  </div>
                ))}
              </SmoothCarouselTrack>
            )}
          </div>
        )}
      </div>

      <TourQuickViewDialog
        open={quickView != null}
        onOpenChange={(open) => {
          if (!open) setQuickView(null)
        }}
        tour={quickView}
      />
    </section>
  )
}
