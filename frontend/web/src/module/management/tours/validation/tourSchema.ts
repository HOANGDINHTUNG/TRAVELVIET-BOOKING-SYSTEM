import { z } from 'zod'
import type { TourResponse } from '../types/tour'

/**
 * Map 1-1 với `TourRequest.java` (backend validation):
 * - `code`/`name`/`slug` bắt buộc, độ dài có giới hạn.
 * - `destinationId`, `basePrice ≥ 0`, `durationDays ≥ 1` bắt buộc.
 * - `currency` nếu có phải đúng 3 ký tự (mã ISO 4217).
 * - `status` ràng buộc theo enum `TourStatus` của BE: draft|active|inactive|archived.
 *
 * Lưu ý Zod v4 + react-hook-form: tránh `.transform()` ở root schema vì sẽ làm
 * input ≠ output type ⇒ resolver không khớp. Tất cả normalize (trim, drop empty)
 * được dồn vào `normalizeTourSubmit` ở `TourForm.tsx`.
 *
 * Các trường lồng (`tagIds`, `media`, `seasonality`, `itineraryDays`,
 * `checklistItems`) sẽ thêm khi vào Phase 5 (UI nâng cao).
 */
export const TOUR_STATUS_VALUES = [
  'draft',
  'active',
  'inactive',
  'archived',
] as const

export const tourStatusEnum = z.enum(TOUR_STATUS_VALUES)
export type TourStatusValue = z.infer<typeof tourStatusEnum>

/** Chuỗi optional dạng "string hoặc rỗng": áp max khi có nội dung. */
function optionalString(max: number, messageKey: string) {
  return z
    .string()
    .refine((s) => s.trim().length === 0 || s.trim().length <= max, messageKey)
}

export const tourRequestSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'tours.validation.codeRequired')
    .max(30, 'tours.validation.codeTooLong'),

  name: z
    .string()
    .trim()
    .min(1, 'tours.validation.nameRequired')
    .max(255, 'tours.validation.nameTooLong'),

  slug: z
    .string()
    .trim()
    .min(1, 'tours.validation.slugRequired')
    .max(280, 'tours.validation.slugTooLong')
    .regex(/^[a-z0-9-]+$/i, 'tours.validation.slugFormat'),

  destinationId: z
    .number({ message: 'tours.validation.destinationRequired' })
    .int('tours.validation.destinationRequired')
    .positive('tours.validation.destinationRequired'),

  cancellationPolicyId: z.number().int().positive().optional(),

  basePrice: z
    .number({ message: 'tours.validation.basePriceRequired' })
    .min(0, 'tours.validation.basePriceMin'),

  listPrice: z
    .number()
    .min(0, 'tours.validation.listPriceMin')
    .optional(),

  esgScore: z
    .number()
    .int('tours.validation.esgScoreRange')
    .min(0, 'tours.validation.esgScoreRange')
    .max(100, 'tours.validation.esgScoreRange')
    .optional(),

  leiScore: z
    .number()
    .int('tours.validation.leiScoreRange')
    .min(0, 'tours.validation.leiScoreRange')
    .max(100, 'tours.validation.leiScoreRange')
    .optional(),

  /**
   * Cho phép chuỗi rỗng (user xoá hết); nếu có nội dung thì phải đúng 3 ký tự.
   * Không transform để giữ input/output đều là `string`.
   */
  currency: z
    .string()
    .refine((s) => {
      const trimmed = s.trim()
      return trimmed.length === 0 || trimmed.length === 3
    }, 'tours.validation.currencyFormat'),

  durationDays: z
    .number({ message: 'tours.validation.durationDaysRequired' })
    .int('tours.validation.durationDaysRequired')
    .min(1, 'tours.validation.durationDaysMin'),

  durationNights: z
    .number()
    .int()
    .min(0, 'tours.validation.durationNightsMin')
    .optional(),

  transportType: optionalString(120, 'tours.validation.transportTypeTooLong'),
  tripMode: optionalString(50, 'tours.validation.tripModeTooLong'),
  shortDescription: optionalString(
    500,
    'tours.validation.shortDescriptionTooLong',
  ),
  description: optionalString(10_000, 'tours.validation.descriptionTooLong'),
  highlights: optionalString(5_000, 'tours.validation.highlightsTooLong'),
  inclusions: optionalString(5_000, 'tours.validation.inclusionsTooLong'),
  exclusions: optionalString(5_000, 'tours.validation.exclusionsTooLong'),
  notes: optionalString(5_000, 'tours.validation.notesTooLong'),

  isFeatured: z.boolean().optional(),
  status: tourStatusEnum.optional(),

  /* ----------------- Phase 5: nested arrays ----------------- */

  /**
   * Mảng tag IDs đã chọn. Khớp `TourRequest.tagIds: List<Long>`.
   * Không dùng `.default()` để giữ input/output type đồng nhất cho RHF resolver.
   */
  tagIds: z.array(z.number().int().positive()),

  /** Media list. Khớp `TourRequest.media: List<TourMediaRequest>`. */
  media: z.array(
    z.object({
      mediaType: z
        .string()
        .min(1, 'tours.validation.mediaTypeRequired')
        .max(20, 'tours.validation.mediaTypeTooLong'),
      mediaUrl: z.string().min(1, 'tours.validation.mediaUrlRequired'),
      altText: z.string().max(255).optional(),
      sortOrder: z.number().int().min(0),
      isActive: z.boolean(),
    }),
  ),

  /** Lịch trình theo ngày. Khớp `TourRequest.itineraryDays: List<TourItineraryDayRequest>`. */
  itineraryDays: z.array(
    z.object({
      dayNumber: z
        .number({ message: 'tours.validation.dayNumberRequired' })
        .int('tours.validation.dayNumberRequired')
        .min(1, 'tours.validation.dayNumberMin'),
      title: z
        .string()
        .min(1, 'tours.validation.dayTitleRequired')
        .max(255, 'tours.validation.dayTitleTooLong'),
      description: z.string().max(10_000),
      overnightDestinationId: z.number().int().positive().optional(),
    }),
  ),
})

