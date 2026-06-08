import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../../lib/apiClient";
import type { PageResponse } from "../../../../../types/api";
import { useCrudMutation } from "../../../core/hooks/useCrudMutation";

// DTOs
export interface Flight {
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
  minPrice: number;
  availableSeats: number;
}

export interface FlightRequest {
  airlineId: number;
  flightNo: string;
  originAirportId: number;
  destinationAirportId: number;
  departureTimeLocal: string;
  arrivalTimeLocal: string;
  durationMinutes: number;
  status: string;
}

export const FLIGHTS_QUERY_KEY = ["admin-flights"];

// API Methods
export const useGetFlights = (page: number, size: number, search?: string) => {
  return useQuery({
    queryKey: [...FLIGHTS_QUERY_KEY, "list", page, size, search],
    queryFn: async () => {
      const { data } = await apiClient.get<PageResponse<Flight>>("/flights", {
        params: { page, size, flightNo: search || undefined },
      });
      return data;
    },
  });
};

export const useCreateFlight = () => {
  return useCrudMutation<Flight, FlightRequest>({
    mutationFn: (request) => apiClient.post("/admin/flights", request),
    successMessage: "Đã thêm chuyến bay mới vào mạng lưới!",
    invalidateKeys: [FLIGHTS_QUERY_KEY],
  });
};

export const useUpdateFlight = (id: number | null) => {
  return useCrudMutation<Flight, FlightRequest>({
    mutationFn: (request) => apiClient.put(`/admin/flights/${id}`, request),
    successMessage: "Đã cập nhật lịch bay thành công!",
    invalidateKeys: [FLIGHTS_QUERY_KEY],
  });
};

// --- MOCKED REFERENCE DATA ---
// Vì Backend chưa cung cấp API GET /airlines và /airports
export const MOCK_AIRLINES = [
  { id: 1, code: "VN", name: "Vietnam Airlines" },
  { id: 2, code: "VJ", name: "Vietjet Air" },
  { id: 3, code: "QH", name: "Bamboo Airways" },
];

export const MOCK_AIRPORTS = [
  { id: 1, code: "HAN", name: "Sân bay Nội Bài (Hà Nội)" },
  { id: 2, code: "SGN", name: "Sân bay Tân Sơn Nhất (TP.HCM)" },
  { id: 3, code: "DAD", name: "Sân bay Đà Nẵng" },
  { id: 4, code: "CXR", name: "Sân bay Cam Ranh (Nha Trang)" },
  { id: 5, code: "PQC", name: "Sân bay Phú Quốc" },
];
