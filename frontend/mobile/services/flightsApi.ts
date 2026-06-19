import { apiRequest } from "./apiClient";
import type { PageResponse } from "@/types/api";

export interface FlightSearchRequest {
  originCode?: string;
  destinationCode?: string;
  departureDate?: string;
  cabinClass?: string;
  minPrice?: number;
  maxPrice?: number;
  passengers?: number;
  page?: number;
  size?: number;
}

export interface FlightResponse {
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
}

export async function fetchPublicFlights(params: FlightSearchRequest = {}) {
  return apiRequest<PageResponse<FlightResponse>>("/flights", {
    method: "GET",
    query: {
      originCode: params.originCode,
      destinationCode: params.destinationCode,
      departureDate: params.departureDate,
      cabinClass: params.cabinClass,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      passengers: params.passengers,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

export async function fetchFlightDetails(id: string | number) {
  return apiRequest<FlightResponse>(`/flights/${id}`, {
    method: "GET",
  });
}
