import { useEffect, useMemo, useState } from 'react'
import {
  Fingerprint,
  KeyRound,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserMinus,
  UsersRound,
} from 'lucide-react'
import {
  systemAdminApi,
  type AdminUser,
  type AuditLog,
  type Permission,
  type Role,
} from '../../../api/server/SystemAdmin.api'

type SystemTab = 'users' | 'roles' | 'audit'

const tabs: Array<{ id: SystemTab; label: string }> = [
  { id: 'users', label: 'Users' },
  { id: 'roles', label: 'Roles & permissions' },
  { id: 'audit', label: 'Audit' },
]

function formatDate(value: string | undefined) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getDisplayName(user: AdminUser) {
  return user.displayName || user.fullName || user.email || user.phone || user.id
}

function isInactive(user: AdminUser) {
  const status = user.status?.toLowerCase()
  return Boolean(user.deletedAt || status === 'inactive' || status === 'deleted')
}

function groupPermissionsByModule(permissions: Permission[]) {
  return permissions.reduce<Record<string, number>>((acc, permission) => {
    const moduleName = permission.moduleName || 'other'
    acc[moduleName] = (acc[moduleName] ?? 0) + 1
    return acc
  }, {})
}

export default function SystemGovernancePanel() {
  const [activeTab, setActiveTab] = useState<SystemTab>('users')
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [workingUserId, setWorkingUserId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const permissionModules = useMemo(
    () => groupPermissionsByModule(permissions),
    [permissions],
  )

  const activeUsers = useMemo(
    () => users.filter((user) => !isInactive(user)).length,
    [users],
  )

  const loadData = async () => {
    setLoading(true)
    setMessage('')

    try {
      const [userPage, roleList, permissionList, auditPage] = await Promise.all([
        systemAdminApi.getUsers({
          page: 0,
          size: 12,
          keyword: keyword.trim() || undefined,
          status: statusFilter || undefined,
          sortBy: 'createdAt',
          sortDir: 'desc',
        }),
        systemAdminApi.getRoles(),
        systemAdminApi.getPermissions(),
        systemAdminApi.getAuditLogs({ page: 0, size: 12 }),
      ])

      setUsers(userPage.content ?? [])
      setRoles(roleList)
      setPermissions(permissionList)
      setAuditLogs(auditPage.content ?? [])
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the tai du lieu he thong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const deactivateUser = async (user: AdminUser) => {
    setWorkingUserId(user.id)
    setMessage('')

    try {
      const updated = await systemAdminApi.deactivateUser(user.id)
      setUsers((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setMessage('Da deactivate user.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the deactivate user.')
    } finally {
      setWorkingUserId(null)
    }
  }

  return (
    <section className="mgmt-system-desk" id="system-governance">
      <header className="mgmt-system-head">
        <div>
          <p className="mgmt-kicker">SYSTEM GOVERNANCE</p>
          <h3>Kiem soat user, role va audit log</h3>
          <p>
            Dung API users, roles, permissions va audit-logs de nhin nhanh
            tai khoan noi bo, phan quyen hien co va hanh dong gan day.
          </p>
        </div>
        <div className="mgmt-system-summary">
          <span>
            <UsersRound aria-hidden="true" />
            {activeUsers}/{users.length} active
          </span>
          <span>
            <KeyRound aria-hidden="true" />
            {roles.length} roles
          </span>
          <span>
            <ShieldCheck aria-hidden="true" />
            {permissions.length} permissions
          </span>
          <span>
            <Fingerprint aria-hidden="true" />
            {auditLogs.length} audit rows
          </span>
        </div>
      </header>

      <div className="mgmt-system-toolbar">
        <div className="mgmt-system-tabs" role="tablist" aria-label="System governance">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.id ? 'is-active' : ''}
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label>
          <Search aria-hidden="true" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                void loadData()
              }
            }}
            placeholder="Tim user theo ten/email/phone"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="User status"
        >
          <option value="">Tat ca status</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="blocked">blocked</option>
        </select>

        <button type="button" onClick={() => void loadData()} disabled={loading}>
          <RefreshCcw aria-hidden="true" />
          Tai lai
        </button>
      </div>

      {loading ? (
        <p className="mgmt-system-empty">Dang tai du lieu he thong...</p>
      ) : (
        <>
          {activeTab === 'users' && (
            <div className="mgmt-system-user-table">
              {users.map((user) => (
                <article className="mgmt-system-user-row" key={user.id}>
                  <div className="mgmt-system-avatar">
                    {getDisplayName(user).slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <strong>{getDisplayName(user)}</strong>
                    <small>{user.email || user.phone || user.id}</small>
                  </div>
                  <span>{user.roles?.join(', ') || user.role || '-'}</span>
                  <span>{user.memberLevel || '-'}</span>
                  <em>{user.status || '-'}</em>
                  <button
                    type="button"
                    onClick={() => void deactivateUser(user)}
                    disabled={isInactive(user) || workingUserId === user.id}
                  >
                    <UserMinus aria-hidden="true" />
                    Deactivate
                  </button>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="mgmt-system-role-grid">
              <article className="mgmt-system-permission-panel">
                <header>
                  <ShieldCheck aria-hidden="true" />
                  <h4>Permission modules</h4>
                </header>
                <div>
                  {Object.entries(permissionModules).map(([moduleName, count]) => (
                    <span key={moduleName}>
                      {moduleName}: {count}
                    </span>
                  ))}
                </div>
              </article>

              {roles.map((role) => (
                <article className="mgmt-system-role-card" key={role.id}>
                  <header>
                    <span>{role.code}</span>
                    <strong>{role.isActive === false ? 'inactive' : 'active'}</strong>
                  </header>
                  <h4>{role.name}</h4>
                  <p>{role.description || role.roleScope || 'Role'}</p>
                  <dl>
                    <div>
                      <dt>Scope</dt>
                      <dd>{role.roleScope || '-'}</dd>
                    </div>
                    <div>
                      <dt>Level</dt>
                      <dd>{role.hierarchyLevel ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Permissions</dt>
                      <dd>{role.permissions?.length ?? 0}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="mgmt-system-audit-list">
              {auditLogs.map((log) => (
                <article className="mgmt-system-audit-row" key={log.id}>
                  <ShieldAlert aria-hidden="true" />
                  <div>
                    <strong>{log.actionName || `Audit #${log.id}`}</strong>
                    <small>
                      {log.entityName || '-'} · {log.entityId || '-'}
                    </small>
                  </div>
                  <span>{log.actorUserId || '-'}</span>
                  <time>{formatDate(log.createdAt)}</time>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {!loading &&
        ((activeTab === 'users' && users.length === 0) ||
          (activeTab === 'roles' && roles.length === 0) ||
          (activeTab === 'audit' && auditLogs.length === 0)) && (
          <p className="mgmt-system-empty">Khong co du lieu phu hop.</p>
        )}

      {message && <p className="mgmt-system-message">{message}</p>}
    </section>
  )
}
