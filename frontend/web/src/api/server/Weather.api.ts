import type {
  CrowdPrediction,
  WeatherAlert,
  WeatherForecast,
} from '../../module/home/database/interface/publicTravel'
import { getBackendData } from './serverApiClient'

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
}

export const fetchDestinationForecasts = (destinationUuid: string) =>
  weatherApi.getDestinationForecasts(destinationUuid)
export const fetchDestinationAlerts = (destinationUuid: string) =>
  weatherApi.getDestinationAlerts(destinationUuid)
export const fetchDestinationCrowdPredictions = (destinationUuid: string) =>
  weatherApi.getDestinationCrowdPredictions(destinationUuid)
