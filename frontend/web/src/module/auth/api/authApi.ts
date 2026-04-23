type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
}

export type AuthUser = {
  id: string
  fullName?: string
  displayName?: string
  email?: string
  phone?: string
  status?: string
  roles?: string[]
}

export type AuthResponse = {
  user: AuthUser
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
  refreshExpiresIn: number
}

type LoginPayload = {
  login: string
  passwordHash: string
}

type RegisterPayload = {
  fullName: string
  email: string
  passwordHash: string
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:8088/api/v1'

async function requestAuth<T>(path: string, body: LoginPayload | RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok || !payload?.success || !payload.data) {
    throw new Error(payload?.message || 'Không thể xử lý yêu cầu xác thực.')
  }

  return payload.data
}

export function loginWithPassword(payload: LoginPayload) {
  return requestAuth<AuthResponse>('/auth/login', payload)
}

export function registerWithPassword(payload: RegisterPayload) {
  return requestAuth<AuthResponse>('/auth/register', payload)
}

export function persistAuthSession(auth: AuthResponse) {
  window.localStorage.setItem('travelviet-auth-token', auth.accessToken)
  window.localStorage.setItem('travelviet-refresh-token', auth.refreshToken)
  window.localStorage.setItem('travelviet-user', JSON.stringify(auth.user))
  window.localStorage.setItem('auth-token', auth.accessToken)
  window.localStorage.setItem('token', auth.accessToken)
  window.dispatchEvent(new Event('travelviet:login'))
}
