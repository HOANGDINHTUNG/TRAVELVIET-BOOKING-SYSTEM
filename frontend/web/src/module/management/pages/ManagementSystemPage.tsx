import { useEffect, useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import {
  CheckCircle2,
  Edit3,
  KeyRound,
  ListChecks,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  UserMinus,
  UserPlus,
  UsersRound,
  X,
} from 'lucide-react'
import { Navigate, useOutletContext } from 'react-router-dom'
import {
  systemAdminApi,
  type AdminCreateUserPayload,
  type AdminUpdateUserPayload,
  type AdminUser,
  type Permission,
  type Role,
  type RolePayload,
} from '../../../api/server/SystemAdmin.api'
import type { UserAccessContext } from '../../auth/api/authApi'
import {
  canAccessManagementItem,
  getManagementNavItem,
  type ManagementPageId,
} from '../config/managementNavigation'

type SystemPageId = Extract<ManagementPageId, 'users' | 'roles' | 'permissions'>

type ManagementSystemPageProps = {
  pageId: SystemPageId
}

type ManagementOutletContext = {
  accessContext: UserAccessContext | null
}

type UsersQueryState = {
  keyword: string
  status: string
  roleCode: string
  memberLevel: string
}

type UserFormState = {
  id: string | null
  fullName: string
  displayName: string
  email: string
  phone: string
  passwordHash: string
  userCategory: string
  status: string
  memberLevel: string
  gender: string
  dateOfBirth: string
  avatarUrl: string
  loyaltyPoints: string
  totalSpent: string
  roleCodes: string[]
}

type RoleFormState = {
  id: number | null
  code: string
  name: string
  description: string
  roleScope: string
  hierarchyLevel: string
  isSystemRole: boolean
  isActive: boolean
}

const userStatusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'pending', label: 'Chờ xác minh' },
  { value: 'suspended', label: 'Tạm khóa' },
  { value: 'blocked', label: 'Bị chặn' },
  { value: 'deleted', label: 'Đã xóa' },
]

const memberLevelOptions = [
  { value: '', label: 'Tất cả hạng thành viên' },
  { value: 'bronze', label: 'Đồng' },
  { value: 'silver', label: 'Bạc' },
  { value: 'gold', label: 'Vàng' },
  { value: 'platinum', label: 'Bạch kim' },
  { value: 'diamond', label: 'Kim cương' },
]

const userCategoryOptions = [
  { value: 'CUSTOMER', label: 'Khách hàng' },
  { value: 'INTERNAL', label: 'Nội bộ' },
]

const genderOptions = [
  { value: '', label: 'Không chọn' },
  { value: 'unknown', label: 'Chưa rõ' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
]

const roleScopeOptions = [
  { value: 'CUSTOMER', label: 'Khách hàng' },
  { value: 'BACKOFFICE', label: 'Backoffice' },
  { value: 'SYSTEM', label: 'Hệ thống' },
]

const permissionActiveOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang bật' },
  { value: 'inactive', label: 'Đang tắt' },
]

function createEmptyUserForm(): UserFormState {
  return {
    id: null,
    fullName: '',
    displayName: '',
    email: '',
    phone: '',
    passwordHash: '',
    userCategory: 'CUSTOMER',
    status: 'active',
    memberLevel: 'bronze',
    gender: '',
    dateOfBirth: '',
    avatarUrl: '',
    loyaltyPoints: '',
    totalSpent: '',
    roleCodes: [],
  }
}

function createEmptyRoleForm(): RoleFormState {
  return {
    id: null,
    code: '',
    name: '',
    description: '',
    roleScope: 'BACKOFFICE',
    hierarchyLevel: '100',
    isSystemRole: false,
    isActive: true,
  }
}

function canUsePermission(accessContext: UserAccessContext, permission: string) {
  return (
    Boolean(accessContext.isSuperAdmin) ||
    (accessContext.permissions ?? []).includes(permission)
  )
}

