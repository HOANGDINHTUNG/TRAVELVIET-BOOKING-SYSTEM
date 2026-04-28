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

export type LoginPayload = {
  login: string
  passwordHash: string
}

export type RegisterPayload = {
  fullName: string
  email: string
  passwordHash: string
}
