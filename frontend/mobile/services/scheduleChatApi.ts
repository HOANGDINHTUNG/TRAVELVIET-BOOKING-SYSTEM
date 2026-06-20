import { apiRequest } from '@/services/apiClient';
import type { PageResponse } from '@/types/api';

export interface ScheduleChatRoom {
  id: number;
  scheduleId: number;
  roomName: string;
  visibility: 'all_members' | 'staff_only';
  isActive: boolean;
  createdAt: string;
}

export interface ScheduleChatMessage {
  id: number;
  roomId: number;
  senderUserId: string;
  senderName: string;
  senderRole: string;
  messageText: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface SendChatMessageRequest {
  messageText: string;
  attachmentUrl?: string;
}

export interface UpdateChatRoomSettings {
  roomName?: string;
  visibility?: 'all_members' | 'staff_only';
  isActive?: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export async function fetchScheduleChatRoom(scheduleId: number) {
  return apiRequest<ScheduleChatRoom>(`/schedules/${scheduleId}/chat-room`);
}

export async function fetchScheduleChatMessages(scheduleId: number, params: PaginationParams = {}) {
  return apiRequest<PageResponse<ScheduleChatMessage>>(`/schedules/${scheduleId}/chat-room/messages`, {
    query: {
      page: params.page ?? 0,
      size: params.size ?? 50,
      sort: params.sort ?? 'createdAt,asc',
    },
  });
}

export async function sendScheduleChatMessage(scheduleId: number, request: SendChatMessageRequest) {
  return apiRequest<ScheduleChatMessage>(`/schedules/${scheduleId}/chat-room/messages`, {
    method: 'POST',
    body: request,
  });
}

// Admin Chatroom endpoints
export async function fetchAdminScheduleChatRoom(scheduleId: number) {
  return apiRequest<ScheduleChatRoom>(`/admin/schedules/${scheduleId}/chat-room`);
}

export async function updateAdminScheduleChatRoom(scheduleId: number, request: UpdateChatRoomSettings) {
  return apiRequest<ScheduleChatRoom>(`/admin/schedules/${scheduleId}/chat-room`, {
    method: 'PUT',
    body: request,
  });
}

export async function fetchAdminScheduleChatMessages(scheduleId: number, params: PaginationParams = {}) {
  return apiRequest<PageResponse<ScheduleChatMessage>>(`/admin/schedules/${scheduleId}/chat-room/messages`, {
    query: {
      page: params.page ?? 0,
      size: params.size ?? 50,
      sort: params.sort ?? 'createdAt,asc',
    },
  });
}

export async function muteChatRoomMember(scheduleId: number, userId: string, isMuted: boolean) {
  return apiRequest<{ success: boolean; message: string }>(
    `/admin/schedules/${scheduleId}/chat-room/members/${userId}/mute`,
    {
      method: 'PATCH',
      body: { isMuted },
    }
  );
}

export async function sendAdminScheduleChatMessage(scheduleId: number, request: SendChatMessageRequest) {
  return apiRequest<ScheduleChatMessage>(`/admin/schedules/${scheduleId}/chat-room/messages`, {
    method: 'POST',
    body: request,
  });
}
