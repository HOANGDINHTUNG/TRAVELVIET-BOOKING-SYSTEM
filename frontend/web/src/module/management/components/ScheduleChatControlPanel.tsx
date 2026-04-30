import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  MessageCircle,
  Search,
  Send,
  Settings2,
  UserX,
} from 'lucide-react'
import {
  scheduleChatApi,
  type ScheduleChatMessage,
  type ScheduleChatRoom,
} from '../../../api/server/ScheduleChat.api'

type ScheduleChatControlPanelProps = {
  enableUpdate?: boolean
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

function getSenderName(message: ScheduleChatMessage) {
  return message.senderDisplayName || message.senderFullName || message.senderUserId || 'Member'
}

export default function ScheduleChatControlPanel({
  enableUpdate = true,
}: ScheduleChatControlPanelProps) {
  const [scheduleId, setScheduleId] = useState('')
  const [room, setRoom] = useState<ScheduleChatRoom | null>(null)
  const [messages, setMessages] = useState<ScheduleChatMessage[]>([])
  const [roomName, setRoomName] = useState('')
  const [visibility, setVisibility] = useState('all_members')
  const [isActive, setIsActive] = useState(true)
  const [messageText, setMessageText] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [working, setWorking] = useState('')
  const [notice, setNotice] = useState('')

  const numericScheduleId = Number(scheduleId)

  const canUseSchedule = Number.isFinite(numericScheduleId) && numericScheduleId > 0

  const loadRoom = async () => {
    if (!canUseSchedule) {
      setNotice('Schedule ID khong hop le.')
      return
    }

    setWorking('load')
    setNotice('')

    try {
      const [roomData, messagePage] = await Promise.all([
        scheduleChatApi.getAdminRoom(numericScheduleId),
        scheduleChatApi.getAdminMessages(numericScheduleId),
      ])
      setRoom(roomData)
      setMessages(messagePage.content ?? [])
      setRoomName(roomData.roomName || '')
      setVisibility(roomData.visibility || 'all_members')
      setIsActive(roomData.active !== false)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Khong the tai chat room.')
    } finally {
      setWorking('')
    }
  }

  const saveRoom = async () => {
    if (!canUseSchedule || !enableUpdate) {
      return
    }

    setWorking('save')
    setNotice('')

    try {
      const updated = await scheduleChatApi.upsertAdminRoom(numericScheduleId, {
        roomName: roomName.trim() || undefined,
        visibility,
        isActive,
      })
      setRoom(updated)
      setRoomName(updated.roomName || '')
      setVisibility(updated.visibility || visibility)
      setIsActive(updated.active !== false)
      setNotice('Da luu cau hinh chat room.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Khong the luu chat room.')
    } finally {
      setWorking('')
    }
  }

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canUseSchedule || !enableUpdate || (!messageText.trim() && !attachmentUrl.trim())) {
      return
    }

    setWorking('message')
    setNotice('')

    try {
      await scheduleChatApi.sendAdminMessage(numericScheduleId, {
        messageText: messageText.trim() || undefined,
        attachmentUrl: attachmentUrl.trim() || undefined,
      })
      const messagePage = await scheduleChatApi.getAdminMessages(numericScheduleId)
      setMessages(messagePage.content ?? [])
      setMessageText('')
      setAttachmentUrl('')
      setNotice('Da gui tin nhan vao chat room.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Khong the gui tin nhan.')
    } finally {
      setWorking('')
    }
  }

  const toggleMute = async (userId: string, muted: boolean | undefined) => {
    if (!canUseSchedule || !enableUpdate) {
      return
    }

    setWorking(`mute-${userId}`)
    setNotice('')

    try {
      await scheduleChatApi.muteAdminMember(numericScheduleId, userId, !muted)
      const updated = await scheduleChatApi.getAdminRoom(numericScheduleId)
      setRoom(updated)
      setNotice(!muted ? 'Da mute thanh vien.' : 'Da bo mute thanh vien.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Khong the cap nhat mute.')
    } finally {
      setWorking('')
    }
  }

  return (
    <section className="mgmt-chat-desk" id="schedule-chat-control">
      <header className="mgmt-chat-head">
        <div>
          <p className="mgmt-kicker">SCHEDULE CHAT CONTROL</p>
          <h3>Quan ly chat room theo lich khoi hanh</h3>
          <p>
            Dung admin schedule chat API de mo phong, cau hinh room, gui thong
            bao va mute thanh vien khi can dieu phoi tour.
          </p>
        </div>
        <div className="mgmt-chat-summary">
          <span>
            <MessageCircle aria-hidden="true" />
            {room?.memberCount ?? room?.members?.length ?? 0} members
          </span>
          <span>
            <Settings2 aria-hidden="true" />
            {room?.active === false ? 'Paused' : 'Active'}
          </span>
          <span>{room?.visibility || visibility}</span>
        </div>
      </header>

      <div className="mgmt-chat-toolbar">
        <label>
          <span>Schedule ID</span>
          <input value={scheduleId} onChange={(event) => setScheduleId(event.target.value)} />
        </label>
        <button type="button" onClick={() => void loadRoom()} disabled={working === 'load'}>
          <Search aria-hidden="true" />
          Tai room
        </button>
      </div>

      <div className="mgmt-chat-layout">
        <article className="mgmt-chat-panel">
          <header>
            <Settings2 aria-hidden="true" />
            <h4>Room settings</h4>
          </header>
          <div className="mgmt-chat-settings">
            <label>
              <span>Room name</span>
              <input
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                disabled={!enableUpdate}
              />
            </label>
            <label>
              <span>Visibility</span>
              <select
                value={visibility}
                onChange={(event) => setVisibility(event.target.value)}
                disabled={!enableUpdate}
              >
                <option value="all_members">all_members</option>
                <option value="staff_only">staff_only</option>
              </select>
            </label>
            <label className="mgmt-chat-check">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                disabled={!enableUpdate}
              />
              <span>Room active</span>
            </label>
            <button type="button" onClick={() => void saveRoom()} disabled={!enableUpdate || working === 'save'}>
              Luu room
            </button>
          </div>

          <div className="mgmt-chat-members">
            <strong>Members</strong>
            {room?.members?.length ? (
              room.members.map((member) => (
                <article key={member.id}>
                  <span>{member.displayName || member.fullName || member.userId}</span>
                  <small>{member.muted ? 'muted' : 'active'}</small>
                  {member.userId && (
                    <button
                      type="button"
                      onClick={() => void toggleMute(member.userId!, member.muted)}
                      disabled={!enableUpdate || working === `mute-${member.userId}`}
                    >
                      <UserX aria-hidden="true" />
                      {member.muted ? 'Unmute' : 'Mute'}
                    </button>
                  )}
                </article>
              ))
            ) : (
              <p className="mgmt-chat-empty">Chua co member hoac chua tai room.</p>
            )}
          </div>
        </article>

        <article className="mgmt-chat-panel mgmt-chat-conversation">
          <header>
            <MessageCircle aria-hidden="true" />
            <h4>Messages</h4>
          </header>
          <div className="mgmt-chat-message-list">
            {messages.length === 0 ? (
              <p className="mgmt-chat-empty">Chua co tin nhan.</p>
            ) : (
              messages.map((message) => (
                <article key={message.id}>
                  <span>{getSenderName(message)}</span>
                  {message.messageText && <p>{message.messageText}</p>}
                  {message.attachmentUrl && (
                    <a href={message.attachmentUrl} target="_blank" rel="noreferrer">
                      {message.attachmentUrl}
                    </a>
                  )}
                  <small>{formatDate(message.createdAt)}</small>
                </article>
              ))
            )}
          </div>

          <form className="mgmt-chat-message-form" onSubmit={sendMessage}>
            <label>
              <span>Message</span>
              <textarea
                rows={4}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                disabled={!enableUpdate}
              />
            </label>
            <label>
              <span>Attachment URL</span>
              <input
                value={attachmentUrl}
                onChange={(event) => setAttachmentUrl(event.target.value)}
                disabled={!enableUpdate}
              />
            </label>
            <button
              type="submit"
              disabled={!enableUpdate || working === 'message' || (!messageText.trim() && !attachmentUrl.trim())}
            >
              <Send aria-hidden="true" />
              Gui tin nhan
            </button>
          </form>
        </article>
      </div>

      {notice && <p className="mgmt-chat-notice">{notice}</p>}
    </section>
  )
}
