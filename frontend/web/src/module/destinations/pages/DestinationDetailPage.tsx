import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { destinationApi } from '../../../api/server/Destination.api'
import { weatherApi } from '../../../api/server/Weather.api'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import { Footer } from '../../../components/Footer/Footer'
import { DestinationActivitiesSection } from '../components/DestinationActivitiesSection'
import { DestinationDetailHero } from '../components/DestinationDetailHero'
import { DestinationEngagementSection } from '../components/DestinationEngagementSection'
import { DestinationFoodSpecialtySection } from '../components/DestinationFoodSpecialtySection'
import { DestinationMediaSection } from '../components/DestinationMediaSection'
import { DestinationOverviewSection } from '../components/DestinationOverviewSection'
import { DestinationPlannerCta } from '../components/DestinationPlannerCta'
import { DestinationStatsSection } from '../components/DestinationStatsSection'
import { DestinationTipsEventsSection } from '../components/DestinationTipsEventsSection'
import { DestinationWeatherSection } from '../components/DestinationWeatherSection'
import type { DestinationDetail } from '../database/interface/destination'
import {
  destinationDetailCopyByLocale,
  getDestinationDetailLocale,
} from '../utils/destinationDetailCopy'
import { getErrorMessage } from '../utils/destinationDetailFormatters'
import { createDestinationDetailViewModel } from '../utils/destinationDetailViewModel'
import {
  emptyDestinationDetailWeather,
  type DestinationDetailWeatherState,
} from '../utils/destinationDetailWeather'
import '../styles/DestinationDetailPage.css'
import '../styles/DestinationDetailHero.css'
import '../styles/DestinationDetailOverview.css'
import '../styles/DestinationDetailStats.css'
import '../styles/DestinationDetailWeather.css'
import '../styles/DestinationDetailMedia.css'
import '../styles/DestinationDetailContent.css'
import '../styles/DestinationDetailCta.css'

function DestinationDetailPage() {
  const { uuid } = useParams()
  const { i18n } = useTranslation()
  const locale = getDestinationDetailLocale(i18n.language)
  const copy = destinationDetailCopyByLocale[locale]
  const [detail, setDetail] = useState<DestinationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<DestinationDetailWeatherState>(
    emptyDestinationDetailWeather,
  )

  useEffect(() => {
    let isActive = true

    async function loadDestination() {
      if (!uuid) {
        setError(copy.missingUuid)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      setWeather({ ...emptyDestinationDetailWeather, loading: true })

      try {
        const destination = await destinationApi.getDestinationByUuid(uuid)

        if (!isActive) {
          return
        }

        setDetail(destination)

        const [forecasts, alerts, crowdPredictions] = await Promise.allSettled([
          weatherApi.getDestinationForecasts(uuid),
          weatherApi.getDestinationAlerts(uuid),
          weatherApi.getDestinationCrowdPredictions(uuid),
        ])

        if (!isActive) {
          return
        }

        setWeather({
          forecasts: forecasts.status === 'fulfilled' ? forecasts.value : [],
          alerts: alerts.status === 'fulfilled' ? alerts.value : [],
          crowdPredictions:
            crowdPredictions.status === 'fulfilled'
              ? crowdPredictions.value
              : [],
          loading: false,
          error:
            forecasts.status === 'rejected' &&
            alerts.status === 'rejected' &&
            crowdPredictions.status === 'rejected'
              ? copy.loadError
              : null,
        })
      } catch (loadError) {
        if (!isActive) {
          return
        }

        setError(getErrorMessage(loadError, copy.loadError))
        setWeather({ ...emptyDestinationDetailWeather, loading: false })
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadDestination()

    return () => {
      isActive = false
    }
  }, [copy.loadError, copy.missingUuid, uuid])

  const viewModel = useMemo(
    () => (detail ? createDestinationDetailViewModel(detail, copy) : null),
    [copy, detail],
  )

  if (loading) {
    return <PageLoader label={copy.loading} />
  }

  if (error || !detail || !viewModel) {
    return (
      <>
        <div className="destination-detail-error-action">
          <Link to="/">
            <ArrowLeft aria-hidden="true" />
            {copy.backHome}
          </Link>
        </div>
        <ErrorBlock
          title={copy.detailErrorTitle}
          message={error || copy.missingDestination}
        />
      </>
    )
  }

  return (
    <>
      <main className="destination-detail-page">
        <DestinationDetailHero
          copy={copy}
          detail={detail}
          viewModel={viewModel}
        />
        <DestinationOverviewSection
          copy={copy}
          detail={detail}
          viewModel={viewModel}
        />
        <DestinationStatsSection stats={viewModel.stats} />
        <DestinationWeatherSection
          copy={copy}
          detail={detail}
          weather={weather}
        />
        <DestinationEngagementSection
          copy={copy}
          detail={detail}
          locale={locale}
        />
        <DestinationMediaSection
          copy={copy}
          detail={detail}
          viewModel={viewModel}
        />
        <DestinationFoodSpecialtySection copy={copy} detail={detail} />
        <DestinationActivitiesSection copy={copy} detail={detail} />
        <DestinationTipsEventsSection
          copy={copy}
          detail={detail}
          locale={locale}
        />
        <DestinationPlannerCta copy={copy} detail={detail} />
      </main>
      <Footer />
    </>
  )
}

export default DestinationDetailPage
