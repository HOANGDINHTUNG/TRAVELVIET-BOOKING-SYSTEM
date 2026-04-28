import type {
  CrowdPrediction,
  WeatherAlert,
  WeatherForecast,
} from '../../home/database/interface/publicTravel'

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
