import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { handleApiError } from '../../../../lib/handleApiError'
import { tourKeys } from '../../tours/hooks/useTours'
import { ManagementSchedulesApi } from '../api/managementSchedules.api'
import type {
  ScheduleStatus,
  TourScheduleRequestPayload,
  TourScheduleResponse,
} from '../types/schedule'

/**
 * Cache key factory cho module Schedules.
 * - `tourList(tourId)` cho danh sách đợt theo Tour.
 * - `detail(tourId, scheduleId)` cho 1 đợt cụ thể.
 */
export const scheduleKeys = {
  all: ['management', 'schedules'] as const,
  tourList: (tourId: number) =>
    [...scheduleKeys.all, 'byTour', tourId] as const,
  detail: (tourId: number, scheduleId: number) =>
    [...scheduleKeys.all, 'detail', tourId, scheduleId] as const,
}

type SchedulesQueryOptions = Omit<
  UseQueryOptions<TourScheduleResponse[]>,
  'queryKey' | 'queryFn'
>

export function useTourSchedulesQuery(
  tourId: number | null | undefined,
  options: SchedulesQueryOptions = {},
) {
  return useQuery<TourScheduleResponse[]>({
    queryKey:
      tourId != null
        ? scheduleKeys.tourList(tourId)
        : [...scheduleKeys.all, 'byTour', 'disabled'],
    queryFn: () => ManagementSchedulesApi.listByTourId(tourId as number),
    enabled: tourId != null,
    staleTime: 30_000,
    ...options,
  })
}

/* -------------------------------------------------------------------------- */
/*                                Mutations                                   */
/* -------------------------------------------------------------------------- */

/**
 * Helper invalidate gộp: refresh danh sách Schedules CỦA Tour, cache detail
 * của Tour (số lượng đợt khởi hành), và cache list Tour (badge/count đặt chỗ).
 */
function invalidateScheduleCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  tourId: number,
) {
  queryClient.invalidateQueries({ queryKey: scheduleKeys.tourList(tourId) })
  queryClient.invalidateQueries({ queryKey: tourKeys.detail(tourId) })
  queryClient.invalidateQueries({ queryKey: tourKeys.all })
}

type CreateMutationVars = {
  tourId: number
  payload: TourScheduleRequestPayload
}
type CreateMutationOptions = Omit<
  UseMutationOptions<TourScheduleResponse, unknown, CreateMutationVars>,
  'mutationFn'
>

export function useCreateSchedule(options: CreateMutationOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('management')
  const { onSuccess, onError, ...rest } = options

  return useMutation<TourScheduleResponse, unknown, CreateMutationVars>({
    mutationFn: (vars) => ManagementSchedulesApi.create(vars),
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      invalidateScheduleCaches(queryClient, variables.tourId)
      toast.success(
        String(
          t('tours.schedules.toast.createSuccess', {
            defaultValue: 'Đã tạo đợt khởi hành.',
          }),
        ),
      )
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('tours.schedules.toast.createFailed', {
          defaultValue: 'Không tạo được đợt khởi hành. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}

type UpdateMutationVars = {
  tourId: number
  scheduleId: number
  payload: TourScheduleRequestPayload
}
type UpdateMutationOptions = Omit<
  UseMutationOptions<TourScheduleResponse, unknown, UpdateMutationVars>,
  'mutationFn'
>

export function useUpdateSchedule(options: UpdateMutationOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('management')
  const { onSuccess, onError, ...rest } = options

  return useMutation<TourScheduleResponse, unknown, UpdateMutationVars>({
    mutationFn: (vars) => ManagementSchedulesApi.update(vars),
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      invalidateScheduleCaches(queryClient, variables.tourId)
      toast.success(
        String(
          t('tours.schedules.toast.updateSuccess', {
            defaultValue: 'Đã cập nhật đợt khởi hành.',
          }),
        ),
      )
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('tours.schedules.toast.updateFailed', {
          defaultValue: 'Không cập nhật được đợt khởi hành. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}

type StatusMutationVars = {
  tourId: number
  scheduleId: number
  status: ScheduleStatus
}
type StatusMutationOptions = Omit<
  UseMutationOptions<TourScheduleResponse, unknown, StatusMutationVars>,
  'mutationFn'
>

export function useUpdateScheduleStatus(options: StatusMutationOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('management')
  const { onSuccess, onError, ...rest } = options

  return useMutation<TourScheduleResponse, unknown, StatusMutationVars>({
    mutationFn: (vars) => ManagementSchedulesApi.updateStatus(vars),
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      invalidateScheduleCaches(queryClient, variables.tourId)
      toast.success(
        String(
          t('tours.schedules.toast.statusSuccess', {
            defaultValue: 'Đã cập nhật trạng thái đợt khởi hành.',
          }),
        ),
      )
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('tours.schedules.toast.statusFailed', {
          defaultValue: 'Không cập nhật được trạng thái. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}

type CancelMutationVars = { tourId: number; scheduleId: number }
type CancelMutationOptions = Omit<
  UseMutationOptions<TourScheduleResponse, unknown, CancelMutationVars>,
  'mutationFn'
>

/**
 * Workaround "xoá đợt" — gọi PATCH status='cancelled' (BE chưa có DELETE).
 */
export function useCancelSchedule(options: CancelMutationOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('management')
  const { onSuccess, onError, ...rest } = options

  return useMutation<TourScheduleResponse, unknown, CancelMutationVars>({
    mutationFn: (vars) => ManagementSchedulesApi.cancel(vars),
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      invalidateScheduleCaches(queryClient, variables.tourId)
      toast.success(
        String(
          t('tours.schedules.toast.cancelSuccess', {
            defaultValue: 'Đã huỷ đợt khởi hành.',
          }),
        ),
      )
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('tours.schedules.toast.cancelFailed', {
          defaultValue: 'Không huỷ được đợt khởi hành. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}
