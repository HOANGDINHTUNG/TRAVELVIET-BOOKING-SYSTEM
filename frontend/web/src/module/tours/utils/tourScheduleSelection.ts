import { deriveEffectiveStatus } from '@/utils/scheduleStatus'
import { scheduleHasSeatAvailability } from './scheduleSeatAvailability'
import type { TourScheduleResponse } from '../types/publicTour'

/** Lịch public có thể đặt: trạng thái effective `open` (không full/closed/draft). */
export function listBookableSchedules(
  schedules: TourScheduleResponse[] | null | undefined,
): TourScheduleResponse[] {
  return (schedules ?? [])
    .filter((schedule) => deriveEffectiveStatus(schedule) === 'open')
    .filter((schedule) => scheduleHasSeatAvailability(schedule))
    .sort((a, b) => {
      const ad = a.departureAt ? new Date(a.departureAt).getTime() : 0
      const bd = b.departureAt ? new Date(b.departureAt).getTime() : 0
      return ad - bd
    })
}

/** Đợt sớm nhất còn mở — dùng auto-select khi vào trang chi tiết. */
export function pickDefaultBookableSchedule(
  schedules: TourScheduleResponse[] | null | undefined,
): TourScheduleResponse | null {
  return listBookableSchedules(schedules)[0] ?? null
}

export function isScheduleStillBookable(
  scheduleId: number | null,
  schedules: TourScheduleResponse[] | null | undefined,
): boolean {
  if (scheduleId == null) return false
  return listBookableSchedules(schedules).some((s) => s.id === scheduleId)
}
