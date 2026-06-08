import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../../lib/apiClient";
import type { PageResponse } from "../../../../../types/api";
import { useCrudMutation } from "../../../core/hooks/useCrudMutation";

export interface TourMedia {
  mediaType: string;
  mediaUrl: string;
  altText?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface Tour {
  id: number;
  code: string;
  name: string;
  slug: string;
  destinationId: number;
  destinationName?: string;
  basePrice: number;
  listPrice?: number;
  currency: string;
  durationDays: number;
  durationNights: number;
  esgScore?: number;
  leiScore?: number;
  transportType?: string;
  tripMode?: string;
  shortDescription?: string;
  description?: string;
  highlights?: string;
  status: string;
  isFeatured: boolean;
  totalBookings?: number;
  averageRating?: number;
}

export interface TourRequest {
  code: string;
  name: string;
  slug: string;
  destinationId: number;
  basePrice: number;
  durationDays: number;
  durationNights: number;
  currency: string;
  transportType?: string;
  tripMode?: string;
  esgScore?: number;
  leiScore?: number;
  shortDescription?: string;
  description?: string;
  highlights?: string;
  status: string;
  isFeatured: boolean;
  media?: TourMedia[];
}

export const TOUR_QUERY_KEY = ["admin-tours"];

export const useGetTours = (page: number, size: number, search?: string) => {
  return useQuery({
    queryKey: [...TOUR_QUERY_KEY, "list", page, size, search],
    queryFn: async () => {
      const { data } = await apiClient.get<PageResponse<Tour>>("/admin/tours", {
        params: { page, size, keyword: search || undefined },
      });
      return data;
    },
  });
};

export const useCreateTour = () => {
  return useCrudMutation<Tour, TourRequest>({
    mutationFn: (request) => apiClient.post("/admin/tours", request),
    successMessage: "Đã thiết lập Tour tuyến mới!",
    queryKeyToInvalidate: TOUR_QUERY_KEY,
  });
};

export const useUpdateTour = (id: number | null) => {
  return useCrudMutation<Tour, TourRequest>({
    mutationFn: (request) => apiClient.put(`/admin/tours/${id}`, request),
    successMessage: "Đã cập nhật thông tin Tour thành công!",
    queryKeyToInvalidate: TOUR_QUERY_KEY,
  });
};

export const useDeleteTour = () => {
  return useCrudMutation<void, number>({
    mutationFn: (id) => apiClient.delete(`/admin/tours/${id}`),
    successMessage: "Đã gỡ bỏ Tour khỏi hệ thống!",
    queryKeyToInvalidate: TOUR_QUERY_KEY,
  });
};
