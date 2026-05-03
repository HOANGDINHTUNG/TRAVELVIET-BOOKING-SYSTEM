import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ManagerRoleCode } from '../../auth/api/authApi'
import {
  getStoredAuthUser,
  isManagerRoleCode,
} from '../../auth/api/authApi'
import { runManagementApiCheck } from '../api/managementApi'
import {
  filterChecksByRole,
  filterModulesByRole,
  type QuickCheckItem,
} from '../config/managementCatalog'
import {
  managerRolePermissionSeeds,
  managerRoleProfiles,
  resolveManagerRolesForUser,
} from '../config/managementRoles'
import type { SpecialistRoleCode } from '../config/managementDashboardConfig'
import QuickChecksPanel from '../components/QuickChecksPanel'
import AdminDashboard from '../components/dashboards/AdminDashboard'
import SpecialistRoleDashboard from '../components/dashboards/SpecialistRoleDashboard'
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard'
import type { CheckState } from '../utils/dashboardTypes'
import { summarizePayload } from '../utils/dashboardUtils'

const specialistRoles: SpecialistRoleCode[] = [
  'OPERATOR',
  'CONTENT_EDITOR',
  'FIELD_STAFF',
]

function isSpecialistRole(roleCode: ManagerRoleCode): roleCode is SpecialistRoleCode {
  return specialistRoles.includes(roleCode as SpecialistRoleCode)
}

function ManagementHubPage() {
  const navigate = useNavigate()
  const { roleCode } = useParams()
  const user = getStoredAuthUser()
  const managerRoles = useMemo(() => resolveManagerRolesForUser(user), [user])

  const normalizedRoleCode = roleCode?.trim().toUpperCase()
  const selectedRole = useMemo<ManagerRoleCode | null>(() => {
    if (!normalizedRoleCode || !isManagerRoleCode(normalizedRoleCode)) {
      return managerRoles[0] ?? null
    }

    return managerRoles.includes(normalizedRoleCode) ? normalizedRoleCode : managerRoles[0] ?? null
  }, [managerRoles, normalizedRoleCode])

  useEffect(() => {
    if (!managerRoles.length) {
      navigate('/', { replace: true })
      return
    }

    if (normalizedRoleCode && (!selectedRole || selectedRole !== normalizedRoleCode)) {
      navigate('/management/dashboard', { replace: true })
    }
  }, [managerRoles, navigate, normalizedRoleCode, selectedRole])

  const modules = useMemo(
    () => (selectedRole ? filterModulesByRole(selectedRole) : []),
    [selectedRole],
  )
  const checks = useMemo(
    () => (selectedRole ? filterChecksByRole(selectedRole) : []),
    [selectedRole],
  )
  const [checkStates, setCheckStates] = useState<Record<string, CheckState>>({})

  useEffect(() => {
    const t = window.setTimeout(() => {
      setCheckStates({})
    }, 0)
    return () => clearTimeout(t)
  }, [selectedRole])

  const runCheck = async (item: QuickCheckItem) => {
    setCheckStates((current) => ({
      ...current,
      [item.id]: { status: 'loading', detail: 'Calling API...' },
    }))

    const result = await runManagementApiCheck<unknown>(item.path)
    if (!result.ok) {
      setCheckStates((current) => ({
        ...current,
        [item.id]: {
          status: 'error',
          detail: `HTTP ${result.status} - ${result.message}`,
        },
      }))
      return
    }

    setCheckStates((current) => ({
      ...current,
      [item.id]: {
        status: 'success',
        detail: `HTTP ${result.status} - ${summarizePayload(result.data)}`,
      },
    }))
  }

  const runAllChecks = async () => {
    await Promise.all(checks.map((check) => runCheck(check)))
  }

  if (!selectedRole) {
    return null
  }

  const roleProfile = managerRoleProfiles[selectedRole]
  const permissionCount = managerRolePermissionSeeds[selectedRole].length
  const userRoles = managerRoles.join(', ')
  const dashboardProps = {
    modules,
    checks,
    checkStates,
    onRunCheck: runCheck,
    onRunAllChecks: runAllChecks,
    roleProfile,
    permissionCount,
    userRoles,
  }

  if (selectedRole === 'SUPER_ADMIN') {
    return <SuperAdminDashboard {...dashboardProps} />
  }

  if (selectedRole === 'ADMIN') {
    return <AdminDashboard {...dashboardProps} />
  }

  if (isSpecialistRole(selectedRole)) {
    return <SpecialistRoleDashboard roleCode={selectedRole} {...dashboardProps} />
  }

  return (
    <div className="mgmt-page">
      <header className="mgmt-page-header">
        <div>
          <p className="mgmt-kicker">BACKOFFICE</p>
          <h2>{roleProfile.label}</h2>
          <p>{roleProfile.summary}</p>
        </div>
        <div className="mgmt-role-meta">
          <span>{roleProfile.domain}</span>
          <strong>{permissionCount === 1 ? 'Full permissions' : `${permissionCount} seed permissions`}</strong>
          <small>Current user roles: {userRoles}</small>
        </div>
      </header>

      <section className="mgmt-section">
        <div className="mgmt-section-title">
          <h3>Controller Coverage</h3>
          <p>Danh sách endpoint được map từ backend controllers hiện có.</p>
        </div>

        <div className="mgmt-module-grid">
          {modules.map((module) => (
            <article className="mgmt-module-card" key={module.id}>
              <header>
                <h4>{module.title}</h4>
                <p>{module.description}</p>
              </header>

              <div className="mgmt-endpoint-list">
                {module.endpoints.map((endpoint) => (
                  <div className="mgmt-endpoint-item" key={endpoint.id}>
                    <span className={`mgmt-method-tag method-${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                    <code>{endpoint.path}</code>
                    <small>{endpoint.controller}</small>
                    {endpoint.permission && <em>{endpoint.permission}</em>}
                    {endpoint.note && <p>{endpoint.note}</p>}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <QuickChecksPanel
        checks={checks}
        checkStates={checkStates}
        onRunCheck={runCheck}
        onRunAllChecks={runAllChecks}
      />
    </div>
  )
}

export default ManagementHubPage
