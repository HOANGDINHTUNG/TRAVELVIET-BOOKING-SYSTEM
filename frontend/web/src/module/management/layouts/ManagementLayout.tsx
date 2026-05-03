import { useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
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
import ManagementSidebar from './ManagementSidebar'
import './managementLayout.css'

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
      <ManagementSidebar
        accessContext={accessContext}
        accessError={accessError}
        displayName={displayName}
        isAccessLoading={isAccessLoading}
        onLogout={handleLogout}
        roleSummary={roleSummary}
        visibleGroups={visibleGroups}
      />

      <main className="mgmt-main">
        <Outlet context={{ accessContext }} />
      </main>
    </div>
  )
}

export default ManagementLayout
