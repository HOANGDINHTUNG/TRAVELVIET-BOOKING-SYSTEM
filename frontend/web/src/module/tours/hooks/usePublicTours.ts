import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'
import type { PageResponse } from '../../../types/api'
import { PublicToursApi } from '../api/publicTours.api'
import type {
  TourResponse,
  TourScheduleResponse,
  TourSearchParams,
} from '../types/publicTour'

/**
 * Cache key factory cho Public Tours.
 * KHÔNG đụng `management.tourKeys` (Phase 4) — public và admin có cache tách
 * biệt vì BE filter theo permission khác nhau.
 */
export const publicTourKeys = {
  all: ['public', 'tours'] as const,
  list: (params: TourSearchParams) =>
    [...publicTourKeys.all, 'list', params] as const,
  detail: (id: number) => [...publicTourKeys.all, 'detail', id] as const,
  schedules: (tourId: number) =>
    [...publicTourKeys.all, 'schedules', tourId] as const,
}

function normalizeParams(params: TourSearchParams): TourSearchParams {
  return {
    page: 0,
    size: 12,
    sortBy: 'createdAt',
    sortDir: 'desc',
    ...params,
  }
}

type ListOptions = Omit<
  UseQueryOptions<PageResponse<TourResponse>>,
  'queryKey' | 'queryFn'
>

export function useTourListQuery(
  params: TourSearchParams = {},
  options: ListOptions = {},
) {
  const merged = normalizeParams(params)
  return useQuery<PageResponse<TourResponse>>({
    queryKey: publicTourKeys.list(merged),
    queryFn: () => PublicToursApi.search(merged),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
    ...options,
  })
}

type DetailOptions = Omit<
  UseQueryOptions<TourResponse>,
  'queryKey' | 'queryFn' | 'enabled'
>

/**
 * Public detail. Caller truyền `id` đã được trích từ slug
 * (xem `tours/utils/slug.ts#extractTourIdFromSlug`).
 */
export function useTourDetailQuery(
  id: number | null | undefined,
  options: DetailOptions = {},
) {
  return useQuery<TourResponse>({
    queryKey:
      id != null
        ? publicTourKeys.detail(id)
        : [...publicTourKeys.all, 'detail', 'disabled'],
    queryFn: () => PublicToursApi.getById(id as number),
    enabled: id != null,
    staleTime: 5 * 60_000,
    ...options,
  })
}

type SchedulesOptions = Omit<
  UseQueryOptions<TourScheduleResponse[]>,
  'queryKey' | 'queryFn' | 'enabled'
>

export function usePublicTourSchedulesQuery(
  tourId: number | null | undefined,
  options: SchedulesOptions = {},
) {
  return useQuery<TourScheduleResponse[]>({
    queryKey:
      tourId != null
        ? publicTourKeys.schedules(tourId)
        : [...publicTourKeys.all, 'schedules', 'disabled'],
    queryFn: () => PublicToursApi.getSchedules(tourId as number),
    enabled: tourId != null,
    staleTime: 30_000,
    ...options,
  })
}
