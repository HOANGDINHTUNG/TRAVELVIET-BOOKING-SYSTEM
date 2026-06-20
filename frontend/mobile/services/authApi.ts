import { apiRequest } from '@/services/apiClient';
import type { AuthData } from '@/types/auth';

export async function loginWithEmail(email: string, password: string) {
  return apiRequest<AuthData>('/auth/login', {
    method: 'POST',
    body: {
      login: email.trim(),
      passwordHash: password,
    },
    skipAuthRefresh: true,
  });
}

export async function refreshAuthSession(refreshToken: string) {
  return apiRequest<AuthData>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    skipAuthRefresh: true,
  });
}

export async function registerUser(payload: {
  fullName: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  displayName?: string;
}) {
  return apiRequest<AuthData>('/auth/register', {
    method: 'POST',
    body: payload,
    skipAuthRefresh: true,
  });
}
