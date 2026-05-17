import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { handleApiError } from '../../../lib/handleApiError'
import { PublicBookingsApi } from '../api/publicBookings.api'
import type {
  BookingQuotePayload,
  BookingQuoteResult,
  BookingResponse,
  CreateBookingPayload,
} from '../types/publicBooking'

export const publicBookingKeys = {
  all: ['public', 'bookings'] as const,
  quote: (payload: BookingQuotePayload) =>
    [...publicBookingKeys.all, 'quote', payload] as const,
  detail: (id: number) => [...publicBookingKeys.all, 'detail', id] as const,
  myList: () => [...publicBookingKeys.all, 'me'] as const,
}

/**
 * Hook gọi `POST /bookings/quote` để lấy giá authoritative từ BE.
 * Dùng `useQuery` (POST nhưng cache được vì idempotent với cùng payload).
 */
export function useBookingQuote(
  payload: BookingQuotePayload | null,
  options: Omit<UseQueryOptions<BookingQuoteResult>, 'queryKey' | 'queryFn' | 'enabled'> = {},
) {
  return useQuery<BookingQuoteResult>({
    queryKey:
      payload != null
        ? publicBookingKeys.quote(payload)
        : [...publicBookingKeys.all, 'quote', 'disabled'],
    queryFn: () => PublicBookingsApi.quote(payload as BookingQuotePayload),
    enabled: payload != null && payload.scheduleId > 0 && payload.tourId > 0,
    staleTime: 15_000,
    retry: false,
    ...options,
  })
}

type CreateBookingOptions = {
  /** Callback chạy SAU khi booking tạo thành công, trước khi redirect. */
  onAuthenticated?: (booking: BookingResponse) => void
  /** Tắt redirect mặc định `/bookings/{id}` để caller tự xử lý. */
  disableRedirect?: boolean
} & Omit<
  UseMutationOptions<BookingResponse, unknown, CreateBookingPayload>,
  'mutationFn'
>

/**
 * Mutation tạo booking — sau success:
 * - Toast thành công
 * - Redirect `/bookings/{id}` (trang detail/confirmation, đã có guard auth)
 */
export function useCreateBooking(options: CreateBookingOptions = {}) {
  const navigate = useNavigate()
  const { t } = useTranslation('bookings')
  const { onAuthenticated, disableRedirect, onSuccess, onError, ...rest } = options

  return useMutation<BookingResponse, unknown, CreateBookingPayload>({
    mutationFn: (payload) => PublicBookingsApi.create(payload),
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      toast.success(
        String(
          t('toast.createSuccess', {
            defaultValue: 'Đặt chỗ thành công! Đang chuyển sang trang xác nhận...',
            code: data.bookingCode ?? `#${data.id}`,
          }),
        ),
      )
      onAuthenticated?.(data)
      if (!disableRedirect) {
        navigate(`/booking-confirmation/${data.id}`, { replace: true })
      }
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      const fallback = String(
        t('toast.createFailed', {
          defaultValue: 'Không tạo được đơn đặt chỗ. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
      onError?.(error, variables, context, mutation)
    },
  })
}

export function useBookingDetail(id: number | null | undefined) {
  return useQuery<BookingResponse>({
    queryKey:
      id != null
        ? publicBookingKeys.detail(id)
        : [...publicBookingKeys.all, 'detail', 'disabled'],
    queryFn: () => PublicBookingsApi.detail(id as number),
    enabled: id != null,
    staleTime: 30_000,
  })
}

/** `GET /bookings/me` — danh sách booking của user hiện tại. */
export function useMyBookingsQuery(
  options: Omit<
    UseQueryOptions<BookingResponse[]>,
    'queryKey' | 'queryFn'
  > = {},
) {
  return useQuery<BookingResponse[]>({
    queryKey: publicBookingKeys.myList(),
    queryFn: () => PublicBookingsApi.listMine(),
    staleTime: 30_000,
    ...options,
  })
}

type CancelBookingArgs = { id: number; reason?: string }

/** `PATCH /bookings/{id}/cancel` — user-side hủy đơn của mình. */
export function useCancelMyBooking(
  options: Omit<
    UseMutationOptions<BookingResponse, unknown, CancelBookingArgs>,
    'mutationFn'
  > = {},
) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('bookings')
  const { onSuccess, onError, ...rest } = options

  return useMutation<BookingResponse, unknown, CancelBookingArgs>({
    mutationFn: ({ id, reason }) => PublicBookingsApi.cancel(id, reason),
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      void queryClient.invalidateQueries({
        queryKey: publicBookingKeys.myList(),
      })
      void queryClient.invalidateQueries({
        queryKey: publicBookingKeys.detail(data.id),
      })
      toast.success(String(t('toast.cancelSuccess')))
      onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      toast.error(handleApiError(error, String(t('toast.cancelFailed'))))
      onError?.(error, variables, context, mutation)
    },
  })
}
