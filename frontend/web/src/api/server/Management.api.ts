import { isAxiosError } from 'axios'
import { axiosBackend } from '../../utils/axiosInstance'
import type { ApiResponse } from '../../types/api'
import { unwrapApiResponse } from '../../types/api'
import { getStoredAccessToken } from '../../module/auth/api/authApi'

type ApiCheckResult<T> =
  | {
      ok: true
      status: number
      message: string
      data: T
    }
  | {
      ok: false
      status: number
      message: string
    }

function normalizePath(path: string) {
  return path.replace(/^\/+/, '')
}

function getAxiosErrorMessage(error: unknown) {
  if (!isAxiosError<ApiResponse<unknown>>(error)) {
    return 'Request failed.'
  }

  return error.response?.data?.message || error.message || 'Request failed.'
}

export async function runManagementApiCheck<T>(
  path: string,
): Promise<ApiCheckResult<T>> {
  if (!getStoredAccessToken()) {
    return {
      ok: false,
      status: 401,
      message: 'Missing access token',
    }
  }

  try {
    const response = await axiosBackend.get<ApiResponse<T>>(normalizePath(path))
    const data = unwrapApiResponse(response.data, `Request failed for ${path}`)

    return {
      ok: true,
      status: response.status,
      message: response.data.message || 'OK',
      data,
    }
  } catch (error) {
    return {
      ok: false,
      status: isAxiosError(error) ? (error.response?.status ?? 0) : 0,
      message: getAxiosErrorMessage(error),
    }
  }
}
