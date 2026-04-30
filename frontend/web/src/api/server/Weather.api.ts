import type {
  CrowdPrediction,
  WeatherAlert,
  WeatherForecast,
  WeatherNoticeCenter,
} from '../../module/home/database/interface/publicTravel'
import { getBackendData } from './serverApiClient'

export const weatherApi = {
  getDestinationWeatherNotice(destinationUuid: string) {
    return getBackendData<WeatherNoticeCenter>(
      `destinations/${destinationUuid}/weather/notice`,
    )
  },

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
}

export const fetchDestinationWeatherNotice = (destinationUuid: string) =>
  weatherApi.getDestinationWeatherNotice(destinationUuid)
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
