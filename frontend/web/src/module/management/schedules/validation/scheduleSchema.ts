import { z } from 'zod'
import { fromDatetimeLocalValue } from '../utils/currency'
import {
  PASSENGER_TYPES,
  SCHEDULE_STATUS_VALUES,
  type PassengerType,
  type TourScheduleRequestPayload,
  type TourScheduleResponse,
} from '../types/schedule'

export const scheduleStatusEnum = z.enum(SCHEDULE_STATUS_VALUES)
export const passengerTypeEnum = z.enum(PASSENGER_TYPES)

const passengerPriceSchema = z.object({
  passengerType: passengerTypeEnum,
  price: z
    .number({ message: 'tours.schedules.validation.priceRequired' })
    .min(0, 'tours.schedules.validation.priceMin'),
})

/**
 * Validation chính cho `ScheduleForm`.
 * Cross-field rule: `returnAt` phải sau `departureAt` (kiểm bằng `.refine`).
 */
export const scheduleRequestSchema = z
  .object({
    scheduleCode: z.string().max(50).optional(),
    departureAt: z
      .string()
      .min(1, 'tours.schedules.validation.departureRequired'),
    returnAt: z
      .string()
      .min(1, 'tours.schedules.validation.returnRequired'),
    bookingOpenAt: z.string().optional(),
    bookingCloseAt: z.string().optional(),
    meetingAt: z.string().optional(),
    meetingPointName: z.string().max(255).optional(),
    meetingAddress: z.string().max(500).optional(),
    meetingLatitude: z.number().optional(),
    meetingLongitude: z.number().optional(),
    capacityTotal: z
      .number({ message: 'tours.schedules.validation.capacityRequired' })
      .int('tours.schedules.validation.capacityRequired')
      .min(1, 'tours.schedules.validation.capacityMin'),
    minGuestsToOperate: z.number().int().min(1).optional(),
    singleRoomSurcharge: z.number().min(0).optional(),
    transportDetail: z.string().max(500).optional(),
    note: z.string().max(2000).optional(),
    status: scheduleStatusEnum,
    passengerPrices: z
      .array(passengerPriceSchema)
      .min(1, 'tours.schedules.validation.passengerPricesRequired'),
  })
  .refine(
    (data) =>
      !data.departureAt ||
      !data.returnAt ||
      new Date(data.returnAt) > new Date(data.departureAt),
    {
      message: 'tours.schedules.validation.returnAfterDeparture',
      path: ['returnAt'],
    },
  )
  .refine(
    (data) => {
      const adult = data.passengerPrices.find((p) => p.passengerType === 'adult')
      return Boolean(adult)
    },
    {
      message: 'tours.schedules.validation.adultPriceRequired',
      path: ['passengerPrices'],
    },
  )

export type ScheduleRequestForm = z.input<typeof scheduleRequestSchema>

/**
 * Form mặc định khi tạo mới: 4 dòng giá rỗng cho cả 4 loại khách.
 */
export const EMPTY_SCHEDULE_FORM: ScheduleRequestForm = {
  scheduleCode: '',
  departureAt: '',
  returnAt: '',
  bookingOpenAt: '',
  bookingCloseAt: '',
  meetingAt: '',
  meetingPointName: '',
  meetingAddress: '',
  meetingLatitude: undefined,
  meetingLongitude: undefined,
  capacityTotal: 1,
  minGuestsToOperate: 1,
  singleRoomSurcharge: 0,
  transportDetail: '',
  note: '',
  status: 'draft',
  passengerPrices: PASSENGER_TYPES.map((type) => ({
    passengerType: type,
    price: 0,
  })),
}

/* -------------------------------------------------------------------------- */
/*                                 Adapters                                   */
/* -------------------------------------------------------------------------- */

function emptyToUndefined(value: string | undefined): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  return trimmed.length === 0 ? undefined : trimmed
}

/**
 * Chuyển form sang payload gửi BE: array `passengerPrices` ⇒ flat fields
 * `adultPrice/childPrice/infantPrice/seniorPrice`. Đảm bảo `adultPrice` luôn
 * tồn tại (đã được schema `.refine()` validate).
 */
