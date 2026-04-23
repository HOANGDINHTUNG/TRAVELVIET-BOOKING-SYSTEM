import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Navigation,
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
  WeatherSeverity,
} from '../../api/publicTravelApi'
import './WeatherAlertsSection.css'

type WeatherCopy = {
  eyebrow: string
  title: string
  copy: string
  live: string
  detail: string
  mainAlert: string
  mainDescription: string
  routeStatus: string
  updated: string
  metrics: Array<{
    label: string
    value: string
    note: string
  }>
  alerts: Array<{
    location: string
    status: string
    level: 'high' | 'medium' | 'calm'
    time: string
    detail: string
  }>
  timeline: Array<{
    time: string
    condition: string
    temperature: string
    risk: string
  }>
}

const copy: Record<'vi' | 'en', WeatherCopy> = {
  vi: {
    eyebrow: 'Thông báo thời tiết',
    title: 'Theo dõi rủi ro trước khi khởi hành',
    copy:
      'Khung này đang dùng dữ liệu mẫu để mô phỏng cảnh báo theo tuyến. Khi có API, chỉ cần thay phần dữ liệu bằng response thật.',
    live: 'Theo dõi trực tiếp',
    detail: 'Xem chi tiết',
    mainAlert: 'Mưa dông ven biển chiều nay',
    mainDescription:
      'Một số tour biển có thể gặp mưa nhanh, gió giật và sóng cao ngắn hạn. Lịch trình vẫn ổn nhưng nên giữ phương án dự phòng trong 3 giờ tới.',
    routeStatus: 'Ưu tiên kiểm tra: Đà Nẵng, Hội An, Nha Trang',
    updated: 'Cập nhật mẫu 10 phút trước',
    metrics: [
      { label: 'Nhiệt độ', value: '29°C', note: 'Cảm giác ẩm, có mây' },
      { label: 'Gió', value: '24 km/h', note: 'Giật mạnh theo cơn' },
      { label: 'Lượng mưa', value: '68%', note: 'Tăng sau 15:00' },
    ],
    alerts: [
      {
        location: 'Đà Nẵng',
        status: 'Cảnh báo cao',
        level: 'high',
        time: '15:00 - 18:30',
        detail: 'Mưa dông ngắn, cân nhắc đổi giờ đi biển.',
      },
      {
        location: 'Hội An',
        status: 'Theo dõi',
        level: 'medium',
        time: '16:00 - 20:00',
        detail: 'Có khả năng mưa rào, phố cổ vẫn phù hợp nếu chuẩn bị áo mưa.',
      },
      {
        location: 'Đà Lạt',
        status: 'Ổn định',
        level: 'calm',
        time: 'Cả ngày',
        detail: 'Trời mát, phù hợp lịch trình ngoài trời nhẹ.',
      },
    ],
    timeline: [
      { time: '12:00', condition: 'Nắng nhẹ', temperature: '30°C', risk: 'Thấp' },
      { time: '15:00', condition: 'Mây dày', temperature: '29°C', risk: 'Vừa' },
      { time: '18:00', condition: 'Mưa dông', temperature: '27°C', risk: 'Cao' },
      { time: '21:00', condition: 'Tạnh dần', temperature: '26°C', risk: 'Vừa' },
    ],
  },
  en: {
    eyebrow: 'Weather alerts',
    title: 'Watch travel risk before departure',
    copy:
      'This panel uses mock data to preview route-based alerts. Later, replace the local data with your real API response.',
    live: 'Live tracking',
    detail: 'View details',
    mainAlert: 'Coastal thunderstorm window today',
    mainDescription:
      'Some beach tours may see quick rain, gusty wind, and short high-wave periods. Trips remain workable, but keep a backup plan for the next 3 hours.',
    routeStatus: 'Priority check: Da Nang, Hoi An, Nha Trang',
    updated: 'Mock update 10 minutes ago',
    metrics: [
      { label: 'Temperature', value: '29°C', note: 'Humid and cloudy' },
      { label: 'Wind', value: '24 km/h', note: 'Gusty in bursts' },
      { label: 'Rain chance', value: '68%', note: 'Rising after 15:00' },
    ],
    alerts: [
      {
        location: 'Da Nang',
        status: 'High alert',
        level: 'high',
        time: '15:00 - 18:30',
        detail: 'Short storms, consider moving beach time.',
      },
      {
        location: 'Hoi An',
        status: 'Watch',
        level: 'medium',
        time: '16:00 - 20:00',
        detail: 'Showers possible, old town still works with rain gear.',
      },
      {
        location: 'Da Lat',
        status: 'Stable',
        level: 'calm',
        time: 'All day',
        detail: 'Cool weather, good for light outdoor routes.',
      },
    ],
    timeline: [
      { time: '12:00', condition: 'Light sun', temperature: '30°C', risk: 'Low' },
      { time: '15:00', condition: 'Cloud build', temperature: '29°C', risk: 'Medium' },
      { time: '18:00', condition: 'Storms', temperature: '27°C', risk: 'High' },
      { time: '21:00', condition: 'Clearing', temperature: '26°C', risk: 'Medium' },
    ],
  },
}

