import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import ForbiddenPage from '../../components/error/ForbiddenPage'
import {
  hasManagerRole,
  selectCurrentUser,
  selectIsAuthenticated,
  useAuthStore,
} from '../../stores/authStore'

type RequireManagerAccessProps = {
  /**
   * Khi không truyền `children`, guard render `<Outlet />` (route element).
   * Khi truyền `children`, guard hoạt động như component bao quanh.
   */
  children?: ReactNode
}

/**
 * Lớp guard 2 — chỉ chấp nhận user có role thuộc nhóm quản trị
 * (`SUPER_ADMIN | ADMIN | CONTENT_EDITOR | FIELD_STAFF | OPERATOR`).
 *
 * Nếu user chưa đăng nhập → redirect `/login` (giữ origin).
 * Nếu đã đăng nhập nhưng không phải manager → render trang 403.
 */
function RequireManagerAccess({ children }: RequireManagerAccessProps = {}) {
  const location = useLocation()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore(selectCurrentUser)

  if (!isAuthenticated || !user) {
    const from = `${location.pathname}${location.search}`
    return <Navigate to="/login" replace state={{ from }} />
  }

  if (!hasManagerRole(user)) {
    return (
      <ForbiddenPage reason="Tài khoản của bạn không thuộc nhóm quản trị backoffice." />
    )
  }

  return children ? <>{children}</> : <Outlet />
}

export default RequireManagerAccess
