import { getScheduleRemainingSeats } from '../../../tours/utils/scheduleSeatAvailability'
import type { ScheduleStatus, TourScheduleResponse } from '../types/schedule'
import { SCHEDULE_STATUS_VALUES } from '../types/schedule'

export function isScheduleStatus(value: unknown): value is ScheduleStatus {
  return (
    typeof value === 'string' &&
    (SCHEDULE_STATUS_VALUES as readonly string[]).includes(value)
  )
}

/**
 * Trạng thái hiển thị (effective) — auto-compute `full` khi
 * `bookedSeats ≥ capacityTotal`, kể cả khi BE còn báo `open`. Không tự gọi
 * PATCH để tránh side-effect; trang Admin có thể chủ động đóng đợt.
 *
 * Ưu tiên các trạng thái terminal (`cancelled`, `completed`, `departed`,
 * `closed`) khi BE đã set sẵn.
 */
export function deriveEffectiveStatus(
  schedule: TourScheduleResponse,
): ScheduleStatus {
  const raw = (schedule.status ?? 'draft').toLowerCase()
  const status = isScheduleStatus(raw) ? raw : 'draft'

  if (
    status === 'cancelled' ||
    status === 'completed' ||
    status === 'departed' ||
    status === 'closed' ||
    status === 'full'
  ) {
    return status
  }

  const remaining = getScheduleRemainingSeats(schedule)
  if (remaining != null && remaining <= 0) {
    return 'full'
  }

  const capacity = schedule.capacityTotal ?? 0
  const booked = schedule.bookedSeats ?? 0
  if (capacity > 0 && booked >= capacity) {
    return 'full'
  }

  return status
}
