import { useEffect, useState } from 'react'
import {
  Edit3,
  KeyRound,
  ListChecks,
  RefreshCcw,
  Save,
  Search,
  UserMinus,
  UserPlus,
  UsersRound,
  X,
} from 'lucide-react'
import { systemAdminApi, type AdminUser, type Role } from '../../../../api/server/SystemAdmin.api'
import type { UserAccessContext } from '../../../auth/api/authApi'
import {
  buildCreateUserPayload,
  buildUpdateUserPayload,
  canUsePermission,
  createEmptyUserForm,
  genderOptions,
  getInitials,
  getUserDisplayName,
  isInactiveUser,
  labelFor,
  memberLevelOptions,
  toUserForm,
  type UserFormState,
  type UsersQueryState,
  userCategoryOptions,
  userStatusOptions,
} from './systemShared'

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

export default UsersManagementPage