export type TourRequestForm = z.infer<typeof tourRequestSchema>
export type TourMediaForm = TourRequestForm['media'][number]
export type TourItineraryDayForm = TourRequestForm['itineraryDays'][number]

/**
 * Default rỗng cho form *create*. Khai báo đầy đủ key (kể cả `''`/`undefined`)
 * để khớp shape `z.infer` của Zod v4 (key không có modifier `?:`).
 */
export const EMPTY_TOUR_FORM: TourRequestForm = {
  code: '',
  name: '',
  slug: '',
  destinationId: 0,
  basePrice: 0,
  listPrice: undefined,
  esgScore: undefined,
  leiScore: undefined,
  durationDays: 1,
  durationNights: 0,
  status: 'draft',
  isFeatured: false,
  currency: 'VND',
  cancellationPolicyId: undefined,
  transportType: '',
  tripMode: '',
  shortDescription: '',
  description: '',
  highlights: '',
  inclusions: '',
  exclusions: '',
  notes: '',
  tagIds: [],
  media: [],
  itineraryDays: [],
}

/**
 * Map `TourResponse` → defaults cho form *update*. Trường nullable map sang
 * chuỗi rỗng (cho text) hoặc `undefined` (cho number) để khớp schema.
 */
export function tourResponseToFormDefaults(tour: TourResponse): TourRequestForm {
  return {
    code: tour.code ?? '',
    name: tour.name ?? '',
    slug: tour.slug ?? '',
    destinationId: tour.destinationId ?? 0,
    cancellationPolicyId: tour.cancellationPolicyId ?? undefined,
    basePrice: tour.basePrice ?? 0,
    listPrice: tour.listPrice ?? undefined,
    esgScore: tour.esgScore ?? undefined,
    leiScore: tour.leiScore ?? undefined,
    currency: tour.currency ?? 'VND',
    durationDays: tour.durationDays ?? 1,
    durationNights: tour.durationNights ?? 0,
    transportType: tour.transportType ?? '',
    tripMode: tour.tripMode ?? '',
    shortDescription: tour.shortDescription ?? '',
    description: tour.description ?? '',
    highlights: tour.highlights ?? '',
    inclusions: tour.inclusions ?? '',
    exclusions: tour.exclusions ?? '',
    notes: tour.notes ?? '',
    isFeatured: tour.isFeatured ?? false,
    status: isTourStatus(tour.status) ? tour.status : 'draft',
    tagIds: (tour.tags ?? [])
      .map((tag) => tag.id)
      .filter((id): id is number => typeof id === 'number'),
    media: (tour.media ?? [])
      .filter((m) => m.mediaUrl != null)
      .map((m, index) => ({
        mediaType: m.mediaType ?? 'image',
        mediaUrl: m.mediaUrl as string,
        altText: m.altText ?? undefined,
        sortOrder: m.sortOrder ?? index,
        isActive: m.isActive ?? true,
      })),
    itineraryDays: [],
  }
}

export function isTourStatus(value: unknown): value is TourStatusValue {
  return (
    typeof value === 'string' &&
    (TOUR_STATUS_VALUES as readonly string[]).includes(value)
  )
}
