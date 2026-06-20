import { apiRequest } from '@/services/apiClient';

export interface WeatherForecast {
  id: number;
  destinationId: number;
  forecastDate: string;
  weatherCode: string;
  summary: string;
  tempMin: number;
  tempMax: number;
  humidityPercent?: number;
  windSpeed?: number;
  rainProbability?: number;
  sourceName?: string;
  rawPayload?: string;
}

export interface UpsertForecastRequest {
  weatherCode: string;
  summary: string;
  tempMin: number;
  tempMax: number;
  humidityPercent?: number;
  windSpeed?: number;
  rainProbability?: number;
  sourceName?: string;
  rawPayload?: string;
}

export interface WeatherAlert {
  id: number;
  destinationId: number;
  scheduleId?: number;
  severity: 'info' | 'watch' | 'warning' | 'danger';
  alertType: string;
  title: string;
  message: string;
  actionAdvice?: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface UpsertAlertRequest {
  scheduleId?: number;
  severity: 'info' | 'watch' | 'warning' | 'danger';
  alertType: string;
  title: string;
  message: string;
  actionAdvice?: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface CrowdPrediction {
  id: number;
  destinationId: number;
  predictionDate: string;
  crowdLevel: 'low' | 'medium' | 'high' | 'very_high';
  predictedVisitors?: number;
  confidenceScore?: number;
  reasonsJson?: string;
}

export interface UpsertCrowdPredictionRequest {
  crowdLevel: 'low' | 'medium' | 'high' | 'very_high';
  predictedVisitors?: number;
  confidenceScore?: number;
  reasonsJson?: string;
}

export interface RouteEstimate {
  id: number;
  fromLabel: string;
  toLabel: string;
  fromLatitude?: number;
  fromLongitude?: number;
  toLatitude?: number;
  toLongitude?: number;
  distanceKm?: number;
  durationMinutes?: number;
  googleMapUrl?: string;
  sourceName?: string;
}

export interface CreateRouteEstimateRequest {
  fromLabel: string;
  toLabel: string;
  fromLatitude?: number;
  fromLongitude?: number;
  toLatitude?: number;
  toLongitude?: number;
  distanceKm?: number;
  durationMinutes?: number;
  googleMapUrl?: string;
  sourceName?: string;
}

export async function fetchWeatherForecasts(destinationUuid: string) {
  return apiRequest<WeatherForecast[]>(`/destinations/${destinationUuid}/weather/forecasts`);
}

export async function fetchRealtimeWeather(q: string, aqi = 'no') {
  return apiRequest<any>('/weather/realtime', {
    query: { q, aqi },
  });
}

export async function fetchForecastWeather(q: string, days = 1, aqi = 'no', alerts = 'no') {
  return apiRequest<any>('/weather/forecast', {
    query: { q, days, aqi, alerts },
  });
}

export async function searchWeatherLocation(q: string) {
  return apiRequest<any[]>('/weather/search', {
    query: { q },
  });
}

export async function fetchIpLookupWeather(q: string) {
  return apiRequest<any>('/weather/ip', {
    query: { q },
  });
}

export async function fetchWeatherAlerts(destinationUuid: string) {
  return apiRequest<WeatherAlert[]>(`/destinations/${destinationUuid}/weather/alerts`);
}

export async function fetchCrowdPredictions(destinationUuid: string) {
  return apiRequest<CrowdPrediction[]>(`/destinations/${destinationUuid}/weather/crowd-predictions`);
}

export async function fetchRouteEstimates(fromLabel?: string, toLabel?: string) {
  return apiRequest<RouteEstimate[]>('/route-estimates', {
    query: { fromLabel, toLabel },
  });
}

// Admin weather endpoints
export async function fetchAdminWeatherForecasts(destinationUuid: string) {
  return apiRequest<WeatherForecast[]>(`/admin/destinations/${destinationUuid}/weather/forecasts`);
}

export async function upsertAdminWeatherForecast(
  destinationUuid: string,
  forecastDate: string,
  request: UpsertForecastRequest
) {
  return apiRequest<WeatherForecast>(`/admin/destinations/${destinationUuid}/weather/forecasts/${forecastDate}`, {
    method: 'PUT',
    body: request,
  });
}

export async function fetchAdminWeatherAlerts(destinationUuid: string) {
  return apiRequest<WeatherAlert[]>(`/admin/destinations/${destinationUuid}/weather/alerts`);
}

export async function createAdminWeatherAlert(destinationUuid: string, request: UpsertAlertRequest) {
  return apiRequest<WeatherAlert>(`/admin/destinations/${destinationUuid}/weather/alerts`, {
    method: 'POST',
    body: request,
  });
}

export async function updateAdminWeatherAlert(destinationUuid: string, alertId: number, request: UpsertAlertRequest) {
  return apiRequest<WeatherAlert>(`/admin/destinations/${destinationUuid}/weather/alerts/${alertId}`, {
    method: 'PUT',
    body: request,
  });
}

export async function setAdminWeatherAlertStatus(destinationUuid: string, alertId: number, active: boolean) {
  return apiRequest<WeatherAlert>(`/admin/destinations/${destinationUuid}/weather/alerts/${alertId}/status`, {
    method: 'PATCH',
    body: { active },
  });
}

export async function fetchAdminCrowdPredictions(destinationUuid: string) {
  return apiRequest<CrowdPrediction[]>(`/admin/destinations/${destinationUuid}/weather/crowd-predictions`);
}

export async function upsertAdminCrowdPrediction(
  destinationUuid: string,
  predictionDate: string,
  request: UpsertCrowdPredictionRequest
) {
  return apiRequest<CrowdPrediction>(`/admin/destinations/${destinationUuid}/weather/crowd-predictions/${predictionDate}`, {
    method: 'PUT',
    body: request,
  });
}

export async function fetchAdminRouteEstimates(fromLabel?: string, toLabel?: string) {
  return apiRequest<RouteEstimate[]>('/admin/route-estimates', {
    query: { fromLabel, toLabel },
  });
}

export async function createAdminRouteEstimate(request: CreateRouteEstimateRequest) {
  return apiRequest<RouteEstimate>('/admin/route-estimates', {
    method: 'POST',
    body: request,
  });
}
