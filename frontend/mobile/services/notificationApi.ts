import { apiRequest } from '@/services/apiClient';

export interface InAppNotification {
  id: number;
  userId: string;
  notificationType: 'PROMOTION' | 'SYSTEM' | 'WEATHER' | 'ORDER';
  channel: 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';
  title: string;
  body: string;
  referenceType?: string;
  referenceId?: number;
  payload?: string;
  isRead: boolean;
  sentAt?: string;
  readAt?: string;
}

export interface CreateNotificationRequest {
  userId: string;
  notificationType: 'PROMOTION' | 'SYSTEM' | 'WEATHER' | 'ORDER';
  channel?: 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';
  title: string;
  body: string;
  referenceType?: string;
  referenceId?: number;
  payload?: string;
}

export async function createNotification(request: CreateNotificationRequest) {
  return apiRequest<InAppNotification>('/notifications', {
    method: 'POST',
    body: request,
  });
}

export async function fetchMyNotifications() {
  return apiRequest<InAppNotification[]>('/users/me/notifications');
}

export async function markNotificationAsRead(id: number) {
  return apiRequest<InAppNotification>(`/users/me/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsAsRead() {
  return apiRequest<{ updatedCount: number }>('/users/me/notifications/read-all', {
    method: 'PATCH',
  });
}
