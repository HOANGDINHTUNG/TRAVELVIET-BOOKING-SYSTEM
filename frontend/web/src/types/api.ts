import type { AxiosError } from 'axios'

/** Envelope thành công — khớp `ApiResponse<T>` backend. */
export type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
}

/** Phân trang — khớp `PageResponse<T>` trong API_DOCUMENTATION.md §2.5 */
export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

/**
 * Body lỗi chuẩn — khớp `ErrorResponse` backend (không bọc trong `data`).
 * @see com.wedservice.backend.common.exception.ErrorResponse
 */
export type BackendErrorResponse = {
  success: false
  message: string
  errorCode: string
  timestamp?: string
  errors?: Record<string, string>
}

export type ApiRequestOptions = {
  allowEmpty?: boolean
}

const API_ERROR_KEY_PATTERN = /^api\.error\.[\w.]+$/

export function isApiErrorMessageKey(message: string): boolean {
  return API_ERROR_KEY_PATTERN.test(message)
}

export class ApiClientError extends Error {
  override readonly name = 'ApiClientError'
  readonly errorCode: string
  readonly httpStatus: number
  readonly fieldErrors: Record<string, string> | undefined
  /** Thông điệp từ backend (thường đã theo Accept-Language). */
  readonly backendMessage: string

  constructor(options: {
    message: string
    errorCode: string
    httpStatus: number
    fieldErrors?: Record<string, string>
  }) {
    super(options.message)
    this.backendMessage = options.message
    this.errorCode = options.errorCode
    this.httpStatus = options.httpStatus
    this.fieldErrors = options.fieldErrors
  }

  static fromBackendErrorBody(
    body: BackendErrorResponse,
    httpStatus: number,
  ): ApiClientError {
    return new ApiClientError({
      message: body.message,
      errorCode: body.errorCode,
      httpStatus,
      fieldErrors: body.errors,
    })
  }

  static fromAxiosError(error: AxiosError<unknown>): ApiClientError {
    const status = error.response?.status ?? 0
    const raw = error.response?.data

    if (isBackendErrorResponse(raw)) {
      return ApiClientError.fromBackendErrorBody(raw, status)
    }

    if (isRecord(raw) && typeof raw.message === 'string') {
      const code =
        typeof raw.errorCode === 'string' ? raw.errorCode : 'HTTP_ERROR'
      return new ApiClientError({
        message: raw.message,
        errorCode: code,
        httpStatus: status,
        fieldErrors: isRecord(raw.errors)
          ? (raw.errors as Record<string, string>)
          : undefined,
      })
    }

    return new ApiClientError({
      message: error.message || 'Request failed.',
      errorCode: status === 0 ? 'NETWORK_ERROR' : 'HTTP_ERROR',
      httpStatus: status,
    })
  }

  static fromFailedSuccessEnvelope(
    payload: ApiResponse<unknown>,
    httpStatus: number,
  ): ApiClientError {
    return new ApiClientError({
      message: payload.message ?? 'Request failed.',
      errorCode: 'API_FAILURE',
      httpStatus,
    })
  }
}

export function unwrapApiResponse<T>(
  payload: ApiResponse<T>,
  fallbackMessage = 'Request failed.',
  options: ApiRequestOptions = {},
): T {
  if (!payload.success) {
    throw ApiClientError.fromFailedSuccessEnvelope(payload, 200)
  }
  if (!options.allowEmpty && payload.data === undefined) {
    throw new ApiClientError({
      message: payload.message ?? fallbackMessage,
      errorCode: 'EMPTY_DATA',
      httpStatus: 200,
    })
  }
  return payload.data as T
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}

export function isBackendErrorResponse(
  value: unknown,
): value is BackendErrorResponse {
  if (!isRecord(value)) return false
  if (value.success !== false) return false
  if (typeof value.message !== 'string') return false
  if (typeof value.errorCode !== 'string') return false
  return true
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** Payload JSON có dạng envelope `ApiResponse` (có `success` và thường có `data`). */
export function isApiSuccessEnvelope(
  value: unknown,
): value is ApiResponse<unknown> {
  if (!isRecord(value)) return false
  if (typeof value.success !== 'boolean') return false
  return 'data' in value
}
