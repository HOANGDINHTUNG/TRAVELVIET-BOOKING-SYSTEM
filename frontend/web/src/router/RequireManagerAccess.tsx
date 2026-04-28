import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  getStoredAccessToken,
  getStoredAuthUser,
  hasManagerRole,
} from '../module/auth/api/authApi'

function RequireManagerAccess() {
  const location = useLocation()
  const token = getStoredAccessToken()
  const user = getStoredAuthUser()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!hasManagerRole(user)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RequireManagerAccess
