import { destinationApi, fetchPublicDestinations } from './Destination.api'
import { tourApi, fetchPublicTours } from './Tour.api'
import {
  fetchDestinationAlerts,
  fetchDestinationCrowdPredictions,
  fetchDestinationForecasts,
  fetchDestinationWeatherNotice,
  weatherApi,
} from './Weather.api'

export const publicTravelApi = {
  getDestinations: destinationApi.getDestinations,
  getTours: tourApi.getTours,
  getDestinationWeatherNotice: weatherApi.getDestinationWeatherNotice,
  getDestinationForecasts: weatherApi.getDestinationForecasts,
  getDestinationAlerts: weatherApi.getDestinationAlerts,
  getDestinationCrowdPredictions: weatherApi.getDestinationCrowdPredictions,
}

export {
  destinationApi,
  fetchDestinationAlerts,
  fetchDestinationCrowdPredictions,
  fetchDestinationForecasts,
  fetchDestinationWeatherNotice,
  fetchPublicDestinations,
  fetchPublicTours,
  tourApi,
  weatherApi,
}
