import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios'
import {
  type ApiResponse,
  ApiClientError,
  isApiSuccessEnvelope,
  unwrapApiResponse,
} from '../types/api'
import type { AuthResponse } from '../module/auth/database/interface/users'
import {
  AUTH_TOKEN_KEY,
  LEGACY_AUTH_TOKEN_KEY,
  LEGACY_TOKEN_KEY,
  clearStoredAuthSession,
  getStoredAccessToken,
  getStoredRefreshToken,
  persistAuthSessionData,
} from '../utils/authSessionStorage'
import {
  DEFAULT_LANGUAGE,
  PREFERENCES_STORAGE_KEY,
  LANGUAGE_MODES,
  type LanguageMode,
} from '../constants/preferences'

const rawBaseUrl = String(
  import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_API_BASE_URL ??
    'http://localhost:8088/api/v1',
)

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '')

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let refreshPromise: Promise<AuthResponse> | null = null

function readAccessTokenPreferLocalStorage(): string | null {
  if (typeof window === 'undefined') return null
  const fromLocal =
    window.localStorage.getItem(AUTH_TOKEN_KEY) ||
    window.localStorage.getItem(LEGACY_AUTH_TOKEN_KEY) ||
    window.localStorage.getItem(LEGACY_TOKEN_KEY)
  if (fromLocal) return fromLocal
  return (
    window.sessionStorage.getItem(AUTH_TOKEN_KEY) ||
    window.sessionStorage.getItem(LEGACY_AUTH_TOKEN_KEY) ||
    window.sessionStorage.getItem(LEGACY_TOKEN_KEY)
  )
}

function isLanguageMode(value: unknown): value is LanguageMode {
  return LANGUAGE_MODES.includes(value as LanguageMode)
}

/**
 * Đọc ngôn ngữ UI đã lưu (cùng format với `preferencesSlice`) để gửi `Accept-Language: vi|en`.
 */
export function getAcceptLanguageHeaderValue(): string {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (!raw) return DEFAULT_LANGUAGE
    const parsed = JSON.parse(raw) as { language?: unknown }
    return isLanguageMode(parsed.language) ? parsed.language : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/`,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = readAccessTokenPreferLocalStorage()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['Accept-Language'] = getAcceptLanguageHeaderValue()
  return config
})

async function refreshAccessToken(): Promise<AuthResponse> {
  const refreshToken = getStoredRefreshToken()
  if (!refreshToken) {
    const hadAccessToken = Boolean(getStoredAccessToken())
    throw new ApiClientError({
      message: '',
      errorCode: hadAccessToken
        ? 'SESSION_EXPIRED_NO_REFRESH'
        : 'NOT_AUTHENTICATED',
      httpStatus: 401,
    })
  }

  const response = await axios.post<ApiResponse<AuthResponse>>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15_000,
    },
  )

  let auth: AuthResponse
  try {
    auth = unwrapApiResponse(response.data, '')
  } catch (e) {
    if (e instanceof ApiClientError) {
      throw e
    }
    throw new ApiClientError({
      message: '',
      errorCode: 'REFRESH_REJECTED',
      httpStatus: response.status >= 400 ? response.status : 401,
    })
  }
  persistAuthSessionData(auth)
  window.dispatchEvent(new Event('travelviet:token-refresh'))
  return auth
}

function unwrapSuccessResponseData<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  const { data, config, status } = response
  if (config.skipApiEnvelope) return response
  if (status === 204 || data === null || data === undefined || data === '') {
    return response
  }
  if (!isApiSuccessEnvelope(data)) {
    return response
  }
  const envelope = data
  if (envelope.success !== true) {
    throw ApiClientError.fromFailedSuccessEnvelope(envelope, status)
  }
  return {
    ...response,
    data: envelope.data as T,
  }
}

apiClient.interceptors.response.use(
  (response) => unwrapSuccessResponseData(response),
  async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 401) {
      if (isAxiosError(error)) {
        return Promise.reject(ApiClientError.fromAxiosError(error))
      }
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined
    const requestUrl = originalRequest?.url ?? ''

    if (
      !originalRequest ||
      originalRequest._retry ||
      requestUrl.includes('auth/refresh')
    ) {
      return Promise.reject(ApiClientError.fromAxiosError(error))
    }

    originalRequest._retry = true

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const refreshed = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`
      const retryResponse = await apiClient(originalRequest)
      return unwrapSuccessResponseData(retryResponse)
    } catch (refreshError: unknown) {
      clearStoredAuthSession()
      window.dispatchEvent(new Event('travelviet:logout'))
      if (isAxiosError(refreshError)) {
        return Promise.reject(ApiClientError.fromAxiosError(refreshError))
      }
      if (refreshError instanceof ApiClientError) {
        return Promise.reject(refreshError)
      }
      return Promise.reject(
        new ApiClientError({
          message: '',
          errorCode: 'REFRESH_FAILED',
          httpStatus: 401,
        }),
      )
    }
  },
)
