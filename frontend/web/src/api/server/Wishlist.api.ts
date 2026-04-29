import {
  deleteBackendData,
  getBackendData,
  postBackendData,
} from './serverApiClient'

export type WishlistTour = {
  wishlistId: number
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
  wishedAt?: string
}

export const wishlistApi = {
  getMyTours() {
    return getBackendData<WishlistTour[]>('users/me/wishlist/tours')
  },

  addTour(tourId: number) {
    return postBackendData<WishlistTour>(`users/me/wishlist/tours/${tourId}`)
  },

  removeTour(tourId: number) {
    return deleteBackendData(`users/me/wishlist/tours/${tourId}`)
  },
}
