import { apiClient } from '../../../lib/apiClient'
import type { PageResponse } from '../../../types/api'
import type {
  TourResponse,
  TourScheduleResponse,
  TourSearchParams,
} from '../types/publicTour'

/**
 * Public Tour API — `apiClient` đã tự gắn `Accept-Language` qua interceptor,
 * nên không cần truyền tay. BE trả nội dung theo locale tương ứng.
 *
 * @see backend/src/main/java/com/wedservice/backend/module/tours/controller/TourController.java
 */
function toQueryParams(params: TourSearchParams): Record<string, string> {
  const output: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    output[key] = String(value)
  }
  return output
}

export const PublicToursApi = {
  /**
   * `GET /tours?...` — public search.
   * Mặc định size=12 cho grid catalog, sortBy=createdAt desc.
   */
  async search(
    params: TourSearchParams = {},
  ): Promise<PageResponse<TourResponse>> {
    const merged: TourSearchParams = {
      page: 0,
      size: 12,
      sortBy: 'createdAt',
      sortDir: 'desc',
      ...params,
    }
    const response = await apiClient.get<PageResponse<TourResponse>>('tours', {
      params: toQueryParams(merged),
    })
    return response.data
  },

  /**
   * `GET /tours/{id}` — public tour detail by numeric id.
   *
   * ⚠️ BE GAP: Không có `GET /tours/by-slug/{slug}`. FE caller phải parse id
   * từ URL slug trước (xem `utils/slug.ts#extractTourIdFromSlug`).
   */
  async getById(id: number): Promise<TourResponse> {
    const response = await apiClient.get<TourResponse>(`tours/${id}`)
    return response.data
  },

  /**
   * `GET /tours/{id}/schedules` — public list schedules cho 1 tour.
   * Public-friendly: không yêu cầu auth.
   */
  async getSchedules(tourId: number): Promise<TourScheduleResponse[]> {
    const response = await apiClient.get<TourScheduleResponse[]>(
      `tours/${tourId}/schedules`,
    )
    return response.data
  },
}
