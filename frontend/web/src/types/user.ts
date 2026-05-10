/**
 * Khớp DTO `UserResponse` (backend) — body của `ApiResponse<UserMeResponse>` khi gọi `GET /users/me`.
 * @see com.wedservice.backend.module.users.dto.response.UserResponse
 */
export type UserGender = 'male' | 'female' | 'other' | 'unknown'

export type UserAccountStatus =
  | 'pending'
  | 'active'
  | 'suspended'
  | 'blocked'
  | 'deleted'

export type MemberLevel =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'

export type UserCategory = 'INTERNAL' | 'CUSTOMER'

export type UserMeResponse = {
  id: string
  email: string | null
  phone: string | null
  fullName: string | null
  displayName: string | null
  gender: UserGender | null
  /** ISO date `YYYY-MM-DD` */
  dateOfBirth: string | null
  avatarUrl: string | null
  userCategory: UserCategory | null
  /** Mã role chính */
  role: string | null
  roles: string[] | null
  status: UserAccountStatus | null
  memberLevel: MemberLevel | null
  loyaltyPoints: number | null
  /** BigDecimal từ backend — JSON thường là number */
  totalSpent: number | null
  emailVerifiedAt: string | null
  phoneVerifiedAt: string | null
  lastLoginAt: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
}
