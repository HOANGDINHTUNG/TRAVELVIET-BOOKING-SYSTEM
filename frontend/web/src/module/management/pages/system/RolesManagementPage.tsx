import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  KeyRound,
  Plus,
  RefreshCcw,
  Save,
  ShieldCheck,
  X,
} from 'lucide-react'
import { systemAdminApi, type Permission, type Role } from '../../../../api/server/SystemAdmin.api'
import type { UserAccessContext } from '../../../auth/api/authApi'
import {
  buildRolePayload,
  canUsePermission,
  createEmptyRoleForm,
  groupPermissionsByModule,
  roleScopeOptions,
  toRoleForm,
  type RoleFormState,
} from './systemShared'

function RolesManagementPage({ accessContext }: { accessContext: UserAccessContext }) {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [permissionCodes, setPermissionCodes] = useState<string[]>([])
  const [form, setForm] = useState<RoleFormState>(() => createEmptyRoleForm())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const canAssignRole = canUsePermission(accessContext, 'role.assign')
  const permissionGroups = useMemo(() => groupPermissionsByModule(permissions), [permissions])
  const editing = Boolean(form.id)

  const loadData = async () => {
    setLoading(true)
    setMessage('')

    try {
      const [roleList, permissionList] = await Promise.all([
        systemAdminApi.getRoles(),
        systemAdminApi.getPermissions(),
      ])
      setRoles(roleList)
      setPermissions(permissionList)
      if (!form.id && roleList.length > 0) {
        const firstRole = roleList[0]
        setForm(toRoleForm(firstRole))
        setPermissionCodes(
          firstRole.permissions?.map((permission) => permission.code).filter(Boolean) as string[] ?? [],
        )
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải vai trò.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const updateForm = (patch: Partial<RoleFormState>) => {
    setForm((current) => ({ ...current, ...patch }))
  }

  const startCreate = () => {
    setMessage('')
    setForm(createEmptyRoleForm())
    setPermissionCodes([])
  }

  const startEdit = (role: Role) => {
    setMessage('')
    setForm(toRoleForm(role))
    setPermissionCodes(
      role.permissions?.map((permission) => permission.code).filter(Boolean) as string[] ?? [],
    )
  }

  const togglePermission = (permissionCode: string) => {
    setPermissionCodes((current) =>
      current.includes(permissionCode)
        ? current.filter((code) => code !== permissionCode)
        : [...current, permissionCode],
    )
  }

  const saveRole = async () => {
    if (!canAssignRole) {
      setMessage('Bạn chưa có quyền tạo hoặc cập nhật vai trò.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const payload = buildRolePayload(form)
      const savedRole = editing && form.id
        ? await systemAdminApi.updateRole(form.id, payload)
        : await systemAdminApi.createRole(payload)

      const savedWithPermissions = await systemAdminApi.updateRolePermissions(savedRole.id, {
        permissionCodes,
      })

      setRoles((current) => {
        const exists = current.some((role) => role.id === savedWithPermissions.id)
        return exists
          ? current.map((role) => (role.id === savedWithPermissions.id ? savedWithPermissions : role))
          : [savedWithPermissions, ...current]
      })
      setForm(toRoleForm(savedWithPermissions))
      setPermissionCodes(
        savedWithPermissions.permissions?.map((permission) => permission.code).filter(Boolean) as string[] ?? [],
      )
      setMessage(editing ? 'Đã cập nhật vai trò.' : 'Đã tạo vai trò.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu vai trò.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mgmt-page">
      <section className="mgmt-crud-shell">
        <header className="mgmt-crud-head">
          <div>
            <p className="mgmt-kicker">VAI TRÒ</p>
            <h2>Thiết kế vai trò và gán quyền</h2>
            <p>
              Vai trò được quản trị theo metadata riêng, còn quyền được gán bằng danh
              sách permission code đang active trong backend.
            </p>
          </div>

          <div className="mgmt-crud-summary">
            <span>
              <KeyRound aria-hidden="true" />
              {roles.length} vai trò
            </span>
            <span>
              <ShieldCheck aria-hidden="true" />
              {permissions.length} quyền
            </span>
            <span>
              <CheckCircle2 aria-hidden="true" />
              {permissionCodes.length} quyền đang chọn
            </span>
          </div>
        </header>

        <div className="mgmt-crud-toolbar compact">
          <button type="button" onClick={() => void loadData()} disabled={loading}>
            <RefreshCcw aria-hidden="true" />
            Tải lại
          </button>
          {canAssignRole && (
            <button type="button" onClick={startCreate}>
              <Plus aria-hidden="true" />
              Tạo vai trò
            </button>
          )}
        </div>

        <div className="mgmt-crud-workspace">
          <article className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>Danh sách vai trò</h3>
              <p>Chọn một vai trò để sửa metadata hoặc cập nhật quyền.</p>
            </div>

            {loading ? (
              <p className="mgmt-crud-empty">Đang tải vai trò...</p>
            ) : (
              <div className="mgmt-role-list">
                {roles.map((role) => (
                  <button
                    type="button"
                    className={form.id === role.id ? 'active' : ''}
                    key={role.id}
                    onClick={() => startEdit(role)}
                  >
                    <span>{role.code}</span>
                    <strong>{role.name}</strong>
                    <small>
                      {role.roleScope || '-'} · {role.permissions?.length ?? 0} quyền
                    </small>
                  </button>
                ))}
              </div>
            )}
          </article>

          <aside className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>{editing ? 'Cập nhật vai trò' : 'Tạo vai trò'}</h3>
              <p>
                Vai trò hệ thống và scope SYSTEM chỉ nên để Super Admin chỉnh để tránh
                mở quyền nhầm.
              </p>
            </div>

            <div className="mgmt-crud-form role-form">
              <label>
                <span>Mã vai trò</span>
                <input value={form.code} onChange={(event) => updateForm({ code: event.target.value })} />
              </label>
              <label>
                <span>Tên vai trò</span>
                <input value={form.name} onChange={(event) => updateForm({ name: event.target.value })} />
              </label>
              <label className="mgmt-crud-wide">
                <span>Mô tả</span>
                <textarea value={form.description} onChange={(event) => updateForm({ description: event.target.value })} />
              </label>
              <label>
                <span>Phạm vi</span>
                <select value={form.roleScope} onChange={(event) => updateForm({ roleScope: event.target.value })}>
                  {roleScopeOptions.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Cấp bậc</span>
                <input value={form.hierarchyLevel} onChange={(event) => updateForm({ hierarchyLevel: event.target.value })} />
              </label>
              <label className="mgmt-check-line">
                <input
                  type="checkbox"
                  checked={form.isSystemRole}
                  onChange={(event) => updateForm({ isSystemRole: event.target.checked })}
                />
                Vai trò hệ thống
              </label>
              <label className="mgmt-check-line">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => updateForm({ isActive: event.target.checked })}
                />
                Đang hoạt động
              </label>
            </div>

            <div className="mgmt-permission-picker">
              <strong>Gán quyền cho vai trò</strong>
              {Object.entries(permissionGroups).map(([moduleName, modulePermissions]) => (
                <div className="mgmt-permission-group" key={moduleName}>
                  <p>{moduleName}</p>
                  <div>
                    {modulePermissions.map((permission) => {
                      const code = permission.code ?? ''
                      const disabled = !code || permission.isActive === false

                      return (
                        <label key={permission.id}>
                          <input
                            type="checkbox"
                            checked={Boolean(code && permissionCodes.includes(code))}
                            disabled={disabled}
                            onChange={() => code && togglePermission(code)}
                          />
                          <span>{permission.name || code}</span>
                          <small>{code}</small>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mgmt-crud-actions">
              <button type="button" onClick={() => void saveRole()} disabled={saving || !canAssignRole}>
                <Save aria-hidden="true" />
                {saving ? 'Đang lưu...' : 'Lưu vai trò'}
              </button>
              <button type="button" onClick={startCreate}>
                <X aria-hidden="true" />
                Làm mới form
              </button>
            </div>
          </aside>
        </div>

        {message && <p className="mgmt-crud-message">{message}</p>}
      </section>
    </div>
  )
}

export default RolesManagementPage
