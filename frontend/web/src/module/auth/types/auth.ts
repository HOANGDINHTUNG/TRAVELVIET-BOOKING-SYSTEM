import type {
  MemberLevel,
  UserAccountStatus,
  UserCategory,
  UserGender,
  UserMeResponse,
} from '../../../types/user'

/**
 * Body request của `POST /auth/login` — backend `LoginRequest` (DTO).
 * `login` nhận email hoặc phone (alias `email` cũng được).
 */
export type LoginRequest = {
  login: string
  passwordHash: string
}

/**
 * Body data của `POST /auth/login` — khớp `AuthResponse.java`.
 */
export type LoginResponse = {
  user: AuthLoginUser
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
  refreshExpiresIn: number
}

/**
 * Snapshot user trong `AuthResponse` — superset của `UserMeResponse` (BE trả thêm `role`/`roles`).
 */
export type AuthLoginUser = {
  id: string
  email?: string | null
  phone?: string | null
  fullName?: string | null
  displayName?: string | null
  gender?: UserGender | null
  dateOfBirth?: string | null
  avatarUrl?: string | null
  userCategory?: UserCategory | null
  role?: string | null
  roles?: string[] | null
  status?: UserAccountStatus | null
  memberLevel?: MemberLevel | null
  loyaltyPoints?: number | null
  totalSpent?: number | string | null
}

/**
 * Body request của `POST /auth/refresh`.
 */
export type RefreshTokenRequest = {
  refreshToken: string
}

/**
 * Map `AuthLoginUser` (login response) → `UserMeResponse` (chuẩn lưu trong store).
 * Các trường BE chưa trả về (vd `emailVerifiedAt`) sẽ là `null`.
 */
export function toUserMeResponse(user: AuthLoginUser): UserMeResponse {
  return {
    id: user.id,
    email: user.email ?? null,
    phone: user.phone ?? null,
    fullName: user.fullName ?? null,
    displayName: user.displayName ?? null,
    gender: user.gender ?? null,
    dateOfBirth: user.dateOfBirth ?? null,
    avatarUrl: user.avatarUrl ?? null,
    userCategory: user.userCategory ?? null,
    role: user.role ?? null,
    roles: user.roles ?? null,
    status: user.status ?? null,
    memberLevel: user.memberLevel ?? null,
    loyaltyPoints: user.loyaltyPoints ?? null,
    totalSpent:
      typeof user.totalSpent === 'string'
        ? Number(user.totalSpent)
        : (user.totalSpent ?? null),
    emailVerifiedAt: null,
    phoneVerifiedAt: null,
    lastLoginAt: null,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
  }
}
