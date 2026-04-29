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

export type ApiRequestOptions = {
  allowEmpty?: boolean
}

export function unwrapApiResponse<T>(
  payload: ApiResponse<T>,
  fallbackMessage = 'Request failed.',
  options: ApiRequestOptions = {},
) {
  if (!payload.success || (!options.allowEmpty && payload.data === undefined)) {
    throw new Error(payload.message || fallbackMessage)
  }

  return payload.data as T
}
