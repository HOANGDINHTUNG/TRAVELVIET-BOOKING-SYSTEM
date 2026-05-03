import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { userApi } from '../../../api/server/User.api'
import type { UserAccessContext } from '../../auth/api/authApi'
import {
  clearAuthSession,
  getStoredAuthUser,
  isManagerRoleCode,
  persistStoredAuthUser,
} from '../../auth/api/authApi'
import {
  managerRoleProfiles,
  resolveManagerRolesForUser,
} from '../config/managementRoles'
import { getVisibleManagementGroups } from '../config/managementNavigation'
import '../pages/ManagementHubPage.css'

function ManagementLayout() {
  const navigate = useNavigate()
  const [accessContext, setAccessContext] = useState<UserAccessContext | null>(null)
  const [isAccessLoading, setIsAccessLoading] = useState(true)
  const [accessError, setAccessError] = useState<string | null>(null)
  const storedUser = getStoredAuthUser()
  const user = accessContext?.user ?? storedUser
  const availableRoles = (
    accessContext?.managementRoles ?? resolveManagerRolesForUser(user)
  ).filter(isManagerRoleCode)
  const visibleGroups = useMemo(
    () =>
      getVisibleManagementGroups(
        accessContext?.permissions ?? [],
        Boolean(accessContext?.isSuperAdmin),
      ),
    [accessContext],
  )

  const displayName =
    user?.displayName || user?.fullName || user?.email || 'Người dùng quản lý'
  const roleSummary = availableRoles
    .map((roleCode) => managerRoleProfiles[roleCode]?.label ?? roleCode)
    .join(', ')

  useEffect(() => {
    let isCancelled = false

    const loadAccessContext = async () => {
      setIsAccessLoading(true)
      setAccessError(null)

      try {
        const nextAccessContext = await userApi.getMyAccessContext()
        if (isCancelled) {
          return
        }

        if (!nextAccessContext.hasManagementAccess) {
          navigate('/', { replace: true })
          return
        }

        setAccessContext(nextAccessContext)
        persistStoredAuthUser(nextAccessContext.user)
      } catch {
        if (!isCancelled) {
          setAccessError('Không thể tải quyền quản lý của tài khoản hiện tại.')
        }
      } finally {
        if (!isCancelled) {
          setIsAccessLoading(false)
        }
      }
    }

    loadAccessContext()

    return () => {
      isCancelled = true
    }
  }, [navigate])

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mgmt-layout">
      <aside className="mgmt-sidebar">
        <div className="mgmt-brand">
          <p>TravelViet</p>
          <h1>Trang quản lý</h1>
        </div>

        <div className="mgmt-profile">
          <strong>{displayName}</strong>
          <span>{roleSummary || 'Đang kiểm tra quyền'}</span>
        </div>

        <nav className="mgmt-side-nav" aria-label="Điều hướng quản lý">
          {isAccessLoading && (
            <div className="mgmt-side-status">Đang tải quyền truy cập...</div>
          )}

          {accessError && !isAccessLoading && (
            <div className="mgmt-side-status error">{accessError}</div>
          )}

          {!isAccessLoading && !accessError && visibleGroups.map((group) => (
            <div className="mgmt-side-group" key={group.id}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? 'mgmt-side-link active' : 'mgmt-side-link'
                    }
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        <button className="mgmt-logout-btn" type="button" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      <main className="mgmt-main">
        <Outlet context={{ accessContext }} />
      </main>
    </div>
  )
}

export default ManagementLayout
