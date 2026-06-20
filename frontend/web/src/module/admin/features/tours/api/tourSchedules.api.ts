import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../../lib/apiClient";
import { useCrudMutation } from "../../../core/hooks/useCrudMutation";

export interface TourScheduleResponse {
  id: number;
  scheduleCode: string;
  tourId: number;
  departureAt: string;
  returnAt: string;
  bookingOpenAt: string;
  bookingCloseAt: string;
  capacityTotal: number;
  bookedSeats: number;
  remainingSeats: number;
  minGuestsToOperate: number;
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  seniorPrice: number;
  singleRoomSurcharge: number;
  status: string;
}

export interface TourScheduleRequest {
  scheduleCode: string;
  departureAt: string;
  returnAt: string;
  bookingOpenAt: string;
  bookingCloseAt: string;
  capacityTotal: number;
  minGuestsToOperate: number;
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  seniorPrice: number;
  status: string;
}

export const TOUR_SCHEDULES_QUERY_KEY = (tourId: number) => [
  "admin-tours",
  tourId,
  "schedules",
];

export const useGetTourSchedules = (tourId: number | null) => {
  return useQuery({
    queryKey: tourId ? TOUR_SCHEDULES_QUERY_KEY(tourId) : [],
    queryFn: async () => {
      const { data } = await apiClient.get<TourScheduleResponse[]>(
        `/admin/tours/${tourId}/schedules`,
      );
      return data;
    },
    enabled: !!tourId,
  });
};

export const useCreateTourSchedule = (tourId: number | null) => {
  return useCrudMutation<TourScheduleResponse, TourScheduleRequest>({
    mutationFn: (request) =>
      apiClient.post(`/admin/tours/${tourId}/schedules`, request),
    successMessage: "Đã tạo lịch trình mới thành công!",
    queryKeyToInvalidate: tourId ? TOUR_SCHEDULES_QUERY_KEY(tourId) : [],
  });
};

export const useUpdateTourSchedule = (
  tourId: number | null,
  scheduleId: number | null,
) => {
  return useCrudMutation<TourScheduleResponse, TourScheduleRequest>({
    mutationFn: (request) =>
      apiClient.put(`/admin/tours/${tourId}/schedules/${scheduleId}`, request),
    successMessage: "Cập nhật thông tin lịch trình thành công!",
    queryKeyToInvalidate: tourId ? TOUR_SCHEDULES_QUERY_KEY(tourId) : [],
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateTourScheduleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tourId,
      scheduleId,
      status,
    }: {
      tourId: number;
      scheduleId: number;
      status: string;
    }) =>
      apiClient.patch(`/admin/tours/${tourId}/schedules/${scheduleId}/status`, {
        status,
      }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: TOUR_SCHEDULES_QUERY_KEY(variables.tourId),
      });
      toast.success("Cập nhật trạng thái lịch trình thành công!");
    },
    onError: () => {
      toast.error("Không thể cập nhật trạng thái lịch trình.");
    },
  });
};
