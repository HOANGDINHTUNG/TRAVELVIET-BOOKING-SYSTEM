import { getApiBaseUrl } from '@/config/apiBaseUrl';
import { applyAccessContext, getAuthSession, setAuthSession } from '@/services/authStorage';
import { persistSession } from '@/services/authSecureStore';
import type { ApiResponse } from '@/types/api';
import { ApiError } from '@/types/api';
import type { AuthData } from '@/types/auth';

let refreshInFlight: Promise<AuthData> | null = null;

export async function refreshAccessToken(): Promise<AuthData> {
  const current = getAuthSession();
  const refreshToken = current?.refreshToken;
  if (!refreshToken) {
    throw new ApiError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401);
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      let response: Response;
      try {
        response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        throw new ApiError('Không thể làm mới phiên đăng nhập.', 0);
      }

      let payload: ApiResponse<AuthData> | null = null;
      try {
        payload = (await response.json()) as ApiResponse<AuthData>;
      } catch {
        throw new ApiError('Phản hồi refresh không hợp lệ.', response.status);
      }

      if (!response.ok || !payload?.success || !payload.data) {
        throw new ApiError(payload?.message || 'Refresh token không hợp lệ.', response.status || 401);
      }

      const auth = payload.data;
      if (current?.permissions?.length) {
        const next = {
          ...current,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          user: auth.user ?? current.user,
        };
        setAuthSession(next);
        await persistSession(next);
      } else if (current?.user) {
        const next = {
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          user: auth.user,
          permissions: current.permissions,
          isSuperAdmin: current.isSuperAdmin,
          hasManagementAccess: current.hasManagementAccess,
        };
        setAuthSession(next);
        await persistSession(next);
      } else {
        applyAccessContext(
          {
            user: auth.user,
            roles: auth.user.roles ?? [],
            permissions: [],
            managementRoles: [],
            hasManagementAccess: false,
            isSuperAdmin: false,
          },
          { accessToken: auth.accessToken, refreshToken: auth.refreshToken }
        );
        await persistSession(getAuthSession());
      }

      return auth;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}
