/**
 * Types cho module Quản lý đợt khởi hành (Tour Schedules).
 *
 * Map 1-1 với backend `TourScheduleResponse.java` / `TourScheduleRequest.java`.
 *
 * ⚠️ Lưu ý nghiệp vụ pricing:
 * Backend dùng **flat fields** `adultPrice/childPrice/infantPrice/seniorPrice`,
 * trong khi FE biểu diễn qua mảng `passengerPrices[]` (UX `useFieldArray` gọn
 * hơn). Adapter chuyển đổi nằm ở `scheduleSchema.ts` (`toSchedulePayload` /
 * `scheduleResponseToFormDefaults`).
 *
 * @see backend/src/main/java/com/wedservice/backend/module/tours/dto/response/TourScheduleResponse.java
 * @see backend/src/main/java/com/wedservice/backend/module/tours/dto/request/TourScheduleRequest.java
 */

/** Trạng thái đợt khởi hành — khớp `TourScheduleStatus.java`. */
export const SCHEDULE_STATUS_VALUES = [
  'draft',
  'open',
  'closed',
  'full',
  'departed',
  'completed',
  'cancelled',
] as const

export type ScheduleStatus = (typeof SCHEDULE_STATUS_VALUES)[number]

/** Loại khách trong bảng giá. */
export const PASSENGER_TYPES = ['adult', 'child', 'infant', 'senior'] as const
export type PassengerType = (typeof PASSENGER_TYPES)[number]

export type PassengerPrice = {
  passengerType: PassengerType
  price: number
}

export type TourSchedulePickupPointResponse = {
  id?: number
  pointName: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  pickupAt: string | null
  sortOrder: number | null
}

export type TourScheduleGuideResponse = {
  id?: number
  guideId: number
  guideRole: string | null
}

/** Map từ `TourScheduleResponse.java`. */
export type TourScheduleResponse = {
  id: number
  scheduleCode: string | null
  tourId: number
  departureAt: string | null
  returnAt: string | null
  bookingOpenAt: string | null
  bookingCloseAt: string | null
  meetingAt: string | null
  meetingPointName: string | null
  meetingAddress: string | null
  meetingLatitude: number | null
  meetingLongitude: number | null
  capacityTotal: number | null
  bookedSeats: number | null
  remainingSeats: number | null
  minGuestsToOperate: number | null
  adultPrice: number | null
  childPrice: number | null
  infantPrice: number | null
  seniorPrice: number | null
  singleRoomSurcharge: number | null
  transportDetail: string | null
  note: string | null
  status: string | null
  pickupPoints?: TourSchedulePickupPointResponse[] | null
  guideAssignments?: TourScheduleGuideResponse[] | null
}

/** Payload cho `POST/PUT /admin/tours/{tourId}/schedules`. */
export type TourScheduleRequestPayload = {
  scheduleCode?: string
  departureAt: string
  returnAt: string
  bookingOpenAt?: string
  bookingCloseAt?: string
  meetingAt?: string
  meetingPointName?: string
  meetingAddress?: string
  meetingLatitude?: number
  meetingLongitude?: number
  capacityTotal: number
  minGuestsToOperate?: number
  adultPrice: number
  childPrice?: number
  infantPrice?: number
  seniorPrice?: number
  singleRoomSurcharge?: number
  transportDetail?: string
  note?: string
  status?: string
}
