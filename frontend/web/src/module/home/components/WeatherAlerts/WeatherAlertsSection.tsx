import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Navigation,
  ShieldAlert,
  ThermometerSun,
  Umbrella,
  Waves,
  Wind,
} from 'lucide-react'
import gsap from 'gsap'
import type {
  CrowdPrediction,
  WeatherAlert,
  WeatherForecast,
  WeatherNoticeCenter,
  WeatherSeverity,
} from '../../database/interface/publicTravel'
import './WeatherAlertsSection.css'

type WeatherAlertsSectionProps = {
  destinationName?: string
  forecasts?: WeatherForecast[]
  alerts?: WeatherAlert[]
  noticeCenter?: WeatherNoticeCenter | null
  crowdPredictions?: CrowdPrediction[]
  isLoading?: boolean
  errorMessage?: string | null
}

type Locale = 'vi' | 'en'

const copy: Record<
  Locale,
  {
    eyebrow: string
    title: string
    copy: string
    live: string
    detail: string
    closeDetail: string
    detailTitle: string
    loading: string
    emptyTitle: string
    emptyDescription: string
    errorTitle: string
    routeFallback: string
    updatedFallback: string
    curatedSource: string
    hiddenByPolicy: string
    noDetail: string
    noAlerts: string
    noTimeline: string
    metrics: Array<{ label: string; note: string }>
  }
> = {
  vi: {
    eyebrow: 'Thong bao thoi tiet',
    title: 'Theo doi rui ro truoc khi khoi hanh',
    copy:
      'Du lieu du bao, canh bao va muc do dong duoc lay truc tiep tu backend TravelViet.',
    live: 'Du lieu backend',
    detail: 'Xem chi tiet',
    closeDetail: 'Thu gon',
    detailTitle: 'Chi tiet thong bao',
    loading: 'Dang tai du lieu thoi tiet',
    emptyTitle: 'Chua co canh bao thoi tiet',
    emptyDescription:
      'Backend chua tra ve du bao hoac canh bao cho diem den nay.',
    errorTitle: 'Khong the tai du lieu thoi tiet',
    routeFallback: 'Chon diem den de theo doi thoi tiet',
    updatedFallback: 'Cho du lieu tu backend',
    curatedSource: 'Da loc theo cau hinh hien thi',
    hiddenByPolicy: 'An boi quan tri',
    noDetail: 'Chua co thong tin chi tiet.',
    noAlerts: 'Chua co canh bao dang hoat dong.',
    noTimeline: 'Chua co du bao sap toi.',
    metrics: [
      { label: 'Nhiet do', note: 'Chua co du bao' },
      { label: 'Gio', note: 'Chua co du bao' },
      { label: 'Mua', note: 'Chua co du bao' },
      { label: 'Do am', note: 'Chua co du lieu' },
    ],
  },
  en: {
    eyebrow: 'Weather alerts',
    title: 'Watch travel risk before departure',
    copy:
      'Forecasts, alerts, and crowd predictions are loaded from the TravelViet backend.',
    live: 'Backend data',
    detail: 'View details',
    closeDetail: 'Hide details',
    detailTitle: 'Notice details',
    loading: 'Loading weather data',
    emptyTitle: 'No weather alert available',
    emptyDescription:
      'The backend has not returned forecasts or alerts for this destination yet.',
    errorTitle: 'Could not load weather data',
    routeFallback: 'Select a destination to track weather',
    updatedFallback: 'Waiting for backend data',
    curatedSource: 'Filtered by display policy',
    hiddenByPolicy: 'Hidden by admin policy',
    noDetail: 'No detailed information yet.',
    noAlerts: 'No active alerts.',
    noTimeline: 'No upcoming forecasts.',
    metrics: [
      { label: 'Temperature', note: 'No forecast yet' },
      { label: 'Wind', note: 'No forecast yet' },
      { label: 'Rain chance', note: 'No forecast yet' },
      { label: 'Humidity', note: 'No data yet' },
    ],
  },
}

const metricIcons = [
  <ThermometerSun size={18} strokeWidth={1.9} aria-hidden="true" />,
  <Wind size={18} strokeWidth={1.9} aria-hidden="true" />,
  <Umbrella size={18} strokeWidth={1.9} aria-hidden="true" />,
  <Droplets size={18} strokeWidth={1.9} aria-hidden="true" />,
]

