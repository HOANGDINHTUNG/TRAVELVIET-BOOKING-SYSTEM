import type { PageResponse } from '../../types/api'
import {
  getBackendData,
  patchBackendData,
  postBackendData,
  putBackendData,
} from './serverApiClient'

export type ScheduleChatMember = {
  id: number
  userId?: string
  fullName?: string
  displayName?: string
  muted?: boolean
  joinedAt?: string
}

export type ScheduleChatRoom = {
  id: number
  scheduleId: number
  scheduleCode?: string
  roomName?: string
  visibility?: string
  active?: boolean
  createdAt?: string
  memberCount?: number
  members?: ScheduleChatMember[]
}

export type ScheduleChatMessage = {
  id: number
  roomId: number
  senderUserId?: string
  senderFullName?: string
  senderDisplayName?: string
  messageText?: string
  attachmentUrl?: string
  createdAt?: string
}

export type CreateScheduleChatMessagePayload = {
  messageText?: string
  attachmentUrl?: string
}

export type UpsertScheduleChatRoomPayload = {
  roomName?: string
  visibility?: 'all_members' | 'staff_only' | string
  isActive?: boolean
}

export type ScheduleChatMessagesParams = {
  page?: number
  size?: number
  sort?: string
}

export const scheduleChatApi = {
  getRoom(scheduleId: number) {
    return getBackendData<ScheduleChatRoom>(`schedules/${scheduleId}/chat-room`)
  },

  getMessages(scheduleId: number, params: ScheduleChatMessagesParams = {}) {
    return getBackendData<PageResponse<ScheduleChatMessage>>(
      `schedules/${scheduleId}/chat-room/messages`,
      {
        page: params.page ?? 0,
        size: params.size ?? 100,
        sort: params.sort ?? 'createdAt,asc',
      },
    )
  },

  sendMessage(scheduleId: number, payload: CreateScheduleChatMessagePayload) {
    return postBackendData<ScheduleChatMessage>(
      `schedules/${scheduleId}/chat-room/messages`,
      payload,
    )
  },

  getAdminRoom(scheduleId: number) {
    return getBackendData<ScheduleChatRoom>(`admin/schedules/${scheduleId}/chat-room`)
  },

  upsertAdminRoom(scheduleId: number, payload: UpsertScheduleChatRoomPayload) {
    return putBackendData<ScheduleChatRoom>(
      `admin/schedules/${scheduleId}/chat-room`,
      payload,
    )
  },

  getAdminMessages(scheduleId: number, params: ScheduleChatMessagesParams = {}) {
    return getBackendData<PageResponse<ScheduleChatMessage>>(
      `admin/schedules/${scheduleId}/chat-room/messages`,
      {
        page: params.page ?? 0,
        size: params.size ?? 100,
        sort: params.sort ?? 'createdAt,asc',
      },
    )
  },

  sendAdminMessage(scheduleId: number, payload: CreateScheduleChatMessagePayload) {
    return postBackendData<ScheduleChatMessage>(
      `admin/schedules/${scheduleId}/chat-room/messages`,
      payload,
    )
  },

  muteAdminMember(scheduleId: number, userId: string, muted: boolean) {
    return patchBackendData<void>(
      `admin/schedules/${scheduleId}/chat-room/members/${userId}/mute`,
      undefined,
      { params: { muted }, options: { allowEmpty: true } },
    )
  },
}
