import { getStoredAccessToken } from '../../auth/api/authApi'

type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
}

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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:8088/api/v1'

export async function runManagementApiCheck<T>(
  path: string,
): Promise<ApiCheckResult<T>> {
  const token = getStoredAccessToken()

  if (!token) {
    return {
      ok: false,
      status: 401,
      message: 'Missing access token',
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null
  if (!response.ok || !payload?.success || payload.data === undefined) {
    return {
      ok: false,
      status: response.status,
      message: payload?.message || `Request failed for ${path}`,
    }
  }

  return {
    ok: true,
    status: response.status,
    message: payload.message || 'OK',
    data: payload.data,
  }
}
