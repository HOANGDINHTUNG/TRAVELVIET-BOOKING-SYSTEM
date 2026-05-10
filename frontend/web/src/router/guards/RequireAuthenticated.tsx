import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  selectIsAuthenticated,
  useAuthStore,
} from '../../stores/authStore'

type RequireAuthenticatedProps = {
  /**
   * Khi không truyền `children`, guard render `<Outlet />` (route element).
   * Khi truyền `children`, guard hoạt động như component bao quanh.
   */
  children?: ReactNode
}

/**
 * Lớp guard 1 — yêu cầu user đã đăng nhập.
 * Lấy state trực tiếp từ Zustand `authStore` (không đọc storage trong component).
 */
function RequireAuthenticated({ children }: RequireAuthenticatedProps = {}) {
  const location = useLocation()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}`
    return <Navigate to="/login" replace state={{ from }} />
  }

  return children ? <>{children}</> : <Outlet />
}

export default RequireAuthenticated
