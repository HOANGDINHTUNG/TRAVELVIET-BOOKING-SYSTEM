import { CloudSun, Flag, MountainSnow, ShieldAlert } from 'lucide-react'
import type { DestinationDetail } from '../database/interface/destination'
import type { DestinationDetailCopy } from '../utils/destinationDetailCopy'
import { getCrowdLabel } from '../utils/destinationDetailFormatters'
import type { DestinationDetailWeatherState } from '../utils/destinationDetailWeather'
import { DestinationSectionTitle } from './DestinationSectionTitle'

type DestinationWeatherSectionProps = {
  copy: DestinationDetailCopy
  detail: DestinationDetail
  weather: DestinationDetailWeatherState
}

export function DestinationWeatherSection({
  copy,
  detail,
  weather,
}: DestinationWeatherSectionProps) {
  const noticeCenter = weather.noticeCenter
  const notices = noticeCenter?.notices ?? []
  const activeAlerts = noticeCenter?.activeAlerts ?? weather.alerts
  const primaryForecast = noticeCenter?.currentForecast ?? weather.forecasts[0]
  const primaryNotice = notices[0]
  const primaryCrowd = weather.crowdPredictions[0]
  const riskItems = [
    ...notices.map((notice) => ({
      key: `notice-${notice.id}`,
      title: notice.title,
      badge: notice.pinned ? 'pinned' : notice.severity || 'info',
      body: notice.detail || notice.summary || notice.actionAdvice,
    })),
    ...activeAlerts.map((alert) => ({
      key: `alert-${alert.id}`,
      title: alert.title || alert.alertType || copy.activeAlerts,
      badge: alert.severity || 'info',
      body: alert.message || alert.actionAdvice,
    })),
  ].slice(0, 4)
  const alertCount = notices.length + activeAlerts.length
  const temperatureRange = primaryForecast
    ? `${primaryForecast.tempMin ?? '--'}C - ${primaryForecast.tempMax ?? '--'}C`
    : copy.waitingBackend

  return (
    <section className="destination-detail-band">
      <div className="destination-detail-section destination-detail-weather">
        <DestinationSectionTitle
          kicker={copy.intelligenceKicker}
          title={copy.intelligenceTitle}
        />

        <div className="destination-detail-weather-grid">
          <article>
            <CloudSun aria-hidden="true" />
            <span>{copy.forecast}</span>
            <strong>
              {primaryForecast?.summary ||
                primaryForecast?.weatherCode ||
                copy.noForecast}
            </strong>
            <small>{temperatureRange}</small>
          </article>

          <article className="is-curated">
            <ShieldAlert aria-hidden="true" />
            <span>{copy.activeAlerts}</span>
            <strong>
              {primaryNotice?.title ||
                primaryNotice?.summary ||
                (alertCount > 0 ? alertCount.toString() : copy.noForecast)}
            </strong>
            <small>
              {primaryNotice?.summary ||
                weather.error ||
                (weather.loading ? copy.loadingWeather : copy.weatherApi)}
            </small>
          </article>

          <article>
            <MountainSnow aria-hidden="true" />
            <span>{copy.crowdPrediction}</span>
            <strong>
              {primaryCrowd?.crowdLevel ||
                getCrowdLabel(detail.crowdLevelDefault, copy)}
            </strong>
            <small>
              {primaryCrowd?.predictedVisitors
                ? `${primaryCrowd.predictedVisitors}`
                : copy.useDefaultCrowd}
            </small>
          </article>

          <article>
            <Flag aria-hidden="true" />
            <span>{copy.activeAlerts}</span>
            <strong>{alertCount.toString()}</strong>
            <small>
              {weather.error ||
                (weather.loading ? copy.loadingWeather : copy.weatherApi)}
            </small>
          </article>
        </div>

        {riskItems.length > 0 && (
          <div className="destination-detail-alert-list">
            {riskItems.map((item) => (
              <article key={item.key}>
                <strong>{item.title}</strong>
                <span>{item.badge}</span>
                <p>{item.body || copy.weatherApi}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
