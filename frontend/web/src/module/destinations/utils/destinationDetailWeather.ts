import type {
  CrowdPrediction,
  WeatherAlert,
  WeatherForecast,
} from '../../home/database/interface/publicTravel'
import type { DestinationDetail } from '../database/interface/destination'

export type DestinationDetailWeatherState = {
  forecasts: WeatherForecast[]
  alerts: WeatherAlert[]
  crowdPredictions: CrowdPrediction[]
  loading: boolean
  error: string | null
}

export const emptyDestinationDetailWeather: DestinationDetailWeatherState = {
  forecasts: [],
  alerts: [],
  crowdPredictions: [],
  loading: false,
  error: null,
}

type WeatherApiForecastDay = {
  date?: string
  day?: {
    maxtemp_c?: number | string
    mintemp_c?: number | string
    avghumidity?: number | string
    maxwind_kph?: number | string
    daily_chance_of_rain?: number | string
    condition?: {
      text?: string
      code?: number | string
    }
  }
}

type WeatherApiForecastPayload = {
  forecast?: {
    forecastday?: WeatherApiForecastDay[]
  }
}

export function buildDestinationWeatherQuery(detail: DestinationDetail) {
  if (detail.latitude && detail.longitude) {
    return `${detail.latitude},${detail.longitude}`
  }

  return [detail.name, detail.province, detail.countryCode]
    .filter(Boolean)
    .join(', ')
}

export function mapWeatherApiForecasts(
  payload: unknown,
): WeatherForecast[] {
  const forecastDays = (payload as WeatherApiForecastPayload).forecast?.forecastday

  if (!Array.isArray(forecastDays)) {
    return []
  }

  return forecastDays.map((forecastDay, index) => ({
    id: index + 1,
    destinationId: 0,
    forecastDate: forecastDay.date ?? '',
    weatherCode: toText(forecastDay.day?.condition?.code),
    summary: forecastDay.day?.condition?.text,
    tempMin: toNumber(forecastDay.day?.mintemp_c),
    tempMax: toNumber(forecastDay.day?.maxtemp_c),
    humidityPercent: toNumber(forecastDay.day?.avghumidity),
    windSpeed: toNumber(forecastDay.day?.maxwind_kph),
    rainProbability: toNumber(forecastDay.day?.daily_chance_of_rain),
    sourceName: 'WeatherAPI.com',
    rawPayload: JSON.stringify(forecastDay),
  }))
}

function toNumber(value: number | string | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

function toText(value: number | string | undefined) {
  if (value === undefined || value === null) {
    return undefined
  }

  return String(value)
}
