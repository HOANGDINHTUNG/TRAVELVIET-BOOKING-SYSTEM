import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  clearAuthSession,
  getStoredAuthUser,
} from '../../../auth/api/authApi'
import {
  managerRoleProfiles,
  resolveManagerRolesForUser,
} from '../../config/managementRoles'
import '../../pages/ManagementHubPage.css'

function ManagementLayout() {
  const navigate = useNavigate()
  const user = getStoredAuthUser()
  const availableRoles = resolveManagerRolesForUser(user)

  const displayName =
    user?.displayName || user?.fullName || user?.email || 'Backoffice User'
  const primaryRole = availableRoles[0]

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mgmt-layout">
      <aside className="mgmt-sidebar">
        <div className="mgmt-brand">
          <p>TravelViet</p>
          <h1>Management Hub</h1>
        </div>

        <div className="mgmt-profile">
          <strong>{displayName}</strong>
          <span>{primaryRole ? managerRoleProfiles[primaryRole].summary : 'Manager'}</span>
        </div>

        <nav className="mgmt-role-nav" aria-label="Role navigation">
          {availableRoles.map((roleCode) => (
            <NavLink
              key={roleCode}
              to={`/management/${roleCode}`}
              className={({ isActive }) =>
                isActive ? 'mgmt-role-link active' : 'mgmt-role-link'
              }
            >
              <span>{managerRoleProfiles[roleCode].label}</span>
              <small>{managerRoleProfiles[roleCode].domain}</small>
            </NavLink>
          ))}
        </nav>

        <button className="mgmt-logout-btn" type="button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="mgmt-main">
        <Outlet />
      </main>
    </div>
  )
}

export default ManagementLayout
