import type { PageResponse } from '../../types/api'
import {
  getBackendData,
  patchBackendData,
  postBackendData,
} from './serverApiClient'

export type ReviewAspectPayload = {
  aspectName: string
  aspectRating: number
  comment?: string
}

export type CreateReviewPayload = {
  bookingId: number
  overallRating: number
  title?: string
  content?: string
  wouldRecommend?: boolean
  aspects?: ReviewAspectPayload[]
}

export type Review = {
  id: number
  bookingId?: number
  userId?: string
  tourId?: number
  scheduleId?: number
  overallRating: number
  title?: string
  content?: string
  sentiment?: string
  wouldRecommend?: boolean
  createdAt?: string
  updatedAt?: string
  aspects?: ReviewAspectPayload[]
  replies?: ReviewReply[]
}

export type ReviewReply = {
  id: number
  staffId?: string
  content: string
  createdAt?: string
}

export type ReviewSearchParams = {
  page?: number
  size?: number
}

export type CreateReviewReplyPayload = {
  content: string
}

export type ModerateReviewPayload = {
  status?: string
  reason?: string
}

export const reviewApi = {
  create(payload: CreateReviewPayload) {
    return postBackendData<Review>('reviews', payload)
  },

  getById(id: number) {
    return getBackendData<Review>(`reviews/${id}`)
  },

  getForTour(tourId: number, params?: ReviewSearchParams) {
    return getBackendData<PageResponse<Review>>(`reviews/tours/${tourId}`, params)
  },

  getMine(params?: ReviewSearchParams) {
    return getBackendData<PageResponse<Review>>('reviews/me', params)
  },

  reply(id: number, payload: CreateReviewReplyPayload) {
    return postBackendData<ReviewReply>(`reviews/${id}/replies`, payload)
  },

  moderate(id: number, payload: ModerateReviewPayload) {
    return patchBackendData<Review>(`reviews/${id}/moderation`, payload)
  },
}
