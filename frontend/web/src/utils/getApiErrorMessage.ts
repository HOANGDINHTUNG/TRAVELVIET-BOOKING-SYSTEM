import { isAxiosError } from 'axios'
import type { ApiResponse } from '../types/api'

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message || error.message || fallback
  }

  return error instanceof Error ? error.message : fallback
}
