import type {
  CrowdPrediction,
  WeatherAlert,
  WeatherForecast,
  WeatherNoticeCenter,
} from '../../home/database/interface/publicTravel'

export type DestinationDetailWeatherState = {
  noticeCenter: WeatherNoticeCenter | null
  forecasts: WeatherForecast[]
  alerts: WeatherAlert[]
  crowdPredictions: CrowdPrediction[]
  loading: boolean
  error: string | null
}

export const emptyDestinationDetailWeather: DestinationDetailWeatherState = {
  noticeCenter: null,
  forecasts: [],
  alerts: [],
  crowdPredictions: [],
  loading: false,
  error: null,
}
