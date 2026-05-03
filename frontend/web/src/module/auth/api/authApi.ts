import { authApi } from '../../../api/server/Auth.api'
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '../database/interface/users'
import {
  clearPersistentAuthSessionData,
  clearStoredAuthSession,
  getStoredAccessToken,
  getStoredAuthUser,
  persistAuthSessionData,
} from '../../../utils/authSessionStorage'

export type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  UserAccessContext,
} from '../database/interface/users'

export {
  getStoredAccessToken,
  getStoredAuthUser,
  getStoredRefreshToken,
  persistStoredAuthUser,
} from '../../../utils/authSessionStorage'

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

export function refreshAuthSession(refreshToken: string) {
  return authApi.refresh({ refreshToken })
}

export function persistAuthSession(auth: AuthResponse) {
  clearPersistentAuthSession()
  persistAuthSessionData(auth)
  window.dispatchEvent(new Event('travelviet:login'))
}

export function clearAuthSession() {
  clearStoredAuthSession()
  window.sessionStorage.removeItem('travelviet-login-welcome-seen')
  window.dispatchEvent(new Event('travelviet:logout'))
}

export function hasStoredAuthSession() {
  return Boolean(getStoredAccessToken() || getStoredAuthUser())
}

export function clearPersistentAuthSession() {
  clearPersistentAuthSessionData()
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
  return hasManagerRole(user) ? '/management/dashboard' : '/'
}
