import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../../lib/apiClient";
import type { PageResponse } from "../../../../../types/api";
import { useCrudMutation } from "../../../core/hooks/useCrudMutation";

export interface DestinationMedia {
  id?: number;
  mediaType: string;
  mediaUrl: string;
  altText?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface DestinationFood {
  id?: number;
  foodName: string;
  description?: string;
  isFeatured: boolean;
}

export interface DestinationSpecialty {
  specialtyName: string;
  description?: string;
}

export interface DestinationActivity {
  activityName: string;
  description?: string;
  activityScore: number;
}

export interface DestinationTip {
  tipTitle: string;
  tipContent: string;
  sortOrder: number;
}

export interface DestinationEvent {
  eventName: string;
  eventType?: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  notifyAllFollowers?: boolean;
  isActive?: boolean;
}

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
  rejectionReason?: string;
  isOfficial: boolean;
  parentId?: number;
  mediaList?: DestinationMedia[];
  foods?: DestinationFood[];
  specialties?: DestinationSpecialty[];
  activities?: DestinationActivity[];
  tips?: DestinationTip[];
  events?: DestinationEvent[];
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
  latitude?: number;
  longitude?: number;
  bestTimeFromMonth?: number;
  bestTimeToMonth?: number;
  crowdLevelDefault?: string;
  isFeatured: boolean;
  isActive: boolean;
  isOfficial: boolean;
  parentId?: number;
  mediaList?: DestinationMedia[];
  foods?: DestinationFood[];
  specialties?: DestinationSpecialty[];
  activities?: DestinationActivity[];
  tips?: DestinationTip[];
  events?: DestinationEvent[];
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

export const useGetDestinationByUuid = (uuid: string) => {
  return useQuery({
    queryKey: [...DESTINATION_QUERY_KEY, "detail", uuid],
    queryFn: async () => {
      const { data } = await apiClient.get<Destination>(
        `/admin/destinations/${uuid}`,
      );
      return data;
    },
    enabled: !!uuid,
  });
};
export const useCreateDestination = () => {
  return useCrudMutation<Destination, DestinationRequest>({
    mutationFn: (request) => apiClient.post("/admin/destinations", request),
    successMessage: "Đã thêm mới Điểm Đến trên bản đồ!",
    queryKeyToInvalidate: DESTINATION_QUERY_KEY,
  });
};

export const useUpdateDestination = () => {
  return useCrudMutation<
    Destination,
    { uuid: string; data: DestinationRequest }
  >({
    mutationFn: (request) =>
      apiClient.put(`/admin/destinations/${request.uuid}`, request.data),
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
