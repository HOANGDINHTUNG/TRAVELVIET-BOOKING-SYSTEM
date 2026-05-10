import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { PageResponse } from '../../../../types/api'
import { handleApiError } from '../../../../lib/handleApiError'
import { ManagementToursApi } from '../api/managementTours.api'
import type {
  TourResponse,
  TourSearchParams,
  TourStatus,
} from '../types/tour'
import { DEFAULT_TOUR_SEARCH_PARAMS } from '../types/tour'
import type { TourRequestForm } from '../validation/tourSchema'

/**
 * Query Key Factory cho module Quản lý Tours.
 * Theo TanStack Query v5 best practice: lồng `lists`/`details` vào `all` để
 * `invalidateQueries({ queryKey: tourKeys.all })` reset toàn bộ namespace.
 */
export const tourKeys = {
  all: ['management', 'tours'] as const,
  lists: () => [...tourKeys.all, 'list'] as const,
  list: (params: TourSearchParams) =>
    [...tourKeys.lists(), normalizeParams(params)] as const,
  details: () => [...tourKeys.all, 'detail'] as const,
  detail: (id: number) => [...tourKeys.details(), id] as const,
}

function normalizeParams(params: TourSearchParams): TourSearchParams {
  return { ...DEFAULT_TOUR_SEARCH_PARAMS, ...params }
}

type ToursQueryOptions = Omit<
  UseQueryOptions<PageResponse<TourResponse>>,
  'queryKey' | 'queryFn'
>

export function useToursQuery(
  params: TourSearchParams = {},
  options: ToursQueryOptions = {},
) {
  const merged = normalizeParams(params)
  return useQuery<PageResponse<TourResponse>>({
    queryKey: tourKeys.list(merged),
    queryFn: () => ManagementToursApi.list(merged),
    placeholderData: keepPreviousData,
    ...options,
  })
}

export function useTourDetailQuery(
  id: number | null | undefined,
  options: Omit<UseQueryOptions<TourResponse>, 'queryKey' | 'queryFn'> = {},
) {
  return useQuery<TourResponse>({
    queryKey: tourKeys.detail(id ?? -1),
    queryFn: () => ManagementToursApi.detail(id as number),
    enabled: typeof id === 'number' && id > 0,
    ...options,
  })
}

/* -------------------------------------------------------------------------- */
/* Mutations                                                                  */
/* -------------------------------------------------------------------------- */

type CreateMutationOptions = Omit<
  UseMutationOptions<TourResponse, unknown, TourRequestForm>,
  'mutationFn'
>

/**
 * Tạo tour mới — `POST /admin/tours`.
 * `onSuccess`: invalidate toàn bộ namespace `tourKeys.all` + toast success.
 *              Sau đó gọi `options.onSuccess` (nếu có) để caller chạy hậu xử lý.
 * `onError`:   toast error đã đi qua `handleApiError` (i18n).
 */
export function useCreateTour(options: CreateMutationOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('management')
  const { onSuccess, onError, ...rest } = options

  return useMutation<TourResponse, unknown, TourRequestForm>({
    ...rest,
    mutationFn: (form) => ManagementToursApi.create(form),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: tourKeys.all })
      toast.success(
        String(
          t('tours.toast.createSuccess', {
            defaultValue: 'Đã tạo tour mới.',
          }),
        ),
      )
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('tours.toast.createFailed', {
          defaultValue: 'Không tạo được tour. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}

type UpdateMutationVariables = { id: number; form: TourRequestForm }
type UpdateMutationOptions = Omit<
  UseMutationOptions<TourResponse, unknown, UpdateMutationVariables>,
  'mutationFn'
>

/**
 * Cập nhật tour — `PUT /admin/tours/{id}`.
 */
export function useUpdateTour(options: UpdateMutationOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('management')
  const { onSuccess, onError, ...rest } = options

  return useMutation<TourResponse, unknown, UpdateMutationVariables>({
    ...rest,
    mutationFn: (args) => ManagementToursApi.update(args),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: tourKeys.all })
      queryClient.invalidateQueries({
        queryKey: tourKeys.detail(variables.id),
      })
      toast.success(
        String(
          t('tours.toast.updateSuccess', {
            defaultValue: 'Đã cập nhật tour.',
          }),
        ),
      )
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('tours.toast.updateFailed', {
          defaultValue: 'Không cập nhật được tour. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}

type DeleteMutationOptions = Omit<
  UseMutationOptions<void, unknown, number>,
  'mutationFn'
>

/**
 * Xoá tour — `DELETE /admin/tours/{id}`.
 */
export function useDeleteTour(options: DeleteMutationOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('management')
  const { onSuccess, onError, ...rest } = options

  return useMutation<void, unknown, number>({
    ...rest,
    mutationFn: (id) => ManagementToursApi.remove(id),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: tourKeys.all })
      toast.success(
        String(
          t('tours.toast.deleteSuccess', {
            defaultValue: 'Đã xoá tour.',
          }),
        ),
      )
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('tours.toast.deleteFailed', {
          defaultValue: 'Không xoá được tour. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}

type StatusMutationVariables = {
  id: number
  currentTour: TourResponse
  status: TourStatus
}

type StatusMutationOptions = Omit<
  UseMutationOptions<TourResponse, unknown, StatusMutationVariables>,
  'mutationFn'
>

/**
 * Đổi nhanh trạng thái tour — wrapper PUT (TODO: chuyển sang PATCH khi BE bổ sung).
 */
export function useUpdateTourStatus(options: StatusMutationOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('management')
  const { onSuccess, onError, ...rest } = options

  return useMutation<TourResponse, unknown, StatusMutationVariables>({
    ...rest,
    mutationFn: (vars) => ManagementToursApi.updateStatus(vars),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: tourKeys.all })
      queryClient.invalidateQueries({
        queryKey: tourKeys.detail(variables.id),
      })
      toast.success(
        String(
          t('tours.toast.statusSuccess', {
            defaultValue: 'Đã cập nhật trạng thái.',
          }),
        ),
      )
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('tours.toast.updateFailed', {
          defaultValue: 'Không cập nhật được tour. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}
