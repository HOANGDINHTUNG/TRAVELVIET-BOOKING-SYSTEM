import { apiRequest } from "@/services/apiClient";
import type { PageResponse } from "@/types/api";

// Type definitions matching the backend API
// See docs/backend/API_DOCUMENTATION.md § Tour (Public / Client API)
export interface TourResponse {
  id: number;
  code: string;
  name: string;
  shortDescription: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  totalReviews: number;
  averageRating: number;
  highlights: string;
  thumbnailUrl: string | null;
  destinations: { destinationId: number; destinationName: string }[];
  itineraryDays: { dayNumber: number; title: string; description: string }[];
  media: { url: string; isPrimary: boolean }[];
}

export interface TourSearchRequest {
  page?: number;
  size?: number;
  keyword?: string;
  domesticOnly?: boolean;
  internationalOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: string;
}

export async function fetchPublicTours(params: TourSearchRequest = {}) {
  // Using GET /tours with query params
  return apiRequest<PageResponse<TourResponse>>("/tours", {
    method: "GET",
    query: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      keyword: params.keyword,
      domesticOnly: params.domesticOnly,
      internationalOnly: params.internationalOnly,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    },
  });
}

export async function fetchTourDetails(id: string | number) {
  return apiRequest<TourResponse>(`/tours/${id}`, {
    method: "GET",
  });
}
