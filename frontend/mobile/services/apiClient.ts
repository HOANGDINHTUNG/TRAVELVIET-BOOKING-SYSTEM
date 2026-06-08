import type { ApiResponse } from '@/types/api';
import { ApiError } from '@/types/api';
import { getApiBaseUrl } from '@/config/apiBaseUrl';
import { clearAuthSession, getAccessToken } from '@/services/authStorage';
import { refreshAccessToken } from '@/services/authTokenRefresh';

export { getApiBaseUrl as API_BASE_URL };

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Không thử refresh khi 401 (login, refresh, …) */
  skipAuthRefresh?: boolean;
  /** Đã retry sau refresh — tránh vòng lặp */
  isRetry?: boolean;
};

function buildQuery(query?: RequestOptions['query']) {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.append(key, String(value));
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

function isAuthEndpoint(path: string) {
  return path.startsWith('/auth/login') || path.startsWith('/auth/refresh') || path.startsWith('/auth/register');
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, skipAuthRefresh = false, isRetry = false } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}${buildQuery(query)}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Không thể kết nối máy chủ. Kiểm tra mạng và URL API.', 0);
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    if (!response.ok) {
      throw new ApiError('Phản hồi không hợp lệ từ máy chủ.', response.status);
    }
    throw new ApiError('Không đọc được dữ liệu phản hồi.', response.status);
  }

  if (response.status === 401) {
    const canRefresh = !skipAuthRefresh && !isRetry && !isAuthEndpoint(path);
    if (canRefresh) {
      try {
        await refreshAccessToken();
        return apiRequest<T>(path, { ...options, isRetry: true });
      } catch {
        await clearAuthSession();
        throw new ApiError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401);
      }
    }
    await clearAuthSession();
    throw new ApiError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401);
  }

  if (!response.ok || !payload.success) {
    throw new ApiError(payload.message || 'Yêu cầu thất bại.', response.status);
  }

  return payload.data;
}