export function toSchedulePayload(
  form: ScheduleRequestForm,
): TourScheduleRequestPayload {
  const priceByType: Record<PassengerType, number> = {
    adult: 0,
    child: 0,
    infant: 0,
    senior: 0,
  }
  for (const entry of form.passengerPrices) {
    priceByType[entry.passengerType] = entry.price
  }

  const payload: TourScheduleRequestPayload = {
    scheduleCode: emptyToUndefined(form.scheduleCode),
    departureAt: fromDatetimeLocalValue(form.departureAt),
    returnAt: fromDatetimeLocalValue(form.returnAt),
    bookingOpenAt: form.bookingOpenAt
      ? fromDatetimeLocalValue(form.bookingOpenAt)
      : undefined,
    bookingCloseAt: form.bookingCloseAt
      ? fromDatetimeLocalValue(form.bookingCloseAt)
      : undefined,
    meetingAt: form.meetingAt
      ? fromDatetimeLocalValue(form.meetingAt)
      : undefined,
    meetingPointName: emptyToUndefined(form.meetingPointName),
    meetingAddress: emptyToUndefined(form.meetingAddress),
    meetingLatitude: form.meetingLatitude,
    meetingLongitude: form.meetingLongitude,
    capacityTotal: form.capacityTotal,
    minGuestsToOperate: form.minGuestsToOperate,
    adultPrice: priceByType.adult,
    childPrice: priceByType.child,
    infantPrice: priceByType.infant,
    seniorPrice: priceByType.senior,
    singleRoomSurcharge: form.singleRoomSurcharge,
    transportDetail: emptyToUndefined(form.transportDetail),
    note: emptyToUndefined(form.note),
    status: form.status,
  }

  return payload
}

/**
 * Map response BE → defaults cho form (mở edit). Đảm bảo `passengerPrices`
 * luôn có đủ 4 dòng để useFieldArray render mượt.
 */
export function scheduleResponseToFormDefaults(
  schedule: TourScheduleResponse,
): ScheduleRequestForm {
  const flat = {
    adult: schedule.adultPrice ?? 0,
    child: schedule.childPrice ?? 0,
    infant: schedule.infantPrice ?? 0,
    senior: schedule.seniorPrice ?? 0,
  }

  return {
    scheduleCode: schedule.scheduleCode ?? '',
    departureAt: schedule.departureAt
      ? toDatetimeLocalSafe(schedule.departureAt)
      : '',
    returnAt: schedule.returnAt ? toDatetimeLocalSafe(schedule.returnAt) : '',
    bookingOpenAt: schedule.bookingOpenAt
      ? toDatetimeLocalSafe(schedule.bookingOpenAt)
      : '',
    bookingCloseAt: schedule.bookingCloseAt
      ? toDatetimeLocalSafe(schedule.bookingCloseAt)
      : '',
    meetingAt: schedule.meetingAt
      ? toDatetimeLocalSafe(schedule.meetingAt)
      : '',
    meetingPointName: schedule.meetingPointName ?? '',
    meetingAddress: schedule.meetingAddress ?? '',
    meetingLatitude: schedule.meetingLatitude ?? undefined,
    meetingLongitude: schedule.meetingLongitude ?? undefined,
    capacityTotal: schedule.capacityTotal ?? 1,
    minGuestsToOperate: schedule.minGuestsToOperate ?? 1,
    singleRoomSurcharge: schedule.singleRoomSurcharge ?? 0,
    transportDetail: schedule.transportDetail ?? '',
    note: schedule.note ?? '',
    status:
      typeof schedule.status === 'string' &&
      (SCHEDULE_STATUS_VALUES as readonly string[]).includes(schedule.status)
        ? (schedule.status as ScheduleRequestForm['status'])
        : 'draft',
    passengerPrices: PASSENGER_TYPES.map((type) => ({
      passengerType: type,
      price: flat[type],
    })),
  }
}

function toDatetimeLocalSafe(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}
