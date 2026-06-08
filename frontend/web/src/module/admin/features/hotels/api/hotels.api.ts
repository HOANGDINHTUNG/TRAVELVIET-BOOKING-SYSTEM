import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../../lib/apiClient";
import { useCrudMutation } from "../../../core/hooks/useCrudMutation";
import type { PageResponse } from "../../../../../types/api";
export interface RoomType {
  name: string;
  pricePerNight: number;
  maxOccupancy: number;
  totalRooms: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  starRating: number;
  destinationId: number;
  status: "ACTIVE" | "INACTIVE";
  roomTypes: RoomType[];
}

export type CreateHotelPayload = Omit<Hotel, "id">;

export const HOTEL_QUERY_KEY = ["admin-hotels"];

export const useGetHotels = (page: number, size: number, search: string) => {
  return useQuery({
    queryKey: [...HOTEL_QUERY_KEY, "list", page, size, search],
    queryFn: async () => {
      const { data } = await apiClient.get<PageResponse<Hotel>>("/hotels", {
        params: { page, size, keyword: search || undefined },
      });
      return data;
    },
  });
};

export const useCreateHotel = () => {
  return useCrudMutation<Hotel, CreateHotelPayload>({
    mutationFn: async (payload: CreateHotelPayload) => {
      const { data } = await apiClient.post<Hotel>("/admin/hotels", payload);
      return data;
    },
    queryKeyToInvalidate: HOTEL_QUERY_KEY,
    successMessage: "Tạo Khách sạn thành công!",
  });
};

export const useUpdateHotel = (id: string | null) => {
  return useCrudMutation<Hotel, Partial<CreateHotelPayload>>({
    mutationFn: async (payload: Partial<CreateHotelPayload>) => {
      if (!id) throw new Error("Cần truyền ID để cập nhật");
      const { data } = await apiClient.put<Hotel>(
        `/admin/hotels/${id}`,
        payload,
      );
      return data;
    },
    queryKeyToInvalidate: HOTEL_QUERY_KEY,
    successMessage: "Cập nhật Khách sạn thành công!",
  });
};

export const useDeleteHotel = () => {
  return useCrudMutation<void, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/hotels/${id}`);
    },
    queryKeyToInvalidate: HOTEL_QUERY_KEY,
    successMessage: "Xóa Khách sạn thành công!",
  });
};
