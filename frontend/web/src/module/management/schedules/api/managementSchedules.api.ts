import { apiClient } from '../../../../lib/apiClient'
import type {
  ScheduleStatus,
  TourScheduleRequestPayload,
  TourScheduleResponse,
} from '../types/schedule'

/**
 * API service cho module Quản lý đợt khởi hành (Tour Schedules).
 *
 * @see backend/src/main/java/com/wedservice/backend/module/tours/controller/AdminTourController.java
 *
 * ⚠️ BE GAP: **Không có endpoint `DELETE /admin/tours/{tourId}/schedules/{scheduleId}`.**
 * FE workaround: dùng `updateStatus(scheduleId, 'cancelled')` để "huỷ" đợt.
 * Khi BE bổ sung DELETE thật (perm `schedule.delete`), thay thế trong helper
 * `cancel()` bên dưới.
 */
export const ManagementSchedulesApi = {
  async listByTourId(tourId: number): Promise<TourScheduleResponse[]> {
    const response = await apiClient.get<TourScheduleResponse[]>(
      `admin/tours/${tourId}/schedules`,
    )
    return response.data
  },

  async detail(args: {
    tourId: number
    scheduleId: number
  }): Promise<TourScheduleResponse> {
    const response = await apiClient.get<TourScheduleResponse>(
      `admin/tours/${args.tourId}/schedules/${args.scheduleId}`,
    )
    return response.data
  },

  async create(args: {
    tourId: number
    payload: TourScheduleRequestPayload
  }): Promise<TourScheduleResponse> {
    const response = await apiClient.post<TourScheduleResponse>(
      `admin/tours/${args.tourId}/schedules`,
      args.payload,
    )
    return response.data
  },

  async update(args: {
    tourId: number
    scheduleId: number
    payload: TourScheduleRequestPayload
  }): Promise<TourScheduleResponse> {
    const response = await apiClient.put<TourScheduleResponse>(
      `admin/tours/${args.tourId}/schedules/${args.scheduleId}`,
      args.payload,
    )
    return response.data
  },

  async updateStatus(args: {
    tourId: number
    scheduleId: number
    status: ScheduleStatus
  }): Promise<TourScheduleResponse> {
    const response = await apiClient.patch<TourScheduleResponse>(
      `admin/tours/${args.tourId}/schedules/${args.scheduleId}/status`,
      { status: args.status },
    )
    return response.data
  },

  /**
   * Workaround "xoá" — BE chưa có DELETE endpoint, gọi PATCH cancelled thay thế.
   */
  async cancel(args: {
    tourId: number
    scheduleId: number
  }): Promise<TourScheduleResponse> {
    return ManagementSchedulesApi.updateStatus({
      ...args,
      status: 'cancelled',
    })
  },
}
