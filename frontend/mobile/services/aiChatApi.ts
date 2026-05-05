import { Platform } from 'react-native';
import type { AiChatResponse } from '@/types/aiChat';

const defaultApiUrl =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8088/api/v1'
    : 'http://localhost:8088/api/v1';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl;
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

type AccessTokenProvider = () => Promise<string | null> | string | null;

let accessTokenProvider: AccessTokenProvider | null = null;

export function setAiChatAccessTokenProvider(provider: AccessTokenProvider | null) {
  accessTokenProvider = provider;
}

async function buildHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = await accessTokenProvider?.();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function sendAiMessage(message: string, conversationId?: string | null) {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: await buildHeaders(),
    body: JSON.stringify({
      message,
      conversationId: conversationId ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error('Xin lỗi, hệ thống AI đang gặp lỗi khi xử lý câu hỏi.');
  }

  return (await response.json()) as AiChatResponse;
}
