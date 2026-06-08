import { BedDouble, Plane, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  COMBO_SEARCH_BANNER_IMAGE,
  formatComboSearchDate,
  type ComboRouteDisplay,
} from '../utils/comboSearchDisplay'
import type { ComboSearchParams } from '../utils/comboSearchParams'
import { totalComboGuests } from '../utils/comboSearchParams'

type ComboSearchSummaryBannerProps = {
  params: ComboSearchParams
  route: ComboRouteDisplay
  locale: string
  onChangeSearch: () => void
}

export function ComboSearchSummaryBanner({
  params,
  route,
  locale,
  onChangeSearch,
}: ComboSearchSummaryBannerProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'combosPage' })
  const dateSep = ' > '
  const flightDates = `${formatComboSearchDate(params.departDate, locale)}${dateSep}${formatComboSearchDate(params.returnDate, locale)}`
  const hotelDates = `${formatComboSearchDate(params.checkIn, locale)}${dateSep}${formatComboSearchDate(params.checkOut, locale)}`
  const guestTotal = totalComboGuests(params)

  return (
    <div className="csr-banner">
      <img
        className="csr-banner__city"
        src={COMBO_SEARCH_BANNER_IMAGE}
        alt=""
        width={720}
        height={160}
        loading="lazy"
      />
      <div className="csr-banner__panel">
        <div className="csr-banner__card">
          <div className="csr-banner__col csr-banner__col--route">
            <p className="csr-banner__route">{route.routeTitle}</p>
          </div>

          <div className="csr-banner__vdiv" aria-hidden />

          <div className="csr-banner__col csr-banner__col--details">
            {params.type === 'flight-hotel' ? (
              <div className="csr-banner__row">
                <Plane size={15} strokeWidth={2.2} className="csr-banner__icon" aria-hidden />
                <span className="csr-banner__dates">{flightDates}</span>
                <span className="csr-banner__sep" aria-hidden>
                  |
                </span>
                <span className="csr-banner__meta">{t('results.bannerGuests', { count: guestTotal })}</span>
              </div>
            ) : null}
            <div className="csr-banner__row">
              <BedDouble size={15} strokeWidth={2.2} className="csr-banner__icon" aria-hidden />
              <span className="csr-banner__dates">{hotelDates}</span>
              <span className="csr-banner__sep" aria-hidden>
                |
              </span>
              <span className="csr-banner__meta">{t('results.bannerRooms', { count: params.rooms })}</span>
            </div>
          </div>

          <div className="csr-banner__vdiv" aria-hidden />

          <div className="csr-banner__col csr-banner__col--action">
            <button type="button" className="csr-banner__change" onClick={onChangeSearch}>
              <Search size={15} strokeWidth={2.2} aria-hidden />
              {t('results.changeSearch')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
