import { authApi } from '../../../api/server/Auth.api'
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '../database/interface/users'

export type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '../database/interface/users'

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

export function loginWithPassword(payload: LoginPayload) {
  return authApi.login(payload)
}

export function registerWithPassword(payload: RegisterPayload) {
  return authApi.register(payload)
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
