import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../../lib/apiClient";
import type { PageResponse } from "../../../../../types/api";
import { useCrudMutation } from "../../../core/hooks/useCrudMutation";

export interface Destination {
  id: number;
  uuid: string;
  code: string;
  name: string;
  slug: string;
  countryCode: string;
  province: string;
  district?: string;
  region?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  shortDescription?: string;
  description?: string;
  bestTimeFromMonth?: number;
  bestTimeToMonth?: number;
  crowdLevelDefault?: string;
  isFeatured: boolean;
  isActive: boolean;
  status: string;
  isOfficial: boolean;
}

export interface DestinationRequest {
  code: string;
  name: string;
  slug?: string;
  countryCode: string;
  province: string;
  district?: string;
  region?: string;
  address?: string;
  shortDescription?: string;
  description?: string;
  bestTimeFromMonth?: number;
  bestTimeToMonth?: number;
  crowdLevelDefault?: string;
  isFeatured: boolean;
  isActive: boolean;
  isOfficial: boolean;
}

export const DESTINATION_QUERY_KEY = ["admin-destinations"];

// Lấy danh sách dùng UUID (Thay thế hàm lấy ID trong Hotel)
export const useGetDestinations = (
  page: number,
  size: number,
  search?: string,
) => {
  return useQuery({
    queryKey: [...DESTINATION_QUERY_KEY, "list", page, size, search],
    queryFn: async () => {
      const { data } = await apiClient.get<PageResponse<Destination>>(
        "/admin/destinations",
        {
          params: { page, size, keyword: search || undefined },
        },
      );
      return data;
    },
  });
};

export const useCreateDestination = () => {
  return useCrudMutation<Destination, DestinationRequest>({
    mutationFn: (request) => apiClient.post("/admin/destinations", request),
    successMessage: "Đã thêm mới Điểm Đến trên bản đồ!",
    queryKeyToInvalidate: DESTINATION_QUERY_KEY,
  });
};

export const useUpdateDestination = (uuid: string | null) => {
  return useCrudMutation<Destination, DestinationRequest>({
    mutationFn: (request) =>
      apiClient.put(`/admin/destinations/${uuid}`, request),
    successMessage: "Đã sửa đổi Điểm Đến thành công!",
    queryKeyToInvalidate: DESTINATION_QUERY_KEY,
  });
};

export const useDeleteDestination = () => {
  return useCrudMutation<void, string>({
    mutationFn: (uuid) => apiClient.delete(`/admin/destinations/${uuid}`),
    successMessage: "Đã xóa Điểm Đến thành công!",
    queryKeyToInvalidate: DESTINATION_QUERY_KEY,
  });
};
