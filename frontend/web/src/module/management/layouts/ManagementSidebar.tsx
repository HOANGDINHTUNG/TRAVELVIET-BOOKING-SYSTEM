import { NavLink } from 'react-router-dom'
import type {
  ManagerRoleCode,
  UserAccessContext,
} from '../../auth/api/authApi'
import {
  managerRoleProfiles,
} from '../config/managementRoles'
import type { ManagementNavGroup } from '../config/managementNavigation'

type ManagementSidebarProps = {
  accessContext: UserAccessContext | null
  accessError: string | null
  displayName: string
  isAccessLoading: boolean
  onLogout: () => void
  roleSummary: string
  visibleGroups: ManagementNavGroup[]
}

function getRoleSummaryLabel(
  accessContext: UserAccessContext | null,
  roleSummary: string,
) {
  if (roleSummary) {
    return roleSummary
  }

  if (accessContext) {
    return 'Đang kiểm tra quyền'
  }

  return 'Đang tải hồ sơ'
}

function buildGroupKey(groupId: string, roleCode: string | undefined) {
  return `${groupId}-${roleCode ?? 'all'}`
}

function ManagementSidebar({
  accessContext,
  accessError,
  displayName,
  isAccessLoading,
  onLogout,
  roleSummary,
  visibleGroups,
}: ManagementSidebarProps) {
  const primaryRoleCode =
    (accessContext?.managementRoles?.[0] as ManagerRoleCode | undefined) ?? undefined
  const primaryRole =
    (primaryRoleCode && managerRoleProfiles[primaryRoleCode]) || null

  return (
    <aside className="mgmt-sidebar">
      <div className="mgmt-brand">
        <p>TravelViet</p>
        <h1>Trang quản lý</h1>
      </div>

      <div className="mgmt-profile">
        <strong>{displayName}</strong>
        <span>{getRoleSummaryLabel(accessContext, roleSummary)}</span>
        {primaryRole && (
          <small className="mgmt-profile-domain">{primaryRole.domain}</small>
        )}
      </div>

      <nav className="mgmt-side-nav" aria-label="Điều hướng quản lý">
        {isAccessLoading && (
          <div className="mgmt-side-status">Đang tải quyền truy cập...</div>
        )}

        {accessError && !isAccessLoading && (
          <div className="mgmt-side-status error">{accessError}</div>
        )}

        {!isAccessLoading &&
          !accessError &&
          visibleGroups.map((group) => (
            <div
              className="mgmt-side-group"
              key={buildGroupKey(group.id, primaryRoleCode)}
            >
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

      <button className="mgmt-logout-btn" type="button" onClick={onLogout}>
        Đăng xuất
      </button>
    </aside>
  )
}

export default ManagementSidebar