const metricIcons = [
  <ThermometerSun size={18} strokeWidth={1.9} aria-hidden="true" />,
  <Wind size={18} strokeWidth={1.9} aria-hidden="true" />,
  <Droplets size={18} strokeWidth={1.9} aria-hidden="true" />,
]

const timelineIcons = [
  <CloudSun size={18} strokeWidth={1.9} aria-hidden="true" />,
  <CloudSun size={18} strokeWidth={1.9} aria-hidden="true" />,
  <CloudRain size={18} strokeWidth={1.9} aria-hidden="true" />,
  <Umbrella size={18} strokeWidth={1.9} aria-hidden="true" />,
]

type WeatherAlertsSectionProps = {
  destinationName?: string
  forecasts?: WeatherForecast[]
  alerts?: WeatherAlert[]
  crowdPredictions?: CrowdPrediction[]
  isLoading?: boolean
}

const severityLabel: Record<WeatherSeverity, { vi: string; en: string }> = {
  info: { vi: 'Thông tin', en: 'Info' },
  watch: { vi: 'Theo dõi', en: 'Watch' },
  warning: { vi: 'Cảnh báo', en: 'Warning' },
  danger: { vi: 'Nguy hiểm', en: 'Danger' },
}

const severityLevel: Record<WeatherSeverity, 'high' | 'medium' | 'calm'> = {
  danger: 'high',
  warning: 'high',
  watch: 'medium',
  info: 'calm',
}

