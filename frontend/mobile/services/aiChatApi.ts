import type { AiChatResponse } from '@/types/aiChat';
import { getApiBaseUrl } from '@/config/apiBaseUrl';
import { getAccessToken } from '@/services/authStorage';
import { refreshAccessToken } from '@/services/authTokenRefresh';

type AccessTokenProvider = () => Promise<string | null> | string | null;

let accessTokenProvider: AccessTokenProvider | null = null;

export function setAiChatAccessTokenProvider(provider: AccessTokenProvider | null) {
  accessTokenProvider = provider;
}

async function resolveToken() {
  const fromProvider = await accessTokenProvider?.();
  return fromProvider ?? getAccessToken();
}

async function postChat(message: string, conversationId: string | null | undefined, token: string | null) {
  const response = await fetch(`${getApiBaseUrl()}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message,
      conversationId: conversationId ?? null,
    }),
  });

  return response;
}

export async function sendAiMessage(message: string, conversationId?: string | null) {
  let token = await resolveToken();
  let response = await postChat(message, conversationId, token);

  if (response.status === 401 && token) {
    try {
      await refreshAccessToken();
      token = await resolveToken();
      response = await postChat(message, conversationId, token);
    } catch {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
  }

  if (!response.ok) {
    throw new Error('Xin lỗi, hệ thống AI đang gặp lỗi khi xử lý câu hỏi.');
  }

  return (await response.json()) as AiChatResponse;
}
