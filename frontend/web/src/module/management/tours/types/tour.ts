/**
 * Map 1-1 với `TourResponse.java` (backend).
 * Lưu ý: BE trả `BigDecimal` → JSON là `number`. Các trường list lồng nhau
 * (media/itinerary/checklist…) được giữ dạng `unknown[]` ở phase scaffold để
 * tránh phụ thuộc DTO con — sẽ refine khi vào CRUD chi tiết.
 */
export type TourStatus = 'draft' | 'active' | 'inactive' | 'archived'

export type TourTagSummary = {
  id: number
  code: string | null
  name: string | null
  tagGroup: string | null
  description: string | null
}

export type TourMediaSummary = {
  id: number
  mediaType: string | null
  mediaUrl: string | null
  altText: string | null
  sortOrder: number | null
  isActive: boolean | null
}

export type TourResponse = {
  id: number
  code: string | null
  name: string | null
  slug: string | null
  destinationId: number | null
  destinationCountryCode: string | null
  destinationName: string | null
  destinationProvince: string | null
  cancellationPolicyId: number | null
  basePrice: number | null
  currency: string | null
  durationDays: number | null
  durationNights: number | null
  shortDescription: string | null
  description: string | null
  transportType: string | null
  tripMode: string | null
  highlights: string | null
  inclusions: string | null
  exclusions: string | null
  notes: string | null
  isFeatured: boolean | null
  status: TourStatus | string | null
  averageRating: number | null
  totalReviews: number | null
  totalBookings: number | null
  tags: TourTagSummary[] | null
  media: TourMediaSummary[] | null
  /** Mảng object lồng — để `unknown[]` cho phase scaffold. */
  seasonality: unknown[] | null
  itineraryDays: unknown[] | null
  checklistItems: unknown[] | null
  cancellationPolicy: unknown | null
  translationKey: string | null
  itinerarySummary: string | null
}

/**
 * Subset `TourSearchRequest.java` đủ phục vụ list backoffice phase scaffold.
 * Các trường nâng cao (tagIds, friendlyOnly, difficultyLevel…) sẽ thêm khi cần.
 */
export type TourSortBy =
  | 'name'
  | 'basePrice'
  | 'durationDays'
  | 'averageRating'
  | 'totalBookings'
  | 'isFeatured'
  | 'createdAt'

export type TourSortDir = 'asc' | 'desc'

export type TourSearchParams = {
  page?: number
  size?: number
  keyword?: string
  destinationId?: number
  destinationCountryCode?: string
  domesticOnly?: boolean
  status?: TourStatus
  featuredOnly?: boolean
  minPrice?: number
  maxPrice?: number
  sortBy?: TourSortBy
  sortDir?: TourSortDir
}

export const DEFAULT_TOUR_SEARCH_PARAMS: TourSearchParams = {
  page: 0,
  size: 20,
  sortBy: 'createdAt',
  sortDir: 'desc',
}
