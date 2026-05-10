import { useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import type { ReactNode } from 'react'
import { store } from '../stores'
import { queryClient } from './queryClient'
import { useAuthStore } from '../stores/authStore'

type AppProvidersProps = {
  children: ReactNode
}

/**
 * Subscribe `authStore.isAuthenticated`. Khi user logout (true → false) thì
 * **bắt buộc** clear toàn bộ TanStack Query cache để tránh rò rỉ dữ liệu user trước.
 * Subscriber được gắn 1 lần ở composition root và cleanup khi app unmount.
 */
function useClearQueryCacheOnLogout() {
  useEffect(() => {
    let previous = useAuthStore.getState().isAuthenticated
    const unsubscribe = useAuthStore.subscribe((state) => {
      const next = state.isAuthenticated
      if (previous && !next) {
        queryClient.clear()
      }
      previous = next
    })
    return unsubscribe
  }, [])
}

export function AppProviders({ children }: AppProvidersProps) {
  useClearQueryCacheOnLogout()

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </QueryClientProvider>
    </ReduxProvider>
  )
}
