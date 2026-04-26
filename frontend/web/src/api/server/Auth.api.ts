import { axiosBackend } from '../../utils/axiosInstance'
import type { ApiResponse } from '../../types/api'
import { unwrapApiResponse } from '../../types/api'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../../module/auth/database/interface/users'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage'

export const authApi = {
  async login(payload: LoginPayload) {
    try {
      const response = await axiosBackend.post<ApiResponse<AuthResponse>>(
        'auth/login',
        payload,
      )

      return unwrapApiResponse(
        response.data,
        'Khong the xu ly yeu cau dang nhap.',
      )
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, 'Khong the xu ly yeu cau dang nhap.'),
      )
    }
  },

  async register(payload: RegisterPayload) {
    try {
      const response = await axiosBackend.post<ApiResponse<AuthResponse>>(
        'auth/register',
        payload,
      )

      return unwrapApiResponse(response.data, 'Khong the xu ly yeu cau dang ky.')
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, 'Khong the xu ly yeu cau dang ky.'),
      )
    }
  },
}
