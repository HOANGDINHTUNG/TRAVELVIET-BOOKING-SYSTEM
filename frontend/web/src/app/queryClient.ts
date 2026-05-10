import { QueryClient } from '@tanstack/react-query'
import { ApiClientError } from '../types/api'

/**
 * Cấu hình mặc định cho TanStack Query — tham chiếu FRONTEND_ARCHITECTURE.md §3.4.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        if (
          error instanceof ApiClientError &&
          error.httpStatus > 0 &&
          error.httpStatus < 500
        ) {
          return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
