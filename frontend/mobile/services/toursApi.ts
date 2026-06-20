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
  description?: string;
  nextOpenSchedule?: { scheduleId: number; scheduleCode?: string; departureAt?: string; [key: string]: any } | null;
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

export interface TourWishlistItem {
  id: number;
  userId: string;
  tourId: number;
  createdAt: string;
  tour?: {
    id: number;
    code: string;
    name: string;
    shortDescription: string;
    thumbnailUrl: string | null;
    basePrice: number;
    averageRating: number;
    totalReviews: number;
  };
}

export interface TourViewLog {
  id: number;
  userId: string;
  tourId: number;
  viewedAt: string;
  tour?: {
    id: number;
    code: string;
    name: string;
    shortDescription: string;
    thumbnailUrl: string | null;
    basePrice: number;
  };
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

// User Wishlist Tour endpoints
export async function fetchMyWishlistTours() {
  return apiRequest<TourWishlistItem[]>('/users/me/wishlist/tours');
}

export async function addTourToWishlist(tourId: number) {
  return apiRequest<TourWishlistItem>(`/users/me/wishlist/tours/${tourId}`, {
    method: 'POST',
  });
}

export async function removeTourFromWishlist(tourId: number) {
  return apiRequest<{ success: boolean; message: string }>(`/users/me/wishlist/tours/${tourId}`, {
    method: 'DELETE',
  });
}

// User Tour View Logs
export async function fetchMyRecentTourViews() {
  return apiRequest<TourViewLog[]>('/users/me/tour-views');
}
