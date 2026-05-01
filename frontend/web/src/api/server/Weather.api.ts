import type {
  CrowdPrediction,
  WeatherAlert,
  WeatherForecast,
} from '../../module/home/database/interface/publicTravel'
import { getBackendData } from './serverApiClient'

type WeatherApiFlag = 'yes' | 'no'

export type WeatherApiCurrentResponse = Record<string, unknown>
export type WeatherApiForecastResponse = Record<string, unknown>
export type WeatherApiLocationResponse = {
  id?: number
  name?: string
  region?: string
  country?: string
  lat?: number
  lon?: number
  url?: string
}
export type WeatherApiIpLookupResponse = Record<string, unknown>

export const weatherApi = {
  getDestinationForecasts(destinationUuid: string) {
    return getBackendData<WeatherForecast[]>(
      `destinations/${destinationUuid}/weather/forecasts`,
    )
  },

  getDestinationAlerts(destinationUuid: string) {
    return getBackendData<WeatherAlert[]>(
      `destinations/${destinationUuid}/weather/alerts`,
    )
  },

  getDestinationCrowdPredictions(destinationUuid: string) {
    return getBackendData<CrowdPrediction[]>(
      `destinations/${destinationUuid}/weather/crowd-predictions`,
    )
  },

  getRouteEstimates(params?: { fromLabel?: string; toLabel?: string }) {
    return getBackendData<RouteEstimate[]>('route-estimates', params)
  },

  getRealtime(params: { q: string; aqi?: WeatherApiFlag }) {
    return getBackendData<WeatherApiCurrentResponse>('weather/realtime', {
      q: params.q,
      aqi: params.aqi ?? 'no',
    })
  },

  getForecast(params: {
    q: string
    days?: number
    aqi?: WeatherApiFlag
    alerts?: WeatherApiFlag
  }) {
    return getBackendData<WeatherApiForecastResponse>('weather/forecast', {
      q: params.q,
      days: params.days ?? 1,
      aqi: params.aqi ?? 'no',
      alerts: params.alerts ?? 'no',
    })
  },

  searchLocations(q: string) {
    return getBackendData<WeatherApiLocationResponse[]>('weather/search', { q })
  },

  lookupIp(q: string) {
    return getBackendData<WeatherApiIpLookupResponse>('weather/ip', { q })
  },
}

export const fetchDestinationForecasts = (destinationUuid: string) =>
  weatherApi.getDestinationForecasts(destinationUuid)
export const fetchDestinationAlerts = (destinationUuid: string) =>
  weatherApi.getDestinationAlerts(destinationUuid)
export const fetchDestinationCrowdPredictions = (destinationUuid: string) =>
  weatherApi.getDestinationCrowdPredictions(destinationUuid)

export type RouteEstimate = {
  id: number
  fromLabel?: string
  toLabel?: string
  fromLatitude?: number | string
  fromLongitude?: number | string
  toLatitude?: number | string
  toLongitude?: number | string
  distanceKm?: number | string
  durationMinutes?: number
  googleMapUrl?: string
  sourceName?: string
  createdAt?: string
}
