import { useTranslation } from 'react-i18next'
import { CalendarRange, Sparkles } from 'lucide-react'
import { useDisplayMoney } from '@/hooks/useDisplayMoney'
import type { TourResponse } from '../../types/publicTour'
import { resolveListPrice } from '../../utils/tourSustainability'
import { TOUR_SCHEDULES_ANCHOR_ID } from './tourPublicDetailConstants'
import '../../styles/TourPublicDetailPage.css'

type TourStickyPurchaseCardProps = {
  tour: TourResponse
  schedulesAnchorId?: string
}

function scrollToSchedules(anchorId: string) {
  document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Card glass: giá niêm yết (listPrice từ BE) + giá bán, badge chỗ, CTA cuộn tới lịch khởi hành.
 */
export function TourStickyPurchaseCard({
  tour,
  schedulesAnchorId = TOUR_SCHEDULES_ANCHOR_ID,
}: TourStickyPurchaseCardProps) {
  const { t } = useTranslation('tours')
  const base = tour.basePrice ?? 0
  const listPrice = resolveListPrice({
    price: base,
    listPrice: tour.listPrice,
    basePrice: tour.basePrice,
  })
  const mainPriceLabel = useDisplayMoney(base > 0 ? base : null)
  const listPriceLabel = useDisplayMoney(
    listPrice != null && listPrice > base ? listPrice : null,
  )
  const stockLimited = (tour.totalBookings ?? 0) < 25

  return (
    <div className="tour-purchase-card">
      <div className="tour-purchase-header">
        <span className={`tour-purchase-stock ${stockLimited ? 'tour-purchase-stock--limited' : 'tour-purchase-stock--ok'}`}>
          {stockLimited ? String(t('detail.stock.limited')) : String(t('detail.stock.inStock'))}
        </span>
        {tour.isFeatured ? (
          <span className="tour-purchase-featured">
            <Sparkles className="h-3 w-3" aria-hidden />
            {String(t('detail.featured'))}
          </span>
        ) : null}
      </div>

      <div className="tour-purchase-price-row">
        <div>
          <p className="tour-purchase-from-label">
            {String(t('detail.fromPrice'))}
          </p>
          <div className="tour-purchase-price-wrap">
            {listPrice != null && listPrice > base ? (
              <span className="tour-purchase-list-price">
                {listPriceLabel}
              </span>
            ) : null}
            <span className="tour-purchase-main-price">
              {mainPriceLabel}
            </span>
          </div>
        </div>
      </div>

      {(tour.durationDays ?? tour.durationNights) != null ? (
        <p className="tour-purchase-duration">
          <CalendarRange className="h-4 w-4" aria-hidden />
          {tour.durationDays != null ? (
            <>{tour.durationDays} {String(t('detail.daysShort'))}</>
          ) : null}
          {tour.durationNights != null ? (
            <>{tour.durationDays != null ? ' · ' : null}{tour.durationNights} {String(t('detail.nightsShort'))}</>
          ) : null}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => scrollToSchedules(schedulesAnchorId)}
        className="tour-purchase-cta"
      >
        {String(t('detail.cta.pickSchedule'))}
      </button>
    </div>
  )
}
