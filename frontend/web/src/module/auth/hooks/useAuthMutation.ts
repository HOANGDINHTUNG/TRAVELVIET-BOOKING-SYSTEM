import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { handleApiError } from '../../../lib/handleApiError'
import {
  hasManagerRole,
  useAuthStore,
} from '../../../stores/authStore'
import { AuthApi } from '../api/Auth.api'
import type { LoginRequest, LoginResponse } from '../types/auth'
import { toUserMeResponse } from '../types/auth'

export type UseLoginOptions = {
  /** Override redirect path. Mặc định: manager → `/management/dashboard`, còn lại → `/`. */
  redirectTo?: string
  /** Tắt navigate sau khi đăng nhập (vd. cần show animation trước). */
  disableRedirect?: boolean
  /** Callback mở rộng — chạy sau khi store đã `setAuth` thành công. */
  onAuthenticated?: (data: LoginResponse) => void
} & Omit<
  UseMutationOptions<LoginResponse, unknown, LoginRequest>,
  'mutationFn' | 'onSuccess' | 'onError'
>

/**
 * Hook đăng nhập — gọi `AuthApi.login`, lưu vào `authStore`, toast và redirect.
 */
export function useLogin(options: UseLoginOptions = {}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const {
    redirectTo,
    disableRedirect = false,
    onAuthenticated,
    ...mutationOptions
  } = options

  return useMutation<LoginResponse, unknown, LoginRequest>({
    ...mutationOptions,
    mutationFn: (payload) => AuthApi.login(payload),
    onSuccess: (data) => {
      const user = toUserMeResponse(data.user)
      setAuth(data.accessToken, user, {
        refreshToken: data.refreshToken,
      })

      toast.success(
        String(
          t('loginSuccess', {
            ns: 'auth',
            defaultValue: 'Đăng nhập thành công.',
          }),
        ),
      )

      onAuthenticated?.(data)

      if (!disableRedirect) {
        const target =
          redirectTo ?? (hasManagerRole(user) ? '/management/dashboard' : '/')
        navigate(target, { replace: true })
      }
    },
    onError: (error: unknown) => {
      const fallback = String(
        t('loginFailed', {
          ns: 'auth',
          defaultValue: 'Đăng nhập thất bại. Vui lòng thử lại.',
        }),
      )
      toast.error(handleApiError(error, fallback))
    },
  })
}
