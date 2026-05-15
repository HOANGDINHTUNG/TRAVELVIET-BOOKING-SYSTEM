import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { UserMeResponse } from '../types/user'
import {
  AUTH_TOKEN_KEY,
  LEGACY_AUTH_TOKEN_KEY,
  LEGACY_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  clearStoredAuthSession,
  getStoredAuthUser,
} from '../utils/authSessionStorage'

const MANAGER_ROLE_CODES = [
  'SUPER_ADMIN',
  'ADMIN',
  'CONTENT_EDITOR',
  'FIELD_STAFF',
  'OPERATOR',
] as const

export type ManagerRoleCode = (typeof MANAGER_ROLE_CODES)[number]

export type SetAuthOptions = {
  refreshToken?: string
  permissions?: string[]
}

export type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: UserMeResponse | null
  permissions: string[]
  isAuthenticated: boolean
  setAuth: (
    token: string,
    user: UserMeResponse,
    options?: SetAuthOptions,
  ) => void
  setPermissions: (permissions: string[]) => void
  setUser: (user: UserMeResponse) => void
  clearAuth: () => void
  hydrateFromStorage: () => void
}

function readToken(): string | null {
  if (typeof window === 'undefined') return null
  return (
    window.sessionStorage.getItem(AUTH_TOKEN_KEY) ||
    window.localStorage.getItem(AUTH_TOKEN_KEY) ||
    window.sessionStorage.getItem(LEGACY_AUTH_TOKEN_KEY) ||
    window.localStorage.getItem(LEGACY_AUTH_TOKEN_KEY) ||
    window.sessionStorage.getItem(LEGACY_TOKEN_KEY) ||
    window.localStorage.getItem(LEGACY_TOKEN_KEY)
  )
}

function readRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return (
    window.sessionStorage.getItem(REFRESH_TOKEN_KEY) ||
    window.localStorage.getItem(REFRESH_TOKEN_KEY)
  )
}

function persistTokens(
  accessToken: string,
  user: UserMeResponse,
  refreshToken?: string,
) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(AUTH_TOKEN_KEY, accessToken)
  window.sessionStorage.setItem(LEGACY_AUTH_TOKEN_KEY, accessToken)
  window.sessionStorage.setItem(LEGACY_TOKEN_KEY, accessToken)
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  if (refreshToken) {
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

function readInitialUser(): UserMeResponse | null {
  const stored = getStoredAuthUser()
  if (!stored) return null
  return stored as unknown as UserMeResponse
}

const initialState = (): Pick<
  AuthState,
  'accessToken' | 'refreshToken' | 'user' | 'permissions' | 'isAuthenticated'
> => {
  const accessToken = readToken()
  const refreshToken = readRefreshToken()
  const user = readInitialUser()
  return {
    accessToken,
    refreshToken,
    user,
    permissions: [],
    isAuthenticated: Boolean(accessToken && user),
  }
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    ...initialState(),

    setAuth: (token, user, options) => {
      persistTokens(token, user, options?.refreshToken)
      set({
        accessToken: token,
        refreshToken: options?.refreshToken ?? readRefreshToken(),
        user,
        permissions: options?.permissions ?? [],
        isAuthenticated: true,
      })
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('travelviet-login-welcome-pending', '1')
      }
      window.dispatchEvent(new Event('travelviet:login'))
    },

    setPermissions: (permissions) => {
      set({ permissions })
    },

    setUser: (user) => {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user))
      }
      set({ user })
    },

    clearAuth: () => {
      clearStoredAuthSession()
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        permissions: [],
        isAuthenticated: false,
      })
      window.dispatchEvent(new Event('travelviet:logout'))
    },

    hydrateFromStorage: () => {
      set(initialState())
    },
  })),
)

/**
 * Selector tiện dụng — dùng trong React component để tránh re-render khi state khác đổi.
 */
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated
export const selectCurrentUser = (state: AuthState) => state.user
export const selectAccessToken = (state: AuthState) => state.accessToken
export const selectPermissions = (state: AuthState) => state.permissions

/**
 * Lấy danh sách role code (chuẩn hoá UPPERCASE, loại trùng) từ user.
 */
export function getRoleCodes(user: UserMeResponse | null): string[] {
  if (!user) return []
  const candidates = [...(user.roles ?? []), user.role ?? '']
    .filter((value): value is string => typeof value === 'string')
    .map((role) => role.trim().toUpperCase())
    .filter((role) => role.length > 0)
  return Array.from(new Set(candidates))
}

export function isManagerRoleCode(role: string): role is ManagerRoleCode {
  return (MANAGER_ROLE_CODES as readonly string[]).includes(role)
}

export function hasManagerRole(user: UserMeResponse | null): boolean {
  return getRoleCodes(user).some(isManagerRoleCode)
}

export { MANAGER_ROLE_CODES }
