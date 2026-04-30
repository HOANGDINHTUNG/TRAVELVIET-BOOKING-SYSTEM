import { getBackendData, postBackendData } from './serverApiClient'

export type GenerateTourRecommendationPayload = {
  requestedTag?: string
  requestedBudget?: 'low' | 'medium' | 'high' | 'luxury' | string
  requestedTripMode?: 'group' | 'private' | 'shared' | string
  requestedPeopleCount?: number
  requestedDepartureAt?: string
  size?: number
}

export type RecommendedTour = {
  tourId: number
  tourCode?: string
  tourName?: string
  tourSlug?: string
  destinationId?: number
  basePrice?: number | string
  currency?: string
  durationDays?: number
  durationNights?: number
  shortDescription?: string
  isFeatured?: boolean
  averageRating?: number | string
  totalReviews?: number
  totalBookings?: number
  recommendationScore?: number | string
  scoringReasons?: string[]
}

export type RecommendationLog = {
  logId: number
  requestedTag?: string
  requestedBudget?: string
  requestedTripMode?: string
  requestedPeopleCount?: number
  requestedDepartureAt?: string
  recommendations?: RecommendedTour[]
  createdAt?: string
}

export const recommendationApi = {
  generateTours(payload: GenerateTourRecommendationPayload) {
    return postBackendData<RecommendationLog>('users/me/recommendations/tours', payload)
  },

  getLogs() {
    return getBackendData<RecommendationLog[]>('users/me/recommendations/logs')
  },
}
