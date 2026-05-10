import { handleApiError } from '../lib/handleApiError'

export function getApiErrorMessage(error: unknown, fallback: string) {
  return handleApiError(error, fallback)
}
