import { CloudSun, Flag, MountainSnow } from 'lucide-react'
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
  const primaryForecast = weather.forecasts[0]
  const primaryCrowd = weather.crowdPredictions[0]

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
            <small>
              {primaryForecast
                ? `${primaryForecast.tempMin ?? '--'}°C - ${
                    primaryForecast.tempMax ?? '--'
                  }°C`
                : copy.waitingBackend}
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
            <strong>{weather.alerts.length.toString()}</strong>
            <small>
              {weather.error ||
                (weather.loading ? copy.loadingWeather : copy.weatherApi)}
            </small>
          </article>
        </div>

        {weather.alerts.length > 0 && (
          <div className="destination-detail-alert-list">
            {weather.alerts.slice(0, 3).map((alert) => (
              <article key={alert.id}>
                <strong>{alert.title || alert.alertType || copy.activeAlerts}</strong>
                <span>{alert.severity || 'info'}</span>
                <p>{alert.message || alert.actionAdvice}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
