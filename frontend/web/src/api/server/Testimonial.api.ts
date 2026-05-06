import { getBackendData } from './serverApiClient'

export type CustomerTestimonial = {
  id: number
  customerName?: string
  customerTitle?: string
  content?: string
  rating?: number
  avatarUrl?: string
  isVerified?: boolean
  sortOrder?: number
}

export const testimonialApi = {
  getPublicTestimonials() {
    return getBackendData<CustomerTestimonial[]>('testimonials/public')
  },
}
