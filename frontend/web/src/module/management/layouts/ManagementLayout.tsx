import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import AdminLayout from './AdminLayout'
import '../pages/ManagementHubPage.css'

function ManagementLayout() {
  const navigate = useNavigate()
  const { t } = useTranslation('management')
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
    user?.displayName || user?.fullName || user?.email || t('layout.fallbackDisplayName')
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
          setAccessError(t('layout.accessLoadError'))
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
  }, [navigate, t])

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  return (
    <AdminLayout
      accessContext={accessContext}
      accessError={accessError}
      displayName={displayName}
      isAccessLoading={isAccessLoading}
      onLogout={handleLogout}
      roleSummary={roleSummary}
      visibleGroups={visibleGroups}
    >
      <div className="admin-card p-4 md:p-6">
        <Outlet context={{ accessContext }} />
      </div>
    </AdminLayout>
  )
}

export default ManagementLayout
