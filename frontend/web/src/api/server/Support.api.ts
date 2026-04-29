import { getBackendData, patchBackendData, postBackendData } from './serverApiClient'

export type SupportMessage = {
  id: number
  sessionId: number
  senderType?: string
  senderUserId?: string
  messageText: string
  attachmentUrl?: string
  createdAt?: string
}

export type SupportSession = {
  id: number
  sessionCode?: string
  userId?: string
  assignedStaffId?: string
  status?: string
  startedAt?: string
  endedAt?: string
  lastMessageAt?: string
  createdAt?: string
  updatedAt?: string
  rating?: number
  feedback?: string
  messageCount?: number
  messages?: SupportMessage[]
}

export type CreateSupportSessionPayload = {
  initialMessage: string
  attachmentUrl?: string
}

export type CreateSupportMessagePayload = {
  messageText: string
  attachmentUrl?: string
}

export type RateSupportSessionPayload = {
  rating: number
  feedback?: string
}

export const supportApi = {
  createMySession(payload: CreateSupportSessionPayload) {
    return postBackendData<SupportSession>('users/me/support/sessions', payload)
  },

  getMySessions() {
    return getBackendData<SupportSession[]>('users/me/support/sessions')
  },

  getMySession(id: number) {
    return getBackendData<SupportSession>(`users/me/support/sessions/${id}`)
  },

  sendMyMessage(id: number, payload: CreateSupportMessagePayload) {
    return postBackendData<SupportMessage>(`users/me/support/sessions/${id}/messages`, payload)
  },

  rateMySession(id: number, payload: RateSupportSessionPayload) {
    return patchBackendData<SupportSession>(`users/me/support/sessions/${id}/rate`, payload)
  },
}
