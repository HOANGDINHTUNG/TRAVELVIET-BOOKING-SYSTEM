import { apiClient } from '../../../lib/apiClient'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
} from '../types/auth'

/**
 * Auth API — bám sát `API_DOCUMENTATION.md §4`.
 * Lưu ý: response interceptor trong `apiClient` đã unwrap `ApiResponse<T>` ⇒
 * service chỉ thao tác trực tiếp với `T = LoginResponse`.
 */
export const AuthApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('auth/login', payload)
    return response.data
  },

  async refresh(payload: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      'auth/refresh',
      payload,
    )
    return response.data
  },
}
