import { useEffect, useMemo, useState } from 'react'
import {
  CalendarClock,
  Database,
  Eye,
  FileClock,
  Fingerprint,
  RefreshCcw,
  Search,
  ShieldAlert,
  UserRound,
} from 'lucide-react'
import { Navigate, useOutletContext } from 'react-router-dom'
import {
  systemAdminApi,
  type AuditLog,
} from '../../../api/server/SystemAdmin.api'
import type { UserAccessContext } from '../../auth/api/authApi'
import {
  canAccessManagementItem,
  getManagementNavItem,
} from '../config/managementNavigation'

type ManagementOutletContext = {
  accessContext: UserAccessContext | null
}

type AuditQueryState = {
  actorUserId: string
  actionName: string
  entityName: string
  entityId: string
  from: string
  to: string
}

function formatDateTime(value: string | undefined) {
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

function toApiDateTime(value: string) {
  if (!value) {
    return undefined
  }

  return value.length === 16 ? `${value}:00` : value
}

function stringifyPayload(value: unknown) {
  if (value === undefined || value === null) {
    return 'Không có dữ liệu.'
  }

  if (typeof value === 'string') {
    return value
  }

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function shortValue(value: string | undefined, fallback = '-') {
  if (!value) {
    return fallback
  }

  return value.length > 18 ? `${value.slice(0, 18)}...` : value
}

function ManagementAuditPage() {
  const { accessContext } = useOutletContext<ManagementOutletContext>()
  const pageConfig = getManagementNavItem('audit-logs')
  const [query, setQuery] = useState<AuditQueryState>({
    actorUserId: '',
    actionName: '',
    entityName: '',
    entityId: '',
    from: '',
    to: '',
  })
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const uniqueActors = useMemo(
    () => new Set(logs.map((log) => log.actorUserId).filter(Boolean)).size,
    [logs],
  )
  const uniqueActions = useMemo(
    () => new Set(logs.map((log) => log.actionName).filter(Boolean)).size,
    [logs],
  )
  const uniqueEntities = useMemo(
    () => new Set(logs.map((log) => log.entityName).filter(Boolean)).size,
    [logs],
  )
  const hasPageAccess = Boolean(
    pageConfig &&
      accessContext &&
      canAccessManagementItem(
        pageConfig,
        accessContext.permissions ?? [],
        Boolean(accessContext.isSuperAdmin),
      ),
  )

  const loadLogs = async (nextPage = page) => {
    if (!hasPageAccess) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await systemAdminApi.getAuditLogs({
        page: nextPage,
        size: 20,
        actorUserId: query.actorUserId.trim() || undefined,
        actionName: query.actionName.trim() || undefined,
        entityName: query.entityName.trim() || undefined,
        entityId: query.entityId.trim() || undefined,
        from: toApiDateTime(query.from),
        to: toApiDateTime(query.to),
      })

      const nextLogs = response.content ?? []
      setLogs(nextLogs)
      setSelectedLog((current) => {
        if (current && nextLogs.some((log) => log.id === current.id)) {
          return current
        }

        return nextLogs[0] ?? null
      })
      setPage(response.page)
      setTotalPages(Math.max(response.totalPages, 1))
      setTotalElements(response.totalElements)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải nhật ký audit.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasPageAccess) {
      void loadLogs(0)
    }
  }, [hasPageAccess])

  const updateQuery = (patch: Partial<AuditQueryState>) => {
    setQuery((current) => ({ ...current, ...patch }))
  }

  if (!pageConfig) {
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
      pageConfig,
      accessContext.permissions ?? [],
      Boolean(accessContext.isSuperAdmin),
    )
  ) {
    return (
      <div className="mgmt-page">
        <section className="mgmt-module-shell">
          <p className="mgmt-kicker">KHÔNG CÓ QUYỀN</p>
          <h2>Bạn không có quyền truy cập nhật ký audit</h2>
          <p>Chỉ tài khoản có quyền audit.view mới được xem khu vực này.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="mgmt-page">
      <section className="mgmt-crud-shell">
        <header className="mgmt-crud-head">
          <div>
            <p className="mgmt-kicker">NHẬT KÝ AUDIT</p>
            <h2>Theo dõi thao tác nhạy cảm</h2>
            <p>
              Trang này chỉ đọc dữ liệu audit log để phục vụ kiểm tra bảo mật,
              truy vết thay đổi vai trò, tài khoản và các thao tác quản trị.
            </p>
          </div>

          <div className="mgmt-crud-summary">
            <span>
              <FileClock aria-hidden="true" />
              {totalElements} bản ghi
            </span>
            <span>
              <UserRound aria-hidden="true" />
              {uniqueActors} actor
            </span>
            <span>
              <ShieldAlert aria-hidden="true" />
              {uniqueActions} action
            </span>
            <span>
              <Database aria-hidden="true" />
              {uniqueEntities} entity
            </span>
          </div>
        </header>

        <div className="mgmt-audit-toolbar">
          <label className="mgmt-crud-search">
            <Search aria-hidden="true" />
            <input
              value={query.actionName}
              onChange={(event) => updateQuery({ actionName: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void loadLogs(0)
                }
              }}
              placeholder="Lọc theo action, ví dụ USER_UPDATE"
            />
          </label>
          <label>
            <span>Actor user ID</span>
            <input
              value={query.actorUserId}
              onChange={(event) => updateQuery({ actorUserId: event.target.value })}
              placeholder="UUID người thao tác"
            />
          </label>
          <label>
            <span>Entity</span>
            <input
              value={query.entityName}
              onChange={(event) => updateQuery({ entityName: event.target.value })}
              placeholder="User, Role..."
            />
          </label>
          <label>
            <span>Entity ID</span>
            <input
              value={query.entityId}
              onChange={(event) => updateQuery({ entityId: event.target.value })}
              placeholder="ID đối tượng"
            />
          </label>
          <label>
            <span>Từ thời điểm</span>
            <input
              type="datetime-local"
              value={query.from}
              onChange={(event) => updateQuery({ from: event.target.value })}
            />
          </label>
          <label>
            <span>Đến thời điểm</span>
            <input
              type="datetime-local"
              value={query.to}
              onChange={(event) => updateQuery({ to: event.target.value })}
            />
          </label>
          <button type="button" onClick={() => void loadLogs(0)} disabled={loading}>
            <RefreshCcw aria-hidden="true" />
            Tải lại
          </button>
        </div>

        <div className="mgmt-audit-layout">
          <article className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>Dòng sự kiện</h3>
              <p>
                Trang {page + 1}/{totalPages}, đang hiển thị {logs.length} bản ghi.
              </p>
            </div>

            {loading ? (
              <p className="mgmt-crud-empty">Đang tải nhật ký audit...</p>
            ) : logs.length > 0 ? (
              <div className="mgmt-audit-list">
                {logs.map((log) => (
                  <button
                    type="button"
                    className={selectedLog?.id === log.id ? 'active' : ''}
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                  >
                    <ShieldAlert aria-hidden="true" />
                    <div>
                      <strong>{log.actionName || `Audit #${log.id}`}</strong>
                      <small>
                        {log.entityName || '-'} · {shortValue(log.entityId)}
                      </small>
                    </div>
                    <span>{shortValue(log.actorUserId, 'Không rõ actor')}</span>
                    <time>{formatDateTime(log.createdAt)}</time>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mgmt-crud-empty">Không có bản ghi audit phù hợp.</p>
            )}

            <div className="mgmt-crud-pagination">
              <button
                type="button"
                onClick={() => void loadLogs(Math.max(page - 1, 0))}
                disabled={loading || page <= 0}
              >
                Trước
              </button>
              <span>{page + 1}/{totalPages}</span>
              <button
                type="button"
                onClick={() => void loadLogs(Math.min(page + 1, totalPages - 1))}
                disabled={loading || page >= totalPages - 1}
              >
                Sau
              </button>
            </div>
          </article>

          <aside className="mgmt-crud-panel mgmt-audit-detail">
            <div className="mgmt-section-title">
              <h3>Chi tiết bản ghi</h3>
              <p>So sánh dữ liệu trước và sau để truy vết thay đổi.</p>
            </div>

            {selectedLog ? (
              <>
                <div className="mgmt-audit-meta">
                  <span>
                    <Fingerprint aria-hidden="true" />
                    #{selectedLog.id}
                  </span>
                  <span>
                    <CalendarClock aria-hidden="true" />
                    {formatDateTime(selectedLog.createdAt)}
                  </span>
                  <span>
                    <Database aria-hidden="true" />
                    {selectedLog.entityName || '-'}
                  </span>
                  <span>
                    <Eye aria-hidden="true" />
                    {selectedLog.ipAddress || 'Không có IP'}
                  </span>
                </div>

                <dl className="mgmt-audit-facts">
                  <div>
                    <dt>Action</dt>
                    <dd>{selectedLog.actionName || '-'}</dd>
                  </div>
                  <div>
                    <dt>Actor</dt>
                    <dd>{selectedLog.actorUserId || '-'}</dd>
                  </div>
                  <div>
                    <dt>Entity ID</dt>
                    <dd>{selectedLog.entityId || '-'}</dd>
                  </div>
                  <div>
                    <dt>User agent</dt>
                    <dd>{selectedLog.userAgent || '-'}</dd>
                  </div>
                </dl>

                <div className="mgmt-audit-diff">
                  <article>
                    <strong>Dữ liệu cũ</strong>
                    <pre>{stringifyPayload(selectedLog.oldData)}</pre>
                  </article>
                  <article>
                    <strong>Dữ liệu mới</strong>
                    <pre>{stringifyPayload(selectedLog.newData)}</pre>
                  </article>
                </div>
              </>
            ) : (
              <p className="mgmt-crud-empty">Chọn một bản ghi để xem chi tiết.</p>
            )}
          </aside>
        </div>

        {message && <p className="mgmt-crud-message">{message}</p>}
      </section>
    </div>
  )
}

export default ManagementAuditPage
