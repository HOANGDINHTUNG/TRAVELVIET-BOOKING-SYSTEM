import i18n from './i18n'
import {
  ApiClientError,
  isApiClientError,
  isApiErrorMessageKey,
} from '../types/api'

/**
 * Chuẩn hoá thông báo lỗi hiển thị cho người dùng.
 * - `ApiClientError`: ưu tiên key `api.error.*` trong `message`, sau đó `errors.codes.<errorCode>`, cuối cùng `backendMessage`.
 * - `Error` thông thường: nếu `message` là key `api.error.*` thì dịch qua i18n.
 *
 * @param error — dùng `unknown` thay cho `any` (strict mode).
 */
export function handleApiError(error: unknown, fallback: string): string {
  if (isApiClientError(error)) {
    return resolveApiClientErrorMessage(error, fallback)
  }

  if (error instanceof Error) {
    if (isApiErrorMessageKey(error.message)) {
      return String(i18n.t(error.message, { defaultValue: error.message }))
    }
    return error.message || fallback
  }

  return fallback
}

function resolveApiClientErrorMessage(
  error: ApiClientError,
  fallback: string,
): string {
  const raw = error.backendMessage?.trim()
  if (raw && isApiErrorMessageKey(raw)) {
    return String(i18n.t(raw, { defaultValue: raw }))
  }

  const codeKey = `errors.codes.${error.errorCode}`
  const fromCode = String(i18n.t(codeKey, { defaultValue: '' }))
  if (fromCode.length > 0) return fromCode

  if (raw) return raw
  return fallback
}
