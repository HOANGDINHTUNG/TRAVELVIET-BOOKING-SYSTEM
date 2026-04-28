export {
  destinationApi,
  fetchDestinationAlerts,
  fetchDestinationCrowdPredictions,
  fetchDestinationForecasts,
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
  WeatherForecast,
  WeatherSeverity,
} from '../module/home/database/interface/publicTravel'