function formatDateTime(value: string | undefined, locale: 'vi' | 'en') {
  if (!value) {
    return locale === 'vi' ? 'Đang cập nhật' : 'Updating'
  }

  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatForecastDate(value: string, locale: 'vi' | 'en') {
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

export function WeatherAlertsSection({
  destinationName,
  forecasts = [],
  alerts = [],
  crowdPredictions = [],
  isLoading = false,
}: WeatherAlertsSectionProps) {
  const { i18n } = useTranslation()
  const sectionRef = useRef<HTMLElement | null>(null)
  const locale = i18n.language === 'en' ? 'en' : 'vi'
  const content = copy[locale]
  const primaryForecast = forecasts[0]
  const primaryAlert = alerts[0]
  const primaryCrowd = crowdPredictions[0]
  const displayMetrics =
    forecasts.length > 0
      ? [
          {
            label: locale === 'vi' ? 'Nhiệt độ' : 'Temperature',
            value:
              primaryForecast?.tempMin !== undefined &&
              primaryForecast?.tempMax !== undefined
                ? `${Math.round(primaryForecast.tempMin)}-${Math.round(
                    primaryForecast.tempMax,
                  )}°C`
                : rounded(primaryForecast?.tempMax, '°C'),
            note: primaryForecast?.summary || content.metrics[0].note,
          },
          {
            label: locale === 'vi' ? 'Gió' : 'Wind',
            value: rounded(primaryForecast?.windSpeed, ' km/h'),
            note:
              primaryForecast?.sourceName ||
              (locale === 'vi' ? 'Dữ liệu từ backend' : 'Backend data'),
          },
          {
            label: locale === 'vi' ? 'Mưa' : 'Rain',
            value: rounded(primaryForecast?.rainProbability, '%'),
            note:
              primaryCrowd?.crowdLevel
                ? `${locale === 'vi' ? 'Mức đông' : 'Crowd'}: ${
                    primaryCrowd.crowdLevel
                  }`
                : content.metrics[2].note,
          },
        ]
      : content.metrics

  const displayAlerts =
    alerts.length > 0
      ? alerts.slice(0, 3).map((alert) => {
          const severity = alert.severity ?? 'info'
          return {
            location: destinationName || content.alerts[0].location,
            status: severityLabel[severity][locale],
            level: severityLevel[severity],
            time: `${formatDateTime(alert.validFrom, locale)} - ${formatDateTime(
              alert.validTo,
              locale,
            )}`,
            detail: alert.actionAdvice || alert.message || alert.title || '',
          }
        })
      : content.alerts

  const displayTimeline =
    forecasts.length > 0
      ? forecasts.slice(0, 4).map((forecast) => ({
          time: formatForecastDate(forecast.forecastDate, locale),
          condition: forecast.summary || forecast.weatherCode || 'Forecast',
          temperature:
            forecast.tempMin !== undefined && forecast.tempMax !== undefined
              ? `${Math.round(forecast.tempMin)}-${Math.round(forecast.tempMax)}°C`
              : rounded(forecast.tempMax, '°C'),
          risk:
            forecast.rainProbability && forecast.rainProbability >= 60
              ? locale === 'vi'
                ? 'Mưa cao'
                : 'High rain'
              : locale === 'vi'
                ? 'Ổn'
                : 'Stable',
        }))
      : content.timeline

  const mainAlert = isLoading
    ? locale === 'vi'
      ? 'Đang tải thông báo thời tiết'
      : 'Loading weather alerts'
    : primaryAlert?.title || primaryForecast?.summary || content.mainAlert
  const mainDescription =
    primaryAlert?.message ||
    primaryAlert?.actionAdvice ||
    primaryForecast?.summary ||
    content.mainDescription
  const routeStatus = destinationName
    ? `${locale === 'vi' ? 'Đang theo dõi' : 'Tracking'}: ${destinationName}`
    : content.routeStatus
  const updated =
    primaryForecast?.sourceName || primaryAlert
      ? locale === 'vi'
        ? 'Dữ liệu thời tiết từ backend'
        : 'Weather data from backend'
      : content.updated

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

            <button className="weather-detail-button" type="button">
              {content.detail}
              <AlertTriangle size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="weather-side-panel">
            <div className="weather-alert-list weather-reveal">
              {displayAlerts.map((alert) => (
                <article className={`weather-alert-item is-${alert.level}`} key={alert.location}>
                  <div>
                    <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                    <strong>{alert.location}</strong>
                  </div>
                  <span>{alert.status}</span>
                  <time>{alert.time}</time>
                  <p>{alert.detail}</p>
                </article>
              ))}
            </div>

            <div className="weather-timeline weather-reveal">
              <div className="weather-timeline-head">
                <Waves size={18} strokeWidth={1.9} aria-hidden="true" />
                <span>{updated}</span>
              </div>
              {displayTimeline.map((item, index) => (
                <article key={item.time}>
                  <time>{item.time}</time>
                  <span>{timelineIcons[index % timelineIcons.length]}</span>
                  <div>
                    <strong>{item.condition}</strong>
                    <small>{item.temperature} / {item.risk}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
