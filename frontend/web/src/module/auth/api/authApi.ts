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
  role?: string
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

const AUTH_TOKEN_KEY = 'travelviet-auth-token'
const REFRESH_TOKEN_KEY = 'travelviet-refresh-token'
const USER_KEY = 'travelviet-user'
const LEGACY_AUTH_TOKEN_KEY = 'auth-token'
const LEGACY_TOKEN_KEY = 'token'
const AUTH_STORAGE_KEYS = [
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  LEGACY_AUTH_TOKEN_KEY,
  LEGACY_TOKEN_KEY,
] as const

export type ManagerRoleCode =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'CONTENT_EDITOR'
  | 'FIELD_STAFF'
  | 'OPERATOR'

export const MANAGER_ROLE_CODES: ManagerRoleCode[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'CONTENT_EDITOR',
  'FIELD_STAFF',
  'OPERATOR',
]

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
  clearPersistentAuthSession()
  window.sessionStorage.setItem(AUTH_TOKEN_KEY, auth.accessToken)
  window.sessionStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken)
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(auth.user))
  window.sessionStorage.setItem(LEGACY_AUTH_TOKEN_KEY, auth.accessToken)
  window.sessionStorage.setItem(LEGACY_TOKEN_KEY, auth.accessToken)
  window.dispatchEvent(new Event('travelviet:login'))
}

export function clearAuthSession() {
  AUTH_STORAGE_KEYS.forEach((key) => {
    window.sessionStorage.removeItem(key)
    window.localStorage.removeItem(key)
  })
  window.sessionStorage.removeItem('travelviet-login-welcome-seen')
  window.dispatchEvent(new Event('travelviet:logout'))
}

export function getStoredAccessToken() {
  return (
    window.sessionStorage.getItem(AUTH_TOKEN_KEY) ||
    window.sessionStorage.getItem(LEGACY_AUTH_TOKEN_KEY) ||
    window.sessionStorage.getItem(LEGACY_TOKEN_KEY)
  )
}

export function getStoredAuthUser(): AuthUser | null {
  try {
    const rawUser = window.sessionStorage.getItem(USER_KEY)
    if (!rawUser) {
      return null
    }

    return JSON.parse(rawUser) as AuthUser
  } catch {
    window.sessionStorage.removeItem(USER_KEY)
    return null
  }
}

export function hasStoredAuthSession() {
  return Boolean(getStoredAccessToken() || window.sessionStorage.getItem(USER_KEY))
}

export function clearPersistentAuthSession() {
  AUTH_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key))
}

export function getAuthUserRoleCodes(user: AuthUser | null) {
  if (!user) {
    return []
  }

  const roleCandidates = [...(user.roles ?? []), user.role ?? '']
    .map((role) => role.trim().toUpperCase())
    .filter(Boolean)

  return [...new Set(roleCandidates)]
}

export function isManagerRoleCode(role: string): role is ManagerRoleCode {
  return MANAGER_ROLE_CODES.includes(role as ManagerRoleCode)
}

export function hasManagerRole(user: AuthUser | null) {
  return getAuthUserRoleCodes(user).some(isManagerRoleCode)
}

export function resolvePostAuthRedirect(user: AuthUser | null) {
  return hasManagerRole(user) ? '/management' : '/'
}