const timelineIcons = [
  <CloudSun size={18} strokeWidth={1.9} aria-hidden="true" />,
  <CloudSun size={18} strokeWidth={1.9} aria-hidden="true" />,
  <CloudRain size={18} strokeWidth={1.9} aria-hidden="true" />,
  <Umbrella size={18} strokeWidth={1.9} aria-hidden="true" />,
]

const severityLabel: Record<WeatherSeverity, Record<Locale, string>> = {
  info: { vi: 'Thong tin', en: 'Info' },
  watch: { vi: 'Theo doi', en: 'Watch' },
  warning: { vi: 'Canh bao', en: 'Warning' },
  danger: { vi: 'Nguy hiem', en: 'Danger' },
}

const severityLevel: Record<WeatherSeverity, 'high' | 'medium' | 'calm'> = {
  danger: 'high',
  warning: 'high',
  watch: 'medium',
  info: 'calm',
}

function formatDateTime(value: string | undefined, locale: Locale) {
  if (!value) {
    return locale === 'vi' ? 'Dang cap nhat' : 'Updating'
  }

  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatForecastDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
}

function rounded(value: number | undefined, suffix = '') {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '--'
  }

  return `${Math.round(value)}${suffix}`
}

function isPolicyVisible(value: boolean | undefined) {
  return value !== false
}

