import type { AuthUser, UserAccessContext } from '@/types/auth';
import { clearPersistedSession, persistSession } from '@/services/authSecureStore';

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser | null;
  permissions: string[];
  isSuperAdmin: boolean;
  hasManagementAccess: boolean;
};

let session: AuthSession | null = null;

export function setAuthSession(next: AuthSession | null) {
  session = next;
  void persistSession(next);
}

export function getAuthSession() {
  return session;
}

export function setAccessToken(token: string | null) {
  if (!token) {
    void clearAuthSession();
    return;
  }
  const next: AuthSession = {
    accessToken: token,
    refreshToken: session?.refreshToken ?? '',
    user: session?.user ?? null,
    permissions: session?.permissions ?? [],
    isSuperAdmin: session?.isSuperAdmin ?? false,
    hasManagementAccess: session?.hasManagementAccess ?? false,
  };
  setAuthSession(next);
}

export function getAccessToken() {
  return session?.accessToken ?? null;
}

export function applyAccessContext(
  ctx: UserAccessContext,
  tokens: { accessToken: string; refreshToken: string }
) {
  const next: AuthSession = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: ctx.user,
    permissions: ctx.permissions ?? [],
    isSuperAdmin: Boolean(ctx.isSuperAdmin),
    hasManagementAccess: Boolean(ctx.hasManagementAccess),
  };
  setAuthSession(next);
}

export async function clearAuthSession() {
  session = null;
  await clearPersistedSession();
}

/** Khôi phục session từ SecureStore vào RAM (không gọi API). */
export function hydrateAuthSession(stored: AuthSession) {
  session = stored;
}
