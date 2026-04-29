import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../types/api'
import type { AuthResponse } from '../module/auth/database/interface/users'
import {
  clearStoredAuthSession,
  getStoredAccessToken,
  getStoredRefreshToken,
  persistAuthSessionData,
} from './authSessionStorage'

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

export const axiosBackend = axios.create({
  baseURL: `${API_BASE_URL}/`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosBackend.interceptors.request.use((config) => {
  const token = getStoredAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken()

  if (!refreshToken) {
    throw new Error('Missing refresh token')
  }

  const response = await axios.post<ApiResponse<AuthResponse>>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    },
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Could not refresh token')
  }

  persistAuthSessionData(response.data.data)
  window.dispatchEvent(new Event('travelviet:token-refresh'))
  return response.data.data
}

axiosBackend.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined
    const requestUrl = originalRequest?.url ?? ''

    if (!originalRequest || originalRequest._retry || requestUrl.includes('auth/refresh')) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const refreshed = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`
      return axiosBackend(originalRequest)
    } catch (refreshError) {
      clearStoredAuthSession()
      window.dispatchEvent(new Event('travelviet:logout'))
      return Promise.reject(refreshError)
    }
  },
)
