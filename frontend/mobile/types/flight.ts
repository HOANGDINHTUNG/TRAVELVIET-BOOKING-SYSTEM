/**
 * Flight Types & Interfaces
 */

export interface Airline {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

export interface FlightSegment {
  id: string;
  airline: Airline;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string; // ISO format
  arrivalTime: string; // ISO format
  duration: string; // HH:MM format
  stops: number;
  aircraft?: string;
}

export interface Flight {
  id: string;
  outbound: FlightSegment;
  return?: FlightSegment;
  price: number;
  originalPrice?: number;
  currency: string;
  availableSeats: number;
  rating: number;
  reviewCount: number;
  departureDate: string; // ISO format
  returnDate?: string; // ISO format
  tripType: 'oneWay' | 'roundTrip';
  departureCity: string;
  arrivalCity: string;
  badge?: 'GIÁ TỐT' | 'NHANH NHẤT' | 'VÀO ĐÚNG GIỜ' | 'CHIẾU SÁNG';
}

export interface FlightSearchParams {
  departureCity?: string;
  arrivalCity?: string;
  departureDate?: string;
  returnDate?: string;
  tripType?: 'oneWay' | 'roundTrip';
  passengers?: number;
  sortBy?: 'price' | 'duration' | 'departure' | 'arrival';
  maxPrice?: number;
  airline?: string;
}

export interface FlightListResponse {
  flights: Flight[];
  total: number;
  page: number;
  pageSize: number;
}