function getUserDisplayName(user: AdminUser) {
  return user.displayName || user.fullName || user.email || user.phone || user.id
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function isInactiveUser(user: AdminUser) {
  const status = user.status?.toLowerCase()
  return Boolean(
    user.deletedAt ||
      status === 'suspended' ||
      status === 'blocked' ||
      status === 'deleted',
  )
}

function labelFor(options: Array<{ value: string; label: string }>, value: string | undefined) {
  return options.find((option) => option.value === value)?.label ?? value ?? '-'
}

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

function toOptionalNumber(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  const numberValue = Number(trimmed)
  return Number.isFinite(numberValue) ? numberValue : undefined
}

function buildCreateUserPayload(form: UserFormState): AdminCreateUserPayload {
  const loyaltyPoints = toOptionalNumber(form.loyaltyPoints)
  const totalSpent = toOptionalNumber(form.totalSpent)

  return {
    fullName: form.fullName.trim(),
    displayName: form.displayName.trim() || undefined,
    email: form.email.trim() || undefined,
    phone: form.phone.trim() || undefined,
    passwordHash: form.passwordHash,
    userCategory: form.userCategory,
    status: form.status,
    memberLevel: form.memberLevel,
    gender: form.gender || undefined,
    dateOfBirth: form.dateOfBirth || undefined,
    avatarUrl: form.avatarUrl.trim() || undefined,
    loyaltyPoints,
    totalSpent,
    roleCodes: form.roleCodes.length ? form.roleCodes : undefined,
  }
}

function buildUpdateUserPayload(form: UserFormState): AdminUpdateUserPayload {
  return {
    ...buildCreateUserPayload(form),
    passwordHash: form.passwordHash.trim() || undefined,
    status: form.status,
    memberLevel: form.memberLevel,
  }
}

function buildRolePayload(form: RoleFormState): RolePayload {
  const hierarchyLevel = Number(form.hierarchyLevel)

  return {
    code: form.code.trim(),
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    roleScope: form.roleScope,
    hierarchyLevel: Number.isFinite(hierarchyLevel) ? hierarchyLevel : 0,
    isSystemRole: form.isSystemRole,
    isActive: form.isActive,
  }
}

function groupPermissionsByModule(permissions: Permission[]) {
  return permissions.reduce<Record<string, Permission[]>>((groups, permission) => {
    const moduleName = permission.moduleName || 'Khác'
    groups[moduleName] = [...(groups[moduleName] ?? []), permission]
    return groups
  }, {})
}

function toUserForm(user: AdminUser): UserFormState {
  return {
    id: user.id,
    fullName: user.fullName ?? '',
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    passwordHash: '',
    userCategory: user.userCategory ?? 'CUSTOMER',
    status: user.status ?? 'active',
    memberLevel: user.memberLevel ?? 'bronze',
    gender: user.gender ?? '',
    dateOfBirth: user.dateOfBirth ?? '',
    avatarUrl: user.avatarUrl ?? '',
    loyaltyPoints: user.loyaltyPoints?.toString() ?? '',
    totalSpent: user.totalSpent?.toString() ?? '',
    roleCodes: user.roles ?? (user.role ? [user.role] : []),
  }
}

function toRoleForm(role: Role): RoleFormState {
  return {
    id: role.id,
    code: role.code ?? '',
    name: role.name ?? '',
    description: role.description ?? '',
    roleScope: role.roleScope ?? 'BACKOFFICE',
    hierarchyLevel: role.hierarchyLevel?.toString() ?? '100',
    isSystemRole: Boolean(role.isSystemRole),
    isActive: role.isActive !== false,
  }
}

function PageGate({
  accessContext,
  pageId,
  children,
}: {
  accessContext: UserAccessContext | null
  pageId: SystemPageId
  children: (accessContext: UserAccessContext) => ReactElement
}) {
  const page = getManagementNavItem(pageId)

  if (!page) {
    return <Navigate to="/management/dashboard" replace />
  }

  if (!accessContext) {
    return (
      <div className="mgmt-page">
        <section className="mgmt-module-shell">
          <p className="mgmt-kicker">ĐANG TẢI</p>
          <h2>Đang kiểm tra quyền truy cập</h2>
          <p>Hệ thống đang lấy quyền hiệu lực của tài khoản hiện tại.</p>
        </section>
      </div>
    )
  }

  if (
    !canAccessManagementItem(
      page,
      accessContext.permissions ?? [],
      Boolean(accessContext.isSuperAdmin),
    )
  ) {
    return (
      <div className="mgmt-page">
        <section className="mgmt-module-shell">
          <p className="mgmt-kicker">KHÔNG CÓ QUYỀN</p>
          <h2>Bạn không có quyền truy cập trang này</h2>
          <p>Vui lòng dùng tài khoản có quyền phù hợp hoặc liên hệ quản trị viên.</p>
        </section>
      </div>
    )
  }

  return children(accessContext)
}

function UsersManagementPage({ accessContext }: { accessContext: UserAccessContext }) {
  const [query, setQuery] = useState<UsersQueryState>({
    keyword: '',
    status: '',
    roleCode: '',
    memberLevel: '',
  })
  const [users, setUsers] = useState<AdminUser[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [workingUserId, setWorkingUserId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState<UserFormState>(() => createEmptyUserForm())

  const canCreate = canUsePermission(accessContext, 'user.create')
  const canUpdate = canUsePermission(accessContext, 'user.update')
  const canDeactivate =
    canUsePermission(accessContext, 'user.block') ||
    canUsePermission(accessContext, 'user.delete')
  const editing = Boolean(form.id)
  const activeUserCount = users.filter((user) => !isInactiveUser(user)).length

  const loadData = async (nextPage = page) => {
    setLoading(true)
    setMessage('')

    try {
      const [userPage, roleList] = await Promise.all([
        systemAdminApi.getUsers({
          page: nextPage,
          size: 12,
          keyword: query.keyword.trim() || undefined,
          status: query.status || undefined,
          roleCode: query.roleCode || undefined,
          memberLevel: query.memberLevel || undefined,
          sortBy: 'createdAt',
          sortDir: 'desc',
        }),
        systemAdminApi.getRoles(),
      ])

      setUsers(userPage.content ?? [])
      setRoles(roleList)
      setPage(userPage.page)
      setTotalPages(Math.max(userPage.totalPages, 1))
      setTotalElements(userPage.totalElements)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải danh sách người dùng.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData(0)
  }, [])

  const updateForm = (patch: Partial<UserFormState>) => {
    setForm((current) => ({ ...current, ...patch }))
  }

  const toggleUserRole = (roleCode: string) => {
    setForm((current) => ({
      ...current,
      roleCodes: current.roleCodes.includes(roleCode)
        ? current.roleCodes.filter((code) => code !== roleCode)
        : [...current.roleCodes, roleCode],
    }))
  }

  const startCreate = () => {
    setMessage('')
    setForm(createEmptyUserForm())
  }

  const startEdit = (user: AdminUser) => {
    setMessage('')
    setForm(toUserForm(user))
  }

  const saveUser = async () => {
    if ((editing && !canUpdate) || (!editing && !canCreate)) {
      setMessage('Bạn chưa có quyền thực hiện thao tác này.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      if (editing && form.id) {
        const updated = await systemAdminApi.updateUser(form.id, buildUpdateUserPayload(form))
        setUsers((current) =>
          current.map((user) => (user.id === updated.id ? updated : user)),
        )
        setForm(toUserForm(updated))
        setMessage('Đã cập nhật người dùng.')
      } else {
        const created = await systemAdminApi.createUser(buildCreateUserPayload(form))
        setUsers((current) => [created, ...current].slice(0, 12))
        setForm(toUserForm(created))
        setTotalElements((current) => current + 1)
        setMessage('Đã tạo người dùng mới.')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu người dùng.')
    } finally {
      setSaving(false)
    }
  }

  const deactivateUser = async (user: AdminUser) => {
    if (!canDeactivate) {
      setMessage('Bạn chưa có quyền khóa người dùng.')
      return
    }

    setWorkingUserId(user.id)
    setMessage('')

    try {
      const updated = await systemAdminApi.deactivateUser(user.id)
      setUsers((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      if (form.id === updated.id) {
        setForm(toUserForm(updated))
      }
      setMessage('Đã khóa người dùng.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể khóa người dùng.')
    } finally {
      setWorkingUserId(null)
    }
  }

  return (
    <div className="mgmt-page">
      <section className="mgmt-crud-shell">
        <header className="mgmt-crud-head">
          <div>
            <p className="mgmt-kicker">NGƯỜI DÙNG</p>
            <h2>Quản lý tài khoản và vai trò</h2>
            <p>
              Tìm kiếm, tạo mới, cập nhật hồ sơ và khóa tài khoản theo đúng quyền
              được backend cấp cho người dùng hiện tại.
            </p>
          </div>

          <div className="mgmt-crud-summary">
            <span>
              <UsersRound aria-hidden="true" />
              {activeUserCount}/{users.length} đang hoạt động
            </span>
            <span>
              <KeyRound aria-hidden="true" />
              {roles.length} vai trò
            </span>
            <span>
              <ListChecks aria-hidden="true" />
              {totalElements} tài khoản
            </span>
          </div>
        </header>

        <div className="mgmt-crud-toolbar">
          <label className="mgmt-crud-search">
            <Search aria-hidden="true" />
            <input
              value={query.keyword}
              onChange={(event) => setQuery((current) => ({ ...current, keyword: event.target.value }))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void loadData(0)
                }
              }}
              placeholder="Tìm theo tên, email hoặc số điện thoại"
            />
          </label>

          <select
            value={query.status}
            onChange={(event) => setQuery((current) => ({ ...current, status: event.target.value }))}
            aria-label="Lọc trạng thái"
          >
            {userStatusOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={query.roleCode}
            onChange={(event) => setQuery((current) => ({ ...current, roleCode: event.target.value }))}
            aria-label="Lọc vai trò"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => (
              <option value={role.code ?? ''} key={role.id}>
                {role.name || role.code}
              </option>
            ))}
          </select>

          <select
            value={query.memberLevel}
            onChange={(event) => setQuery((current) => ({ ...current, memberLevel: event.target.value }))}
            aria-label="Lọc hạng thành viên"
          >
            {memberLevelOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button type="button" onClick={() => void loadData(0)} disabled={loading}>
            <RefreshCcw aria-hidden="true" />
            Tải lại
          </button>

          {canCreate && (
            <button type="button" onClick={startCreate}>
              <UserPlus aria-hidden="true" />
              Tạo mới
            </button>
          )}
        </div>

        <div className="mgmt-crud-workspace">
          <article className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>Danh sách tài khoản</h3>
              <p>Trang {page + 1}/{totalPages}, sắp xếp theo thời gian tạo mới nhất.</p>
            </div>

            {loading ? (
              <p className="mgmt-crud-empty">Đang tải danh sách người dùng...</p>
            ) : users.length > 0 ? (
              <div className="mgmt-crud-user-list">
                {users.map((user) => (
                  <article className="mgmt-crud-user-row" key={user.id}>
                    <div className="mgmt-system-avatar">
                      {getInitials(getUserDisplayName(user)) || 'U'}
                    </div>
                    <div>
                      <strong>{getUserDisplayName(user)}</strong>
                      <small>{user.email || user.phone || user.id}</small>
                    </div>
                    <span>{user.roles?.join(', ') || user.role || 'Chưa có vai trò'}</span>
                    <em>{labelFor(memberLevelOptions, user.memberLevel)}</em>
                    <b className={`mgmt-status-chip status-${user.status ?? 'unknown'}`}>
                      {labelFor(userStatusOptions, user.status)}
                    </b>
                    <div className="mgmt-row-actions">
                      <button type="button" onClick={() => startEdit(user)} disabled={!canUpdate}>
                        <Edit3 aria-hidden="true" />
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => void deactivateUser(user)}
                        disabled={!canDeactivate || isInactiveUser(user) || workingUserId === user.id}
                      >
                        <UserMinus aria-hidden="true" />
                        Khóa
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mgmt-crud-empty">Không có người dùng phù hợp.</p>
            )}

            <div className="mgmt-crud-pagination">
              <button
                type="button"
                onClick={() => void loadData(Math.max(page - 1, 0))}
                disabled={loading || page <= 0}
              >
                Trước
              </button>
              <span>{page + 1}/{totalPages}</span>
              <button
                type="button"
                onClick={() => void loadData(Math.min(page + 1, totalPages - 1))}
                disabled={loading || page >= totalPages - 1}
              >
                Sau
              </button>
            </div>
          </article>

          <aside className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>{editing ? 'Cập nhật người dùng' : 'Tạo người dùng'}</h3>
              <p>
                Khi tạo mới cần nhập mật khẩu tối thiểu 8 ký tự. Khi cập nhật có
                thể để trống mật khẩu để giữ nguyên.
              </p>
            </div>

            <div className="mgmt-crud-form">
              <label>
                <span>Họ và tên</span>
                <input value={form.fullName} onChange={(event) => updateForm({ fullName: event.target.value })} />
              </label>
              <label>
                <span>Tên hiển thị</span>
                <input value={form.displayName} onChange={(event) => updateForm({ displayName: event.target.value })} />
              </label>
              <label>
                <span>Email</span>
                <input value={form.email} onChange={(event) => updateForm({ email: event.target.value })} />
              </label>
              <label>
                <span>Số điện thoại</span>
                <input value={form.phone} onChange={(event) => updateForm({ phone: event.target.value })} />
              </label>
              <label>
                <span>Mật khẩu</span>
                <input
                  type="password"
                  value={form.passwordHash}
                  onChange={(event) => updateForm({ passwordHash: event.target.value })}
                  placeholder={editing ? 'Để trống nếu không đổi' : 'Tối thiểu 8 ký tự'}
                />
              </label>
              <label>
                <span>Nhóm tài khoản</span>
                <select value={form.userCategory} onChange={(event) => updateForm({ userCategory: event.target.value })}>
                  {userCategoryOptions.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Trạng thái</span>
                <select value={form.status} onChange={(event) => updateForm({ status: event.target.value })}>
                  {userStatusOptions.slice(1).map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Hạng thành viên</span>
                <select value={form.memberLevel} onChange={(event) => updateForm({ memberLevel: event.target.value })}>
                  {memberLevelOptions.slice(1).map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Giới tính</span>
                <select value={form.gender} onChange={(event) => updateForm({ gender: event.target.value })}>
                  {genderOptions.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Ngày sinh</span>
                <input type="date" value={form.dateOfBirth} onChange={(event) => updateForm({ dateOfBirth: event.target.value })} />
              </label>
              <label>
                <span>Điểm tích lũy</span>
                <input value={form.loyaltyPoints} onChange={(event) => updateForm({ loyaltyPoints: event.target.value })} />
              </label>
              <label>
                <span>Tổng chi tiêu</span>
                <input value={form.totalSpent} onChange={(event) => updateForm({ totalSpent: event.target.value })} />
              </label>
              <label className="mgmt-crud-wide">
                <span>Avatar URL</span>
                <input value={form.avatarUrl} onChange={(event) => updateForm({ avatarUrl: event.target.value })} />
              </label>

              <div className="mgmt-crud-wide mgmt-checkbox-cloud">
                <span>Vai trò</span>
                {roles.map((role) => (
                  <label key={role.id}>
                    <input
                      type="checkbox"
                      checked={Boolean(role.code && form.roleCodes.includes(role.code))}
                      onChange={() => role.code && toggleUserRole(role.code)}
                    />
                    {role.name || role.code}
                  </label>
                ))}
              </div>

              <div className="mgmt-crud-actions mgmt-crud-wide">
                <button type="button" onClick={() => void saveUser()} disabled={saving || (editing ? !canUpdate : !canCreate)}>
                  <Save aria-hidden="true" />
                  {saving ? 'Đang lưu...' : 'Lưu người dùng'}
                </button>
                <button type="button" onClick={startCreate}>
                  <X aria-hidden="true" />
                  Làm mới form
                </button>
              </div>
            </div>
          </aside>
        </div>

        {message && <p className="mgmt-crud-message">{message}</p>}
      </section>
    </div>
  )
}

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

function PermissionsManagementPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [keyword, setKeyword] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadPermissions = async () => {
    setLoading(true)
    setMessage('')

    try {
      setPermissions(await systemAdminApi.getPermissions())
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải danh sách quyền.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPermissions()
  }, [])

  const modules = useMemo(
    () =>
      Array.from(new Set(permissions.map((permission) => permission.moduleName || 'Khác')))
        .sort((left, right) => left.localeCompare(right, 'vi')),
    [permissions],
  )

  const filteredPermissions = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return permissions.filter((permission) => {
      const moduleName = permission.moduleName || 'Khác'
      const activeMatches =
        !activeFilter ||
        (activeFilter === 'active' && permission.isActive !== false) ||
        (activeFilter === 'inactive' && permission.isActive === false)
      const moduleMatches = !moduleFilter || moduleName === moduleFilter
      const keywordMatches =
        !normalizedKeyword ||
        [permission.code, permission.name, permission.description, permission.actionName]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedKeyword))

      return activeMatches && moduleMatches && keywordMatches
    })
  }, [activeFilter, keyword, moduleFilter, permissions])

  const activeCount = permissions.filter((permission) => permission.isActive !== false).length

  return (
    <div className="mgmt-page">
      <section className="mgmt-crud-shell">
        <header className="mgmt-crud-head">
          <div>
            <p className="mgmt-kicker">QUYỀN</p>
            <h2>Tra cứu permission backend</h2>
            <p>
              Trang này chỉ đọc dữ liệu quyền. Việc tạo permission nên được seed và
              review ở backend để tránh lệch policy bảo mật.
            </p>
          </div>

          <div className="mgmt-crud-summary">
            <span>
              <ShieldCheck aria-hidden="true" />
              {activeCount} quyền đang bật
            </span>
            <span>
              <ListChecks aria-hidden="true" />
              {permissions.length} tổng quyền
            </span>
            <span>
              <KeyRound aria-hidden="true" />
              {modules.length} module
            </span>
          </div>
        </header>

        <div className="mgmt-crud-toolbar">
          <label className="mgmt-crud-search">
            <Search aria-hidden="true" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo mã quyền, tên quyền hoặc mô tả"
            />
          </label>

          <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} aria-label="Lọc module">
            <option value="">Tất cả module</option>
            {modules.map((moduleName) => (
              <option value={moduleName} key={moduleName}>
                {moduleName}
              </option>
            ))}
          </select>

          <select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} aria-label="Lọc trạng thái quyền">
            {permissionActiveOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button type="button" onClick={() => void loadPermissions()} disabled={loading}>
            <RefreshCcw aria-hidden="true" />
            Tải lại
          </button>
        </div>

        <article className="mgmt-crud-panel">
          <div className="mgmt-section-title">
            <h3>Danh sách quyền</h3>
            <p>Hiển thị {filteredPermissions.length}/{permissions.length} quyền theo bộ lọc hiện tại.</p>
          </div>

          {loading ? (
            <p className="mgmt-crud-empty">Đang tải danh sách quyền...</p>
          ) : filteredPermissions.length > 0 ? (
            <div className="mgmt-permission-table">
              {filteredPermissions.map((permission) => (
                <article className="mgmt-permission-row" key={permission.id}>
                  <span>{permission.moduleName || 'Khác'}</span>
                  <div>
                    <strong>{permission.name || permission.code}</strong>
                    <small>{permission.description || permission.actionName || '-'}</small>
                  </div>
                  <code>{permission.code}</code>
                  <b className={permission.isActive === false ? 'inactive' : ''}>
                    {permission.isActive === false ? 'Đang tắt' : 'Đang bật'}
                  </b>
                  <time>{formatDate(permission.createdAt)}</time>
                </article>
              ))}
            </div>
          ) : (
            <p className="mgmt-crud-empty">Không có quyền phù hợp.</p>
          )}
        </article>

        {message && <p className="mgmt-crud-message">{message}</p>}
      </section>
    </div>
  )
}

function ManagementSystemPage({ pageId }: ManagementSystemPageProps) {
  const { accessContext } = useOutletContext<ManagementOutletContext>()

  return (
    <PageGate accessContext={accessContext} pageId={pageId}>
      {(checkedAccessContext) => {
        if (pageId === 'users') {
          return <UsersManagementPage accessContext={checkedAccessContext} />
        }

        if (pageId === 'roles') {
          return <RolesManagementPage accessContext={checkedAccessContext} />
        }

        return <PermissionsManagementPage />
      }}
    </PageGate>
  )
}

export default ManagementSystemPage