export function WeatherAlertsSection({
  destinationName,
  noticeCenter,
  forecasts = [],
  alerts = [],
  crowdPredictions = [],
  isLoading = false,
  errorMessage,
}: WeatherAlertsSectionProps) {
  const { i18n } = useTranslation()
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const locale: Locale = i18n.language === 'en' ? 'en' : 'vi'
  const content = copy[locale]
  const displayPolicy = noticeCenter?.displayPolicy
  const curatedNotices = noticeCenter?.notices ?? []
  const activeAlerts = noticeCenter?.activeAlerts ?? alerts
  const primaryForecast = noticeCenter?.currentForecast ?? forecasts[0]
  const primaryNotice = curatedNotices[0]
  const primaryAlert = activeAlerts[0]
  const primaryCrowd = crowdPredictions[0]

  const getMetricNote = (
    visible: boolean,
    fallback: string | undefined,
    empty: string,
  ) => (visible ? fallback || empty : content.hiddenByPolicy)

  const displayMetrics = [
    {
      label: content.metrics[0].label,
      value: isPolicyVisible(displayPolicy?.showTemperature)
        ? primaryForecast?.tempMin !== undefined &&
          primaryForecast?.tempMax !== undefined
          ? `${Math.round(primaryForecast.tempMin)}-${Math.round(
              primaryForecast.tempMax,
            )}C`
          : rounded(primaryForecast?.tempMax, 'C')
        : '--',
      note: getMetricNote(
        isPolicyVisible(displayPolicy?.showTemperature),
        primaryForecast?.summary,
        content.metrics[0].note,
      ),
    },
    {
      label: content.metrics[1].label,
      value: isPolicyVisible(displayPolicy?.showWindSpeed)
        ? rounded(primaryForecast?.windSpeed, ' km/h')
        : '--',
      note: getMetricNote(
        isPolicyVisible(displayPolicy?.showWindSpeed),
        primaryForecast?.sourceName,
        content.metrics[1].note,
      ),
    },
    {
      label: content.metrics[2].label,
      value: isPolicyVisible(displayPolicy?.showRainProbability)
        ? rounded(primaryForecast?.rainProbability, '%')
        : '--',
      note: getMetricNote(
        isPolicyVisible(displayPolicy?.showRainProbability),
        primaryCrowd?.crowdLevel
          ? `${locale === 'vi' ? 'Muc dong' : 'Crowd'}: ${primaryCrowd.crowdLevel}`
          : undefined,
        content.metrics[2].note,
      ),
    },
    {
      label: content.metrics[3].label,
      value: isPolicyVisible(displayPolicy?.showHumidity)
        ? rounded(primaryForecast?.humidityPercent, '%')
        : '--',
      note: getMetricNote(
        isPolicyVisible(displayPolicy?.showHumidity),
        primaryForecast?.sourceName,
        content.metrics[3].note,
      ),
    },
  ]

  const displayAlerts = [
    ...curatedNotices.map((notice) => {
      const severity = notice.severity ?? 'info'

      return {
        key: `notice-${notice.id}`,
        location: destinationName || content.routeFallback,
        status: notice.pinned
          ? locale === 'vi'
            ? 'Uu tien'
            : 'Pinned'
          : severityLabel[severity][locale],
        level: severityLevel[severity],
        time: `${formatDateTime(notice.displayFrom, locale)} - ${formatDateTime(
          notice.displayTo,
          locale,
        )}`,
        detail: notice.summary || notice.actionAdvice || notice.title,
      }
    }),
    ...activeAlerts.map((alert) => {
      const severity = alert.severity ?? 'info'

      return {
        key: `alert-${alert.id}`,
        location: destinationName || content.routeFallback,
        status: severityLabel[severity][locale],
        level: severityLevel[severity],
        time: `${formatDateTime(alert.validFrom, locale)} - ${formatDateTime(
          alert.validTo,
          locale,
        )}`,
        detail: alert.actionAdvice || alert.message || alert.title || '',
      }
    }),
  ].slice(0, 3)

  const detailItems = [
    ...curatedNotices.map((notice) => ({
      key: `notice-detail-${notice.id}`,
      title: notice.title,
      status: notice.severity
        ? severityLabel[notice.severity][locale]
        : content.curatedSource,
      body: notice.detail || notice.summary || content.noDetail,
      advice: notice.actionAdvice,
      time: `${formatDateTime(notice.displayFrom, locale)} - ${formatDateTime(
        notice.displayTo,
        locale,
      )}`,
    })),
    ...activeAlerts.map((alert) => ({
      key: `alert-detail-${alert.id}`,
      title: alert.title || alert.alertType || content.emptyTitle,
      status: alert.severity
        ? severityLabel[alert.severity][locale]
        : content.curatedSource,
      body: alert.message || content.noDetail,
      advice: alert.actionAdvice,
      time: `${formatDateTime(alert.validFrom, locale)} - ${formatDateTime(
        alert.validTo,
        locale,
      )}`,
    })),
  ].slice(0, 5)

  const displayTimeline = forecasts.slice(0, 4).map((forecast) => ({
    time: formatForecastDate(forecast.forecastDate, locale),
    condition: forecast.summary || forecast.weatherCode || 'Forecast',
    temperature:
      forecast.tempMin !== undefined && forecast.tempMax !== undefined
        ? `${Math.round(forecast.tempMin)}-${Math.round(forecast.tempMax)}C`
        : rounded(forecast.tempMax, 'C'),
    risk:
      forecast.rainProbability && forecast.rainProbability >= 60
        ? locale === 'vi'
          ? 'Mua cao'
          : 'High rain'
        : locale === 'vi'
          ? 'On dinh'
          : 'Stable',
  }))

  const mainAlert = isLoading
    ? content.loading
    : errorMessage
      ? content.errorTitle
      : primaryNotice?.title ||
        primaryAlert?.title ||
        primaryForecast?.summary ||
        content.emptyTitle
  const mainDescription =
    errorMessage ||
    primaryNotice?.summary ||
    primaryAlert?.message ||
    primaryAlert?.actionAdvice ||
    primaryForecast?.summary ||
    content.emptyDescription
  const routeStatus = destinationName
    ? `${locale === 'vi' ? 'Dang theo doi' : 'Tracking'}: ${destinationName}`
    : content.routeFallback
  const hasBackendWeather = Boolean(primaryForecast?.sourceName || primaryAlert)
  const updated =
    noticeCenter ? content.curatedSource : hasBackendWeather
      ? locale === 'vi'
        ? 'Du lieu thoi tiet tu backend'
        : 'Weather data from backend'
      : content.updatedFallback

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.to('.weather-radar-sweep', {
        rotation: 360,
        duration: 7,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      })
    }, section)

    return () => ctx.revert()
  }, [locale])

  return (
    <section
      className="weather-alert-section"
      ref={sectionRef}
      aria-labelledby="weather-alert-title"
    >
      <div className="weather-alert-shell">
        <div className="weather-alert-copy weather-reveal">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="weather-alert-title">{content.title}</h2>
          <p>{content.copy}</p>
        </div>

        <div className="weather-alert-board">
          <div className="weather-main-card weather-reveal">
            <div className="weather-card-bg" aria-hidden="true">
              <span className="weather-rain-map" />
              <span className="weather-radar-sweep" />
            </div>

            <div className="weather-live-badge" data-motion-float>
              <span />
              {content.live}
            </div>

            <div className="weather-main-icon" data-motion-float aria-hidden="true">
              <CloudRain size={34} strokeWidth={1.7} />
            </div>

            <div>
              <h3>{mainAlert}</h3>
              <p>{mainDescription}</p>
            </div>

            <div className="weather-route-note">
              <Navigation size={17} strokeWidth={1.9} aria-hidden="true" />
              <span>{routeStatus}</span>
            </div>

            <div className="weather-metrics">
              {displayMetrics.map((item, index) => (
                <article key={item.label}>
                  {metricIcons[index]}
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>{item.note}</small>
                </article>
              ))}
            </div>

            <button
              aria-controls="weather-detail-panel"
              aria-expanded={isDetailOpen}
              className="weather-detail-button"
              type="button"
              onClick={() => setIsDetailOpen((current) => !current)}
            >
              {isDetailOpen ? content.closeDetail : content.detail}
              <AlertTriangle size={16} strokeWidth={2} aria-hidden="true" />
            </button>

            {isDetailOpen && (
              <div className="weather-detail-panel" id="weather-detail-panel">
                <div className="weather-detail-panel-head">
                  <ShieldAlert size={18} strokeWidth={2} aria-hidden="true" />
                  <strong>{content.detailTitle}</strong>
                  <span>{updated}</span>
                </div>
                {detailItems.length > 0 ? (
                  detailItems.map((item) => (
                    <article key={item.key}>
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.status}</span>
                      </div>
                      <time>{item.time}</time>
                      <p>{item.body}</p>
                      {item.advice && <small>{item.advice}</small>}
                    </article>
                  ))
                ) : (
                  <article>
                    <div>
                      <strong>{content.emptyTitle}</strong>
                      <span>{content.curatedSource}</span>
                    </div>
                    <time>{updated}</time>
                    <p>{content.noDetail}</p>
                  </article>
                )}
              </div>
            )}
          </div>

          <div className="weather-side-panel">
            <div className="weather-alert-list weather-reveal">
              {displayAlerts.length > 0 ? (
                displayAlerts.map((alert) => (
                  <article
                    className={`weather-alert-item is-${alert.level}`}
                    key={alert.key}
                  >
                    <div>
                      <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                      <strong>{alert.location}</strong>
                    </div>
                    <span>{alert.status}</span>
                    <time>{alert.time}</time>
                    <p>{alert.detail}</p>
                  </article>
                ))
              ) : (
                <article className="weather-alert-item is-calm">
                  <div>
                    <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                    <strong>{destinationName || content.routeFallback}</strong>
                  </div>
                  <span>{content.emptyTitle}</span>
                  <time>{updated}</time>
                  <p>{content.noAlerts}</p>
                </article>
              )}
            </div>

            <div className="weather-timeline weather-reveal">
              <div className="weather-timeline-head">
                <Waves size={18} strokeWidth={1.9} aria-hidden="true" />
                <span>{updated}</span>
              </div>
              {displayTimeline.length > 0 ? (
                displayTimeline.map((item, index) => (
                  <article key={item.time}>
                    <time>{item.time}</time>
                    <span>{timelineIcons[index % timelineIcons.length]}</span>
                    <div>
                      <strong>{item.condition}</strong>
                      <small>
                        {item.temperature} / {item.risk}
                      </small>
                    </div>
                  </article>
                ))
              ) : (
                <article>
                  <time>--</time>
                  <span>{timelineIcons[0]}</span>
                  <div>
                    <strong>{content.noTimeline}</strong>
                    <small>{content.updatedFallback}</small>
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
