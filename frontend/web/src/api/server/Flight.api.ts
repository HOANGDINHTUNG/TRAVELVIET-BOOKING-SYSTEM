import type { PageResponse } from "../../types/api";
import { getBackendData } from "./serverApiClient";

export type FlightSearchRequest = {
  originDestinationId?: number;
  destinationId?: number;
  /** Mã IATA sân bay khởi hành (vd: HAN, SGN) */
  originCode?: string;
  /** Mã IATA sân bay đến (vd: DAD, DLI) */
  destinationCode?: string;
  departureDate?: string;
  cabinClass?: string;
  minPrice?: number;
  maxPrice?: number;
  passengers?: number;
  page?: number;
  size?: number;
};

export type FlightResponse = {
  id: number;
  flightNo: string;
  status: string;
  airlineId: number;
  airlineCode: string;
  airlineName: string;
  originAirportId: number;
  originAirportCode: string;
  originAirportName: string;
  destinationAirportId: number;
  destinationAirportCode: string;
  destinationAirportName: string;
  departureTimeLocal: string;
  arrivalTimeLocal: string;
  durationMinutes: number;
  recommendedCabinClass: string;
  minPrice: number;
  availableSeats: number;
  createdAt: string;
  updatedAt: string;
};

export const flightApi = {
  search(params: FlightSearchRequest = {}) {
    return getBackendData<PageResponse<FlightResponse>>("flights", params);
  },

  getById(id: number) {
    return getBackendData<FlightResponse>(`flights/${id}`);
  },
};

export async function fetchPublicFlights(params: FlightSearchRequest = {}) {
  const res = await flightApi.search(params);
  return res.content ?? [];
}
