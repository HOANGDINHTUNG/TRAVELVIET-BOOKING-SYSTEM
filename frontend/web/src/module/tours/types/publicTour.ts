/**
 * Re-export các type Tour từ module backoffice (cùng map BE DTO).
 * Phía public chỉ hiển thị, không sửa nên không cần định nghĩa lại.
 */
export type {
  TourResponse,
  TourSearchParams,
  TourMediaSummary,
  TourTagSummary,
  TourSortBy,
  TourSortDir,
  TourComboPackageOfferSummary,
  TourDepartureHubSummary,
  TourInclusionFlags,
} from '@/types/tour'

export type {
  TourScheduleResponse,
  ScheduleStatus,
  PassengerType,
} from '@/types/schedule'

/** Itinerary day public — nested vẫn `unknown` ở BE TourResponse, ta chuẩn hoá. */
export type PublicItineraryDay = {
  dayNumber: number | null
  title: string | null
  description: string | null
  overnightDestinationId?: number | null
}
