import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Footer } from '@/components/Footer/Footer'
import { ComboSearchFlightBlock } from '../components/ComboSearchFlightBlock'
import { ComboSearchHotelBlock } from '../components/ComboSearchHotelBlock'
import { ComboSearchLoadingSkeleton } from '../components/ComboSearchLoadingSkeleton'
import { ComboSearchSummaryBanner } from '../components/ComboSearchSummaryBanner'
import { getMockComboFlightLegs } from '../data/comboSearchFlightMock'
import { getMockComboHotelResults } from '../data/comboSearchHotelMock'
import { useComboSearchLoading } from '../hooks/useComboSearchLoading'
import {
  buildComboSearchQuery,
  parseComboSearchParams,
} from '../utils/comboSearchParams'
import {
  buildComboRouteDisplay,
  countStayNights,
} from '../utils/comboSearchDisplay'
import './ComboSearchResultsPage.css'

export default function ComboSearchResultsPage() {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'combosPage' })
  const locale = i18n.language?.startsWith('en') ? 'en' : 'vi'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const params = useMemo(() => parseComboSearchParams(searchParams), [searchParams])
  const route = useMemo(() => buildComboRouteDisplay(params, locale), [params, locale])
  const { progress, isLoading } = useComboSearchLoading(searchParams.toString())

  const flightLegs = useMemo(() => getMockComboFlightLegs(params), [params])
  const nights = countStayNights(params.checkIn, params.checkOut)
  const stayTitle = t('results.hotelSection', { nights, days: nights + 1 })
  const hotels = useMemo(() => getMockComboHotelResults(params), [params])

  const onChangeSearch = () => {
    navigate(`/combos?${buildComboSearchQuery(params)}`)
  }

  return (
    <div className="combo-search-results">
      <div className="combo-search-results__inner">
        <ComboSearchSummaryBanner
          params={params}
          route={route}
          locale={locale}
          onChangeSearch={onChangeSearch}
        />

        {isLoading ? (
          <ComboSearchLoadingSkeleton
            progress={progress}
            showFlightSkeleton={params.type === 'flight-hotel'}
          />
        ) : (
          <>
            {params.type === 'flight-hotel' ? (
              <ComboSearchFlightBlock legs={flightLegs} />
            ) : null}
            <ComboSearchHotelBlock hotels={hotels} stayTitle={stayTitle} />
          </>
        )}
      </div>
      {!isLoading ? <Footer /> : null}
    </div>
  )
}
