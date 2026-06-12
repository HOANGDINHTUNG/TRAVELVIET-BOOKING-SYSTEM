import { apiRequest } from '@/services/apiClient';
import type { Flight, FlightListResponse, FlightSearchParams } from '@/types/flight';

/**
 * Search for flights
 * @param params Search parameters (departure, arrival, dates, etc.)
 * @returns List of available flights
 */
export async function searchFlights(params: FlightSearchParams) {
  const queryParams = new URLSearchParams();

  if (params.departureCity) queryParams.append('departureCity', params.departureCity);
  if (params.arrivalCity) queryParams.append('arrivalCity', params.arrivalCity);
  if (params.departureDate) queryParams.append('departureDate', params.departureDate);
  if (params.returnDate) queryParams.append('returnDate', params.returnDate);
  if (params.tripType) queryParams.append('tripType', params.tripType);
  if (params.passengers) queryParams.append('passengers', String(params.passengers));
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.maxPrice) queryParams.append('maxPrice', String(params.maxPrice));
  if (params.airline) queryParams.append('airline', params.airline);

  const query = queryParams.toString();
  const endpoint = query ? `/flights/search?${query}` : '/flights/search';

  return apiRequest<FlightListResponse>(endpoint, {
    method: 'GET',
  });
}

/**
 * Get all available flights (paginated)
 * @param page Page number (default: 1)
 * @param pageSize Items per page (default: 20)
 * @returns List of flights
 */
export async function getFlights(page: number = 1, pageSize: number = 20) {
  return apiRequest<FlightListResponse>(`/flights?page=${page}&pageSize=${pageSize}`, {
    method: 'GET',
  });
}

/**
 * Get flight details by ID
 * @param id Flight ID
 * @returns Flight details
 */
export async function getFlightById(id: string) {
  return apiRequest<Flight>(`/flights/${id}`, {
    method: 'GET',
  });
}

/**
 * Get available airlines
 * @returns List of airlines
 */
export async function getAirlines() {
  return apiRequest<
    Array<{
      id: string;
      name: string;
      code: string;
      logo?: string;
    }>
  >('/flights/airlines', {
    method: 'GET',
  });
}
