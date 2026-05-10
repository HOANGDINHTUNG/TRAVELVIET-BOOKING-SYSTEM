import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { handleApiError } from '../../../../lib/handleApiError'
import type { PageResponse } from '../../../../types/api'
import { publicBookingKeys } from '../../../bookings/hooks/useBookingMutation'
import type { BookingResponse } from '../../../bookings/types/publicBooking'
import { ManagementBookingsApi } from '../api/managementBookings.api'
import type {
  CreateRefundPayload,
  ManagementBookingResponse,
  ManagementBookingSearchParams,
  RefundResponse,
} from '../types/managementBooking'

export const managementBookingKeys = {
  all: ['management', 'bookings'] as const,
  list: (params: ManagementBookingSearchParams) =>
    [...managementBookingKeys.all, 'list', params] as const,
  detail: (id: number) => [...managementBookingKeys.all, 'detail', id] as const,
}

type ManagementBookingsListResult = {
  page: PageResponse<ManagementBookingResponse>
  fallback: boolean
}

export function useManagementBookingsQuery(
  params: ManagementBookingSearchParams = {},
) {
  return useQuery<ManagementBookingsListResult>({
    queryKey: managementBookingKeys.list(params),
    queryFn: () => ManagementBookingsApi.search(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

/* ----------------------------- Mutations ----------------------------- */

function useInvalidateBookingCaches() {
  const queryClient = useQueryClient()
  return (id: number) => {
    void queryClient.invalidateQueries({ queryKey: managementBookingKeys.all })
    void queryClient.invalidateQueries({
      queryKey: publicBookingKeys.detail(id),
    })
    void queryClient.invalidateQueries({
      queryKey: publicBookingKeys.myList(),
    })
  }
}

type StatusActionArgs = { id: number; reason?: string }

type StatusActionOptions = Omit<
  UseMutationOptions<BookingResponse, unknown, StatusActionArgs>,
  'mutationFn'
>

function useStatusActionMutation(
  apiFn: (id: number, reason?: string) => Promise<BookingResponse>,
  toastSuccessKey: string,
  toastFailKey: string,
  options: StatusActionOptions = {},
) {
  const { t } = useTranslation('management')
  const invalidate = useInvalidateBookingCaches()
  const { onSuccess, onError, ...rest } = options

  return useMutation<BookingResponse, unknown, StatusActionArgs>({
    mutationFn: ({ id, reason }) => apiFn(id, reason),
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      invalidate(data.id)
      toast.success(String(t(toastSuccessKey)))
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      toast.error(handleApiError(error, String(t(toastFailKey))))
      onError?.(error, variables, context, mutation)
    },
  })
}

export function useCancelBooking(options?: StatusActionOptions) {
  return useStatusActionMutation(
    ManagementBookingsApi.cancel,
    'bookings.toast.cancelSuccess',
    'bookings.toast.cancelFailed',
    options,
  )
}

export function useCheckInBooking(options?: StatusActionOptions) {
  return useStatusActionMutation(
    ManagementBookingsApi.checkIn,
    'bookings.toast.checkInSuccess',
    'bookings.toast.checkInFailed',
    options,
  )
}

export function useCompleteBooking(options?: StatusActionOptions) {
  return useStatusActionMutation(
    ManagementBookingsApi.complete,
    'bookings.toast.completeSuccess',
    'bookings.toast.completeFailed',
    options,
  )
}

type CreateRefundOptions = Omit<
  UseMutationOptions<RefundResponse, unknown, CreateRefundPayload>,
  'mutationFn'
>

export function useCreateRefund(options: CreateRefundOptions = {}) {
  const { t } = useTranslation('management')
  const invalidate = useInvalidateBookingCaches()
  const { onSuccess, onError, ...rest } = options

  return useMutation<RefundResponse, unknown, CreateRefundPayload>({
    mutationFn: (payload) => ManagementBookingsApi.createRefund(payload),
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      if (data.bookingId) invalidate(data.bookingId)
      toast.success(String(t('bookings.toast.refundSuccess')))
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      toast.error(
        handleApiError(error, String(t('bookings.toast.refundFailed'))),
      )
      onError?.(error, variables, context, mutation)
    },
  })
}
