export type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
}

export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export function unwrapApiResponse<T>(
  payload: ApiResponse<T>,
  fallbackMessage = 'Request failed.',
) {
  if (!payload.success || payload.data === undefined) {
    throw new Error(payload.message || fallbackMessage)
  }

  return payload.data
}
