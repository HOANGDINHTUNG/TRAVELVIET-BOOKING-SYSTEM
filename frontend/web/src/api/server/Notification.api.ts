import { getBackendData, patchBackendData } from './serverApiClient'

export type Notification = {
  id: number
  title?: string
  message?: string
  notificationType?: string
  entityType?: string
  entityId?: string
  isRead?: boolean
  createdAt?: string
}

export type NotificationReadSummary = {
  readCount?: number
  unreadCount?: number
}

export const notificationApi = {
  getMine() {
    return getBackendData<Notification[]>('users/me/notifications')
  },

  markRead(id: number) {
    return patchBackendData<Notification>(`users/me/notifications/${id}/read`)
  },

  markAllRead() {
    return patchBackendData<NotificationReadSummary>('users/me/notifications/read-all')
  },
}
