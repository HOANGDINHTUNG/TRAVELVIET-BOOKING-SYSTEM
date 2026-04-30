import { getBackendData, patchBackendData, postBackendData } from './serverApiClient'

export type Notification = {
  id: number
  userId?: string
  title?: string
  body?: string
  message?: string
  notificationType?: string
  channel?: string
  entityType?: string
  entityId?: string
  referenceType?: string
  referenceId?: number
  payload?: string
  scheduledAt?: string
  sentAt?: string
  readAt?: string
  isBroadcast?: boolean
  isRead?: boolean
  createdAt?: string
}

export type NotificationReadSummary = {
  readCount?: number
  unreadCount?: number
}

export type CreateAdminNotificationPayload = {
  userId: string
  notificationType: string
  channel?: string
  title: string
  body: string
  referenceType?: string
  referenceId?: number
  payload?: string
  scheduledAt?: string
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

  createAdminNotification(payload: CreateAdminNotificationPayload) {
    return postBackendData<Notification>('notifications', payload)
  },
}
