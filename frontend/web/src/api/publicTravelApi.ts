export {
  destinationApi,
  fetchDestinationAlerts,
  fetchDestinationCrowdPredictions,
  fetchDestinationForecasts,
  fetchDestinationWeatherNotice,
  fetchPublicDestinations,
  fetchPublicTours,
  publicTravelApi,
  tourApi,
  weatherApi,
} from './server/PublicTravel.api'

export type {
  CrowdPrediction,
  Destination,
  Tour,
  WeatherAlert,
  WeatherDisplayPolicy,
  WeatherForecast,
  WeatherNoticeCenter,
  WeatherNoticeStatus,
  WeatherPublicNotice,
  WeatherSeverity,
} from '../module/home/database/interface/publicTravel'
