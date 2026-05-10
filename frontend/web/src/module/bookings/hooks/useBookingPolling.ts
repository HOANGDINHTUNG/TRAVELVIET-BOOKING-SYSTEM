import { useQuery } from '@tanstack/react-query'
import { PublicBookingsApi } from '../api/publicBookings.api'
import { publicBookingKeys } from './useBookingMutation'
import type { BookingResponse } from '../types/publicBooking'

type UseBookingPollingOptions = {
  /** Số ms giữa mỗi lần refetch khi `paymentStatus` còn `pending`. */
  intervalMs?: number
  /** Số lần refetch tối đa, sau đó dừng. */
  maxAttempts?: number
}

/**
 * Poll booking detail dùng cho PaymentReturnPage:
 * - Nếu `paymentStatus !== 'pending'` → dừng poll (đã có cập nhật từ IPN)
 * - Nếu vượt `maxAttempts` lần → dừng poll, để user nhấn nút "Refresh"
 * - F5 idempotent: query restart từ đầu, không POST gì
 */
export function useBookingPolling(
  bookingId: number | null,
  options: UseBookingPollingOptions = {},
) {
  const { intervalMs = 1500, maxAttempts = 6 } = options

  return useQuery<BookingResponse>({
    queryKey:
      bookingId != null
        ? publicBookingKeys.detail(bookingId)
        : [...publicBookingKeys.all, 'detail', 'disabled'],
    queryFn: () => PublicBookingsApi.detail(bookingId as number),
    enabled: bookingId != null,
    staleTime: 0,
    refetchInterval: (query) => {
      const data = query.state.data
      const dataUpdateCount = query.state.dataUpdateCount
      if (!data) return intervalMs
      const status = data.paymentStatus
      const isPending = status === 'pending' || status == null
      if (!isPending) return false
      if (dataUpdateCount >= maxAttempts) return false
      return intervalMs
    },
    refetchOnWindowFocus: false,
  })
}
