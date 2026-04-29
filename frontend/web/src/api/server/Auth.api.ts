import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../../module/auth/database/interface/users'
import { postBackendData } from './serverApiClient'

export type RefreshTokenPayload = {
  refreshToken: string
}

export const authApi = {
  login(payload: LoginPayload) {
    return postBackendData<AuthResponse>('auth/login', payload)
  },

  register(payload: RegisterPayload) {
    return postBackendData<AuthResponse>('auth/register', payload)
  },

  refresh(payload: RefreshTokenPayload) {
    return postBackendData<AuthResponse>('auth/refresh', payload)
  },
}
