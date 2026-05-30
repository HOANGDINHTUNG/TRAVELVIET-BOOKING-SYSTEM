import { canViewCommerceDesk } from '@/features/auth/commercePermissions';
import { fetchMyAccessContext } from '@/services/userApi';
import { loadPersistedSession } from '@/services/authSecureStore';
import {
  applyAccessContext,
  clearAuthSession,
  getAccessToken,
  getAuthSession,
  hydrateAuthSession,
} from '@/services/authStorage';
import { setAiChatAccessTokenProvider } from '@/services/aiChatApi';
import type { AuthData } from '@/types/auth';

export async function establishSessionAfterLogin(auth: AuthData) {
  const ctx = await fetchMyAccessContext();
  applyAccessContext(ctx, {
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  });
  setAiChatAccessTokenProvider(() => getAccessToken());
  return ctx;
}

export async function restorePersistedSession(): Promise<boolean> {
  const stored = await loadPersistedSession();
  if (!stored?.accessToken) {
    return false;
  }
  hydrateAuthSession(stored);
  setAiChatAccessTokenProvider(() => getAccessToken());
  return true;
}

export async function ensureAccessContextLoaded() {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  const existing = getAuthSession();
  if (existing?.permissions?.length) {
    return existing;
  }
  const ctx = await fetchMyAccessContext();
  applyAccessContext(ctx, {
    accessToken: token,
    refreshToken: existing?.refreshToken ?? '',
  });
  return getAuthSession();
}

export function assertCanOpenCommerceDesk() {
  if (!getAccessToken()) {
    throw new Error('Chưa đăng nhập.');
  }
  if (!canViewCommerceDesk()) {
    throw new Error('Tài khoản không có quyền mở Commerce Desk.');
  }
}

export { clearAuthSession };
