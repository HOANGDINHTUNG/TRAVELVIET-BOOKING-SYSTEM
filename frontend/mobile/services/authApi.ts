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
