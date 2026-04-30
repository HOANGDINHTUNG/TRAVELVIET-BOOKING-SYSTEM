import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Inbox,
  MessageSquareReply,
  RefreshCcw,
  Send,
  UserCheck,
} from 'lucide-react'
import {
  supportApi,
  type SupportMessage,
  type SupportSession,
  type SupportSessionStatus,
} from '../../../api/server/Support.api'
import { getStoredAuthUser } from '../../auth/api/authApi'

const supportStatuses: SupportSessionStatus[] = [
  'open',
  'waiting_staff',
  'waiting_customer',
  'resolved',
  'closed',
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

function getLatestMessage(session: SupportSession) {
  const messages = session.messages ?? []
  return messages[messages.length - 1]?.messageText || 'Chua co noi dung trong response.'
}

function getSenderLabel(message: SupportMessage) {
  const senderType = message.senderType?.toLowerCase()
  if (senderType === 'customer') {
    return 'Khach'
  }
  if (senderType === 'staff') {
    return 'Nhan vien'
  }
  return 'He thong'
}

export default function SupportOperationsPanel() {
  const currentUser = getStoredAuthUser()
  const [sessions, setSessions] = useState<SupportSession[]>([])
  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [nextStatus, setNextStatus] = useState<SupportSessionStatus>('waiting_customer')
  const [replyText, setReplyText] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')

  const openCount = useMemo(
    () =>
      sessions.filter((session) =>
        ['open', 'waiting_staff'].includes(session.status?.toLowerCase() ?? ''),
      ).length,
    [sessions],
  )

  const loadSessions = async (preferredSessionId?: number) => {
    setLoading(true)
    setMessage('')

    try {
      const data = await supportApi.getSessions({
        status: statusFilter || undefined,
      })
      setSessions(data)

      const nextSelected =
        data.find((session) => session.id === preferredSessionId) ?? data[0] ?? null

      if (nextSelected) {
        const detail = await supportApi.getSession(nextSelected.id)
        setSelectedSession(detail)
        setNextStatus(detail.status || 'waiting_customer')
      } else {
        setSelectedSession(null)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the tai support sessions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSessions(selectedSession?.id)
  }, [statusFilter])

  const selectSession = async (sessionId: number) => {
    setDetailLoading(true)
    setMessage('')

    try {
      const detail = await supportApi.getSession(sessionId)
      setSelectedSession(detail)
      setNextStatus(detail.status || 'waiting_customer')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the tai chi tiet support.')
    } finally {
      setDetailLoading(false)
    }
  }

  const claimSession = async () => {
    if (!selectedSession || !currentUser?.id) {
      return
    }

    setWorking(true)
    setMessage('')

    try {
      const updated = await supportApi.assignSession(selectedSession.id, {
        assignedStaffId: currentUser.id,
      })
      setSelectedSession(updated)
      setNextStatus(updated.status || nextStatus)
      await loadSessions(updated.id)
      setMessage('Da gan session cho tai khoan hien tai.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the gan support session.')
    } finally {
      setWorking(false)
    }
  }

  const updateStatus = async () => {
    if (!selectedSession) {
      return
    }

    setWorking(true)
    setMessage('')

    try {
      const updated = await supportApi.updateSessionStatus(selectedSession.id, {
        status: nextStatus,
      })
      setSelectedSession(updated)
      await loadSessions(updated.id)
      setMessage('Da cap nhat trang thai support.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the cap nhat trang thai.')
    } finally {
      setWorking(false)
    }
  }

  const sendReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedSession || !replyText.trim()) {
      return
    }

    setWorking(true)
    setMessage('')

    try {
      await supportApi.sendReply(selectedSession.id, {
        messageText: replyText.trim(),
        attachmentUrl: attachmentUrl.trim() || undefined,
      })
      const detail = await supportApi.getSession(selectedSession.id)
      setSelectedSession(detail)
      setReplyText('')
      setAttachmentUrl('')
      await loadSessions(detail.id)
      setMessage('Da gui phan hoi cho khach.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the gui phan hoi.')
    } finally {
      setWorking(false)
    }
  }

  const messages = selectedSession?.messages ?? []

  return (
    <section className="mgmt-support-desk" id="support-desk">
      <header className="mgmt-support-head">
        <div>
          <p className="mgmt-kicker">SUPPORT DESK</p>
          <h3>Xu ly support session truc tiep</h3>
          <p>
            Dung cac API admin support de xem queue, nhan session, doi trang thai
            va phan hoi khach tu man hinh quan tri.
          </p>
        </div>
        <div className="mgmt-support-summary">
          <strong>{sessions.length}</strong>
          <span>{openCount} dang cho xu ly</span>
        </div>
      </header>

      <div className="mgmt-support-toolbar">
        <label>
          <span>Loc trang thai</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">Tat ca</option>
            {supportStatuses.map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => void loadSessions(selectedSession?.id)} disabled={loading}>
          <RefreshCcw aria-hidden="true" />
          Tai lai
        </button>
      </div>

      <div className="mgmt-support-layout">
        <aside className="mgmt-support-list" aria-label="Support sessions">
          {loading ? (
            <p className="mgmt-support-empty">Dang tai support sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="mgmt-support-empty">Khong co session phu hop.</p>
          ) : (
            sessions.map((session) => (
              <button
                className={selectedSession?.id === session.id ? 'is-active' : ''}
                type="button"
                key={session.id}
                onClick={() => void selectSession(session.id)}
              >
                <Inbox aria-hidden="true" />
                <span>
                  <strong>{session.sessionCode || `#${session.id}`}</strong>
                  <small>{session.status || 'open'} · {formatDate(session.lastMessageAt)}</small>
                  <em>{getLatestMessage(session)}</em>
                </span>
              </button>
            ))
          )}
        </aside>

        <article className="mgmt-support-detail">
          {!selectedSession ? (
            <p className="mgmt-support-empty">Chon mot session de xu ly.</p>
          ) : detailLoading ? (
            <p className="mgmt-support-empty">Dang tai hoi thoai...</p>
          ) : (
            <>
              <div className="mgmt-support-detail-head">
                <div>
                  <h4>{selectedSession.sessionCode || `Session #${selectedSession.id}`}</h4>
                  <p>
                    User {selectedSession.userId || '-'} · Staff{' '}
                    {selectedSession.assignedStaffId || 'chua gan'}
                  </p>
                </div>
                <span>{selectedSession.status}</span>
              </div>

              <div className="mgmt-support-actions">
                <button
                  type="button"
                  onClick={() => void claimSession()}
                  disabled={working || !currentUser?.id}
                >
                  <UserCheck aria-hidden="true" />
                  Nhan session
                </button>
                <label>
                  <span>Doi trang thai</span>
                  <select
                    value={nextStatus}
                    onChange={(event) => setNextStatus(event.target.value)}
                  >
                    {supportStatuses.map((status) => (
                      <option value={status} key={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={() => void updateStatus()} disabled={working}>
                  Cap nhat
                </button>
              </div>

              <div className="mgmt-support-messages">
                {messages.length === 0 ? (
                  <p className="mgmt-support-empty">Chua co tin nhan.</p>
                ) : (
                  messages.map((item) => (
                    <article
                      className={
                        item.senderType?.toLowerCase() === 'staff'
                          ? 'is-staff'
                          : 'is-customer'
                      }
                      key={item.id}
                    >
                      <span>{getSenderLabel(item)}</span>
                      <p>{item.messageText}</p>
                      {item.attachmentUrl && (
                        <a href={item.attachmentUrl} target="_blank" rel="noreferrer">
                          {item.attachmentUrl}
                        </a>
                      )}
                      <small>{formatDate(item.createdAt)}</small>
                    </article>
                  ))
                )}
              </div>

              <form className="mgmt-support-reply" onSubmit={sendReply}>
                <label>
                  <span>Phan hoi</span>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    disabled={working}
                  />
                </label>
                <label>
                  <span>Link dinh kem</span>
                  <input
                    value={attachmentUrl}
                    onChange={(event) => setAttachmentUrl(event.target.value)}
                    disabled={working}
                  />
                </label>
                <button type="submit" disabled={working || !replyText.trim()}>
                  <Send aria-hidden="true" />
                  Gui phan hoi
                </button>
              </form>
            </>
          )}

          {message && (
            <p className="mgmt-support-message">
              <MessageSquareReply aria-hidden="true" />
              {message}
            </p>
          )}
        </article>
      </div>
    </section>
  )
}
