import { useEffect, useMemo, useState } from 'react'
import {
  LifeBuoy,
  MessageSquare,
  RefreshCcw,
  Save,
  Search,
  Send,
  UserCheck,
} from 'lucide-react'
import { Navigate, useOutletContext } from 'react-router-dom'
import {
  supportApi,
  type SupportMessage,
  type SupportSession,
  type SupportSessionStatus,
} from '../../../api/server/Support.api'
import type { UserAccessContext } from '../../auth/api/authApi'
import {
  canAccessManagementItem,
  getManagementNavItem,
} from '../config/managementNavigation'

type ManagementOutletContext = {
  accessContext: UserAccessContext | null
}

type SupportQueryState = {
  status: string
  userId: string
  assignedStaffId: string
}

const supportStatusOptions: Array<{ value: SupportSessionStatus; label: string }> = [
  { value: 'open', label: 'Mới mở' },
  { value: 'waiting_staff', label: 'Chờ staff' },
  { value: 'waiting_customer', label: 'Chờ khách' },
  { value: 'resolved', label: 'Đã xử lý' },
  { value: 'closed', label: 'Đã đóng' },
]

function canUsePermission(accessContext: UserAccessContext, permission: string) {
  return (
    Boolean(accessContext.isSuperAdmin) ||
    (accessContext.permissions ?? []).includes(permission)
  )
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

function shortValue(value: string | undefined, fallback = '-') {
  if (!value) {
    return fallback
  }

  return value.length > 18 ? `${value.slice(0, 18)}...` : value
}

function labelForStatus(value: string | undefined) {
  return (
    supportStatusOptions.find((option) => option.value === value)?.label ??
    value ??
    '-'
  )
}

function sortMessages(messages: SupportMessage[] | undefined) {
  return [...(messages ?? [])].sort((left, right) => {
    const leftTime = new Date(left.createdAt ?? 0).getTime()
    const rightTime = new Date(right.createdAt ?? 0).getTime()
    return leftTime - rightTime
  })
}

function ManagementSupportPage() {
  const { accessContext } = useOutletContext<ManagementOutletContext>()
  const pageConfig = getManagementNavItem('support')
  const [query, setQuery] = useState<SupportQueryState>({
    status: '',
    userId: '',
    assignedStaffId: '',
  })
  const [sessions, setSessions] = useState<SupportSession[]>([])
  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [assignedStaffId, setAssignedStaffId] = useState('')
  const [nextStatus, setNextStatus] = useState<SupportSessionStatus>('open')
  const [replyText, setReplyText] = useState('')

  const hasPageAccess = Boolean(
    pageConfig &&
      accessContext &&
      canAccessManagementItem(
        pageConfig,
        accessContext.permissions ?? [],
        Boolean(accessContext.isSuperAdmin),
      ),
  )
  const canAssign = accessContext ? canUsePermission(accessContext, 'support.assign') : false
  const canReply = accessContext ? canUsePermission(accessContext, 'support.reply') : false

  const sessionStats = useMemo(() => {
    return sessions.reduce(
      (stats, session) => {
        stats.total += 1
        if (session.status === 'open' || session.status === 'waiting_staff') {
          stats.pending += 1
        }
        if (session.status === 'resolved' || session.status === 'closed') {
          stats.closed += 1
        }
        if (session.assignedStaffId) {
          stats.assigned += 1
        }
        return stats
      },
      { total: 0, pending: 0, closed: 0, assigned: 0 },
    )
  }, [sessions])

  const loadSessionDetail = async (id: number, preserveMessage = false) => {
    if (!hasPageAccess) {
      return
    }

    setDetailLoading(true)
    if (!preserveMessage) {
      setMessage('')
    }

    try {
      const detail = await supportApi.getSession(id)
      setSelectedSession(detail)
      setAssignedStaffId(detail.assignedStaffId ?? '')
      setNextStatus((detail.status as SupportSessionStatus) ?? 'open')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải chi tiết phiên hỗ trợ.')
    } finally {
      setDetailLoading(false)
    }
  }

  const loadSessions = async (preferredId?: number) => {
    if (!hasPageAccess) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const nextSessions = await supportApi.getSessions({
        status: (query.status || undefined) as SupportSessionStatus | undefined,
        userId: query.userId.trim() || undefined,
        assignedStaffId: query.assignedStaffId.trim() || undefined,
      })
      setSessions(nextSessions)

      const targetId = preferredId ?? selectedSession?.id ?? nextSessions[0]?.id

      if (targetId) {
        await loadSessionDetail(targetId, true)
      } else {
        setSelectedSession(null)
        setAssignedStaffId('')
        setReplyText('')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải danh sách phiên hỗ trợ.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasPageAccess) {
      void loadSessions()
    }
  }, [hasPageAccess])

  const selectSession = async (session: SupportSession) => {
    setSelectedSession(session)
    setAssignedStaffId(session.assignedStaffId ?? '')
    setNextStatus((session.status as SupportSessionStatus) ?? 'open')
    await loadSessionDetail(session.id, true)
  }

  const submitAssign = async () => {
    if (!selectedSession || !canAssign) {
      return
    }

    setSaving(true)
    setMessage('')

    try {
      await supportApi.assignSession(selectedSession.id, {
        assignedStaffId: assignedStaffId.trim() || undefined,
      })
      setMessage('Đã cập nhật người phụ trách phiên hỗ trợ.')
      await loadSessions(selectedSession.id)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể phân công phiên hỗ trợ.')
    } finally {
      setSaving(false)
    }
  }

  const submitStatus = async () => {
    if (!selectedSession || !canAssign) {
      return
    }

    setSaving(true)
    setMessage('')

    try {
      await supportApi.updateSessionStatus(selectedSession.id, {
        status: nextStatus,
      })
      setMessage('Đã cập nhật trạng thái phiên hỗ trợ.')
      await loadSessions(selectedSession.id)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái phiên hỗ trợ.')
    } finally {
      setSaving(false)
    }
  }

  const submitReply = async () => {
    if (!selectedSession || !canReply) {
      return
    }

    const content = replyText.trim()
    if (!content) {
      setMessage('Nội dung phản hồi không được để trống.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      await supportApi.sendReply(selectedSession.id, {
        messageText: content,
      })
      setReplyText('')
      setMessage('Đã gửi phản hồi cho khách hàng.')
      await loadSessionDetail(selectedSession.id, true)
      await loadSessions(selectedSession.id)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể gửi phản hồi.')
    } finally {
      setSaving(false)
    }
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
          <h2>Bạn không có quyền truy cập khu hỗ trợ</h2>
          <p>Chỉ tài khoản có quyền support.view mới được dùng trang này.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="mgmt-page">
      <section className="mgmt-crud-shell">
        <header className="mgmt-crud-head">
          <div>
            <p className="mgmt-kicker">HỖ TRỢ KHÁCH HÀNG</p>
            <h2>Điều phối phiên hỗ trợ theo thời gian thực</h2>
            <p>
              Tập trung danh sách hội thoại, phân công staff, chuyển trạng thái xử lý
              và trả lời trực tiếp từ trang quản trị.
            </p>
          </div>

          <div className="mgmt-crud-summary">
            <span>
              <LifeBuoy aria-hidden="true" />
              {sessionStats.total} phiên
            </span>
            <span>
              <MessageSquare aria-hidden="true" />
              {sessionStats.pending} cần theo dõi
            </span>
            <span>
              <UserCheck aria-hidden="true" />
              {sessionStats.assigned} đã phân công
            </span>
            <span>
              <RefreshCcw aria-hidden="true" />
              {sessionStats.closed} đã khép lại
            </span>
          </div>
        </header>

        <div className="mgmt-tour-toolbar">
          <label className="mgmt-crud-search">
            <Search aria-hidden="true" />
            <input
              value={query.userId}
              onChange={(event) => setQuery((current) => ({ ...current, userId: event.target.value }))}
              placeholder="Lọc theo user ID của khách"
            />
          </label>
          <label>
            <span>Trạng thái</span>
            <select
              value={query.status}
              onChange={(event) => setQuery((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="">Tất cả trạng thái</option>
              {supportStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Staff phụ trách</span>
            <input
              value={query.assignedStaffId}
              onChange={(event) =>
                setQuery((current) => ({ ...current, assignedStaffId: event.target.value }))
              }
              placeholder="UUID nhân sự"
            />
          </label>
          <button type="button" onClick={() => void loadSessions()} disabled={loading}>
            <RefreshCcw aria-hidden="true" />
            Tải lại
          </button>
        </div>

        <div className="mgmt-tour-layout">
          <article className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>Danh sách phiên hỗ trợ</h3>
              <p>Chọn một phiên để xem lịch sử và xử lý tiếp.</p>
            </div>

            {loading ? (
              <p className="mgmt-crud-empty">Đang tải phiên hỗ trợ...</p>
            ) : sessions.length > 0 ? (
              <div className="mgmt-support-list">
                {sessions.map((session) => (
                  <button
                    type="button"
                    key={session.id}
                    className={selectedSession?.id === session.id ? 'active' : ''}
                    onClick={() => void selectSession(session)}
                  >
                    <div>
                      <strong>{session.sessionCode || `Phiên #${session.id}`}</strong>
                      <small>
                        User {shortValue(session.userId)} · Staff {shortValue(session.assignedStaffId, 'chưa gán')}
                      </small>
                    </div>
                    <span>{labelForStatus(session.status)}</span>
                    <em>{session.messageCount ?? 0} tin</em>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mgmt-crud-empty">Không có phiên hỗ trợ phù hợp.</p>
            )}
          </article>

          <aside className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>Chi tiết xử lý</h3>
              <p>Chi tiết phiên, nhật ký trao đổi và thao tác điều phối.</p>
            </div>

            {detailLoading ? (
              <p className="mgmt-crud-empty">Đang tải chi tiết phiên hỗ trợ...</p>
            ) : selectedSession ? (
              <>
                <div className="mgmt-support-meta">
                  <div>
                    <span>Mã phiên</span>
                    <strong>{selectedSession.sessionCode || `#${selectedSession.id}`}</strong>
                  </div>
                  <div>
                    <span>Trạng thái</span>
                    <strong>{labelForStatus(selectedSession.status)}</strong>
                  </div>
                  <div>
                    <span>Khách hàng</span>
                    <strong>{selectedSession.userId || '-'}</strong>
                  </div>
                  <div>
                    <span>Staff phụ trách</span>
                    <strong>{selectedSession.assignedStaffId || 'Chưa phân công'}</strong>
                  </div>
                  <div>
                    <span>Cập nhật cuối</span>
                    <strong>{formatDateTime(selectedSession.updatedAt || selectedSession.lastMessageAt)}</strong>
                  </div>
                  <div>
                    <span>Đánh giá sau hỗ trợ</span>
                    <strong>
                      {selectedSession.rating ? `${selectedSession.rating}/5` : 'Chưa có'}
                    </strong>
                  </div>
                </div>

                {selectedSession.feedback && (
                  <div className="mgmt-tour-current">
                    <strong>Phản hồi của khách</strong>
                    <small>{selectedSession.feedback}</small>
                  </div>
                )}

                <div className="mgmt-support-actions">
                  <label>
                    <span>Gán staff xử lý</span>
                    <input
                      value={assignedStaffId}
                      onChange={(event) => setAssignedStaffId(event.target.value)}
                      placeholder="UUID nhân sự phụ trách"
                    />
                  </label>
                  <button type="button" onClick={() => void submitAssign()} disabled={saving || !canAssign}>
                    <UserCheck aria-hidden="true" />
                    Lưu phân công
                  </button>
                  <label>
                    <span>Chuyển trạng thái</span>
                    <select
                      value={nextStatus}
                      onChange={(event) => setNextStatus(event.target.value as SupportSessionStatus)}
                    >
                      {supportStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" onClick={() => void submitStatus()} disabled={saving || !canAssign}>
                    <Save aria-hidden="true" />
                    Cập nhật trạng thái
                  </button>
                </div>

                <div className="mgmt-support-thread">
                  {sortMessages(selectedSession.messages).map((item) => (
                    <article
                      key={item.id}
                      className={item.senderType?.toLowerCase() === 'staff' ? 'is-staff' : 'is-user'}
                    >
                      <header>
                        <strong>
                          {item.senderType?.toLowerCase() === 'staff' ? 'Nhân sự hỗ trợ' : 'Khách hàng'}
                        </strong>
                        <span>{formatDateTime(item.createdAt)}</span>
                      </header>
                      <p>{item.messageText}</p>
                      {item.attachmentUrl && <small>{item.attachmentUrl}</small>}
                    </article>
                  ))}
                  {(!selectedSession.messages || selectedSession.messages.length === 0) && (
                    <p className="mgmt-crud-empty">Phiên này chưa có tin nhắn.</p>
                  )}
                </div>

                <div className="mgmt-support-compose">
                  <label>
                    <span>Phản hồi cho khách hàng</span>
                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      placeholder="Nhập nội dung phản hồi..."
                    />
                  </label>
                  <button type="button" onClick={() => void submitReply()} disabled={saving || !canReply}>
                    <Send aria-hidden="true" />
                    Gửi phản hồi
                  </button>
                </div>
              </>
            ) : (
              <p className="mgmt-crud-empty">Chọn một phiên hỗ trợ để xem chi tiết.</p>
            )}
          </aside>
        </div>

        {message && <p className="mgmt-crud-message">{message}</p>}
      </section>
    </div>
  )
}

export default ManagementSupportPage
