import { apiClient } from '../../../../lib/apiClient'
import type { PageResponse } from '../../../../types/api'
import type {
  TourResponse,
  TourSearchParams,
  TourStatus,
} from '../types/tour'
import type { TourRequestForm } from '../validation/tourSchema'

/**
 * Build query params có loại bỏ giá trị null/undefined/'' để tránh gửi field rỗng.
 */
function toQueryParams(params: TourSearchParams): Record<string, string> {
  const output: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    output[key] = String(value)
  }
  return output
}

/**
 * Build payload `TourRequest` (BE DTO) từ form FE đã được Zod parse.
 * - Trim chuỗi rỗng → bỏ field (BE @Size áp dụng nếu có giá trị).
 * - Normalize boolean isFeatured.
 */
function emptyToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

function toTourRequestPayload(form: TourRequestForm) {
  const payload: Record<string, unknown> = {
    code: form.code.trim(),
    name: form.name.trim(),
    slug: form.slug.trim(),
    destinationId: form.destinationId,
    basePrice: form.basePrice,
    durationDays: form.durationDays,
  }

  if (form.cancellationPolicyId != null) {
    payload.cancellationPolicyId = form.cancellationPolicyId
  }

  const currency = emptyToUndefined(form.currency)?.toUpperCase()
  if (currency) payload.currency = currency

  if (form.durationNights != null) payload.durationNights = form.durationNights

  const optionalText = {
    transportType: emptyToUndefined(form.transportType),
    tripMode: emptyToUndefined(form.tripMode),
    shortDescription: emptyToUndefined(form.shortDescription),
    description: emptyToUndefined(form.description),
    highlights: emptyToUndefined(form.highlights),
    inclusions: emptyToUndefined(form.inclusions),
    exclusions: emptyToUndefined(form.exclusions),
    notes: emptyToUndefined(form.notes),
  }
  for (const [key, value] of Object.entries(optionalText)) {
    if (value !== undefined) payload[key] = value
  }

  if (form.isFeatured != null) payload.isFeatured = form.isFeatured
  if (form.status) payload.status = form.status

  if (form.tagIds && form.tagIds.length > 0) {
    payload.tagIds = form.tagIds
  }

  if (form.media && form.media.length > 0) {
    payload.media = form.media.map((m, index) => ({
      mediaType: m.mediaType,
      mediaUrl: m.mediaUrl,
      altText: emptyToUndefined(m.altText) ?? null,
      sortOrder: m.sortOrder ?? index,
      isActive: m.isActive ?? true,
    }))
  }

  if (form.itineraryDays && form.itineraryDays.length > 0) {
    payload.itineraryDays = form.itineraryDays.map((day) => ({
      dayNumber: day.dayNumber,
      title: day.title.trim(),
      description: emptyToUndefined(day.description),
      overnightDestinationId: day.overnightDestinationId,
    }))
  }

  return payload
}

/**
 * Quản lý Tours — bám sát `AdminTourController` (`/admin/tours`).
 * Response interceptor đã unwrap `ApiResponse<T>` ⇒ trả thẳng generic.
 *
 * - `list`     → GET    /admin/tours       (perm `tour.view`)
 * - `detail`   → GET    /admin/tours/{id}  (perm `tour.view`)
 * - `create`   → POST   /admin/tours       (perm `tour.create`)
 * - `update`   → PUT    /admin/tours/{id}  (perm `tour.update`)
 * - `remove`   → DELETE /admin/tours/{id}  (perm `tour.delete`)
 *
 * @todo BE chưa expose `PATCH /admin/tours/{id}/status` ⇒ `updateStatus`
 *       hiện build payload từ `TourResponse` rồi PUT full body. Sau khi BE bổ
 *       sung patch endpoint, đổi sang `apiClient.patch(...)`.
 */
export const ManagementToursApi = {
  async list(params: TourSearchParams = {}): Promise<PageResponse<TourResponse>> {
    const response = await apiClient.get<PageResponse<TourResponse>>(
      'admin/tours',
      {
        params: toQueryParams(params),
      },
    )
    return response.data
  },

  async detail(id: number): Promise<TourResponse> {
    const response = await apiClient.get<TourResponse>(`admin/tours/${id}`)
    return response.data
  },

  async create(form: TourRequestForm): Promise<TourResponse> {
    const response = await apiClient.post<TourResponse>(
      'admin/tours',
      toTourRequestPayload(form),
    )
    return response.data
  },

  async update(args: { id: number; form: TourRequestForm }): Promise<TourResponse> {
    const response = await apiClient.put<TourResponse>(
      `admin/tours/${args.id}`,
      toTourRequestPayload(args.form),
    )
    return response.data
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`admin/tours/${id}`)
  },

  /**
   * Chỉnh nhanh status — wrapper PUT /admin/tours/{id} với form rebuild từ
   * `TourResponse` hiện có (do BE chưa có PATCH).
   */
  async updateStatus(args: {
    id: number
    currentTour: TourResponse
    status: TourStatus
  }): Promise<TourResponse> {
    const form: TourRequestForm = {
      code: args.currentTour.code ?? '',
      name: args.currentTour.name ?? '',
      slug: args.currentTour.slug ?? '',
      destinationId: args.currentTour.destinationId ?? 0,
      cancellationPolicyId: args.currentTour.cancellationPolicyId ?? undefined,
      basePrice: args.currentTour.basePrice ?? 0,
      currency: args.currentTour.currency ?? 'VND',
      durationDays: args.currentTour.durationDays ?? 1,
      durationNights: args.currentTour.durationNights ?? 0,
      transportType: args.currentTour.transportType ?? '',
      tripMode: args.currentTour.tripMode ?? '',
      shortDescription: args.currentTour.shortDescription ?? '',
      description: args.currentTour.description ?? '',
      highlights: args.currentTour.highlights ?? '',
      inclusions: args.currentTour.inclusions ?? '',
      exclusions: args.currentTour.exclusions ?? '',
      notes: args.currentTour.notes ?? '',
      isFeatured: args.currentTour.isFeatured ?? false,
      status: args.status,
      tagIds: (args.currentTour.tags ?? [])
        .map((tag) => tag.id)
        .filter((id): id is number => typeof id === 'number'),
      media: (args.currentTour.media ?? [])
        .filter((m) => m.mediaUrl != null)
        .map((m, index) => ({
          mediaType: m.mediaType ?? 'image',
          mediaUrl: m.mediaUrl as string,
          altText: m.altText ?? undefined,
          sortOrder: m.sortOrder ?? index,
          isActive: m.isActive ?? true,
        })),
      itineraryDays: [],
    }
    return ManagementToursApi.update({ id: args.id, form })
  },
}
