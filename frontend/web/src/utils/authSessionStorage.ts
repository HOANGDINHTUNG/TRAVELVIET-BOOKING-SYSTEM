import type { AuthResponse, AuthUser } from '../module/auth/database/interface/users'

export const AUTH_TOKEN_KEY = 'travelviet-auth-token'
export const REFRESH_TOKEN_KEY = 'travelviet-refresh-token'
export const USER_KEY = 'travelviet-user'
export const LEGACY_AUTH_TOKEN_KEY = 'auth-token'
export const LEGACY_TOKEN_KEY = 'token'

export const AUTH_STORAGE_KEYS = [
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  LEGACY_AUTH_TOKEN_KEY,
  LEGACY_TOKEN_KEY,
] as const

function readStorageValue(key: string) {
  return window.sessionStorage.getItem(key) || window.localStorage.getItem(key)
}

export function getStoredAccessToken() {
  return (
    readStorageValue(AUTH_TOKEN_KEY) ||
    readStorageValue(LEGACY_AUTH_TOKEN_KEY) ||
    readStorageValue(LEGACY_TOKEN_KEY)
  )
}

export function getStoredRefreshToken() {
  return readStorageValue(REFRESH_TOKEN_KEY)
}

export function getStoredAuthUser(): AuthUser | null {
  try {
    const rawUser = readStorageValue(USER_KEY)
    if (!rawUser) {
      return null
    }

    return JSON.parse(rawUser) as AuthUser
  } catch {
    window.sessionStorage.removeItem(USER_KEY)
    window.localStorage.removeItem(USER_KEY)
    return null
  }
}

export function persistAuthSessionData(auth: AuthResponse) {
  window.sessionStorage.setItem(AUTH_TOKEN_KEY, auth.accessToken)
  window.sessionStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken)
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(auth.user))
  window.sessionStorage.setItem(LEGACY_AUTH_TOKEN_KEY, auth.accessToken)
  window.sessionStorage.setItem(LEGACY_TOKEN_KEY, auth.accessToken)
}

export function persistStoredAuthUser(user: AuthUser) {
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearStoredAuthSession() {
  AUTH_STORAGE_KEYS.forEach((key) => {
    window.sessionStorage.removeItem(key)
    window.localStorage.removeItem(key)
  })
}

export function clearPersistentAuthSessionData() {
  AUTH_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key))
}
