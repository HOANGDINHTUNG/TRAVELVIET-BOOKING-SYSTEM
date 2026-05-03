import { useEffect, useMemo, useState } from 'react'
import {
  KeyRound,
  ListChecks,
  RefreshCcw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { systemAdminApi, type Permission } from '../../../../api/server/SystemAdmin.api'
import {
  formatDate,
  permissionActiveOptions,
} from './systemShared'

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

export default PermissionsManagementPage
