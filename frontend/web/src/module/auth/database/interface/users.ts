export type AuthUser = {
  id: string
  fullName?: string
  displayName?: string
  email?: string
  phone?: string
  gender?: string
  dateOfBirth?: string
  avatarUrl?: string | null
  userCategory?: string
  status?: string
  memberLevel?: string
  loyaltyPoints?: number
  totalSpent?: number | string
  role?: string
  roles?: string[]
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

export type UserAccessContext = {
  user: AuthUser
  roles: string[]
  permissions: string[]
  managementRoles: string[]
  hasManagementAccess: boolean
  isSuperAdmin: boolean
}

export type AuthResponse = {
  user: AuthUser
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
  refreshExpiresIn: number
}

export type LoginPayload = {
  login: string
  passwordHash: string
}

export type RegisterPayload = {
  fullName: string
  email: string
  passwordHash: string
}
