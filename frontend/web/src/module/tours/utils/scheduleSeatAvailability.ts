import type { TourScheduleResponse } from '../types/publicTour'

type SeatFields = Pick<
  TourScheduleResponse,
  'remainingSeats' | 'capacityTotal' | 'bookedSeats'
>

/**
 * Số chỗ còn trống của đợt.
 * - Ưu tiên `remainingSeats` từ BE (generated column).
 * - Fallback: capacityTotal - bookedSeats.
 * - capacityTotal <= 0 → null (không giới hạn chỗ).
 */
export function getScheduleRemainingSeats(
  schedule: SeatFields | null | undefined,
): number | null {
  if (!schedule) return null

  const remainingRaw = schedule.remainingSeats
  if (remainingRaw != null && Number.isFinite(Number(remainingRaw))) {
    return Math.max(0, Number(remainingRaw))
  }

  const capacity = schedule.capacityTotal ?? 0
  if (capacity <= 0) return null

  const booked = schedule.bookedSeats ?? 0
  return Math.max(0, capacity - booked)
}

export function scheduleHasSeatAvailability(
  schedule: SeatFields | null | undefined,
): boolean {
  const remaining = getScheduleRemainingSeats(schedule)
  return remaining == null || remaining > 0
}

export function isBookingOverSeatCapacity(
  schedule: SeatFields | null | undefined,
  seatCount: number,
): boolean {
  if (seatCount <= 0) return false
  const remaining = getScheduleRemainingSeats(schedule)
  if (remaining == null) return false
  return seatCount > remaining
}
