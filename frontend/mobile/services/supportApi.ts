import { apiRequest } from '@/services/apiClient';
import type { PageResponse } from '@/types/api';

export interface SupportMessage {
  id: number;
  sessionId: number;
  senderType: 'customer' | 'staff' | 'system';
  senderUserId: string;
  messageText: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface SupportSession {
  id: number;
  userId: string;
  status: 'open' | 'waiting_staff' | 'waiting_customer' | 'resolved' | 'closed';
  assignedStaffId?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  endedAt?: string;
  messages?: SupportMessage[];
}

export interface CreateSupportSessionRequest {
  initialMessage: string;
  attachmentUrl?: string;
}

export interface SendSupportMessageRequest {
  messageText: string;
  attachmentUrl?: string;
}

export interface SupportSessionFilterParams {
  status?: string;
  userId?: string;
  assignedStaffId?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export async function createSupportSession(request: CreateSupportSessionRequest) {
  return apiRequest<SupportSession>('/users/me/support/sessions', {
    method: 'POST',
    body: request,
  });
}

export async function fetchMySupportSessions() {
  return apiRequest<SupportSession[]>('/users/me/support/sessions');
}

export async function fetchMySupportSession(id: number) {
  return apiRequest<SupportSession>(`/users/me/support/sessions/${id}`);
}

export async function sendSupportMessage(id: number, request: SendSupportMessageRequest) {
  return apiRequest<SupportMessage>(`/users/me/support/sessions/${id}/messages`, {
    method: 'POST',
    body: request,
  });
}

export async function rateSupportSession(id: number, rating: number, feedback?: string) {
  return apiRequest<SupportSession>(`/support/sessions/${id}/rate`, {
    method: 'PATCH',
    body: { rating, feedback },
  });
}

// Admin Support endpoints
export async function fetchAdminSupportSessions(params: SupportSessionFilterParams = {}) {
  return apiRequest<PageResponse<SupportSession>>('/admin/support/sessions', {
    query: {
      status: params.status,
      userId: params.userId,
      assignedStaffId: params.assignedStaffId,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? 'updatedAt,desc',
    },
  });
}

export async function fetchAdminSupportSession(id: number) {
  return apiRequest<SupportSession>(`/support/sessions/${id}`);
}

export async function assignSupportSession(id: number, assignedStaffId?: string) {
  return apiRequest<SupportSession>(`/support/sessions/${id}/assign`, {
    method: 'PATCH',
    body: { assignedStaffId },
  });
}

export async function updateSupportSessionStatus(id: number, status: string) {
  return apiRequest<SupportSession>(`/support/sessions/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

export async function sendStaffReply(id: number, request: SendSupportMessageRequest) {
  return apiRequest<SupportMessage>(`/support/sessions/${id}/messages`, {
    method: 'POST',
    body: request,
  });
}
