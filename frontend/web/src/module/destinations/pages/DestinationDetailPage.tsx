import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { destinationApi } from '../../../api/server/Destination.api'
import { weatherApi } from '../../../api/server/Weather.api'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import { Footer } from '../../../components/Footer/Footer'
import { DestinationPublicDetailShell } from '../components/public-detail/DestinationPublicDetailShell'
import type { DestinationDetail } from '../database/interface/destination'
import {
  destinationDetailCopyByLocale,
  getDestinationDetailLocale,
} from '../utils/destinationDetailCopy'
import { getErrorMessage } from '../utils/destinationDetailFormatters'
import { createDestinationDetailViewModel } from '../utils/destinationDetailViewModel'
import {
  buildDestinationWeatherQuery,
  emptyDestinationDetailWeather,
  mapWeatherApiForecasts,
  type DestinationDetailWeatherState,
} from '../utils/destinationDetailWeather'

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

        const [storedForecasts, alerts, crowdPredictions] = await Promise.allSettled([
          weatherApi.getDestinationForecasts(uuid),
          weatherApi.getDestinationAlerts(uuid),
          weatherApi.getDestinationCrowdPredictions(uuid),
        ])

        if (!isActive) {
          return
        }

        let resolvedForecasts =
          storedForecasts.status === 'fulfilled' ? storedForecasts.value : []
        let liveForecastRejected = false

        if (resolvedForecasts.length === 0) {
          try {
            const livePayload = await weatherApi.getForecast({
              q: buildDestinationWeatherQuery(destination),
              days: 1,
              aqi: 'no',
              alerts: 'no',
            })
            resolvedForecasts = mapWeatherApiForecasts(livePayload)
          } catch {
            liveForecastRejected = true
          }
        }

        setWeather({
          forecasts: resolvedForecasts,
          alerts: alerts.status === 'fulfilled' ? alerts.value : [],
          crowdPredictions:
            crowdPredictions.status === 'fulfilled'
              ? crowdPredictions.value
              : [],
          loading: false,
          error:
            storedForecasts.status === 'rejected' &&
            liveForecastRejected &&
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
        <div className="bg-slate-950 p-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white no-underline"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
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
      <DestinationPublicDetailShell
        copy={copy}
        detail={detail}
        locale={locale}
        viewModel={viewModel}
        weather={weather}
      />
      <Footer />
    </>
  )
}

export default DestinationDetailPage
