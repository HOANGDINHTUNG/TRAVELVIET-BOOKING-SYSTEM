/**
 * API backend URL. Production build defaults to Render; dev defaults to localhost.
 * Override: VITE_API_BASE_URL or VITE_API_URL in .env / hosting dashboard.
 * Failover public → local: `src/config/apiBaseUrl.ts` + `VITE_API_FAILOVER_ENABLED`.
 */
export const PRODUCTION_API_BASE_URL =
  'https://travelviet-booking-system.onrender.com/api/v1'

export const DEVELOPMENT_API_BASE_URL = 'http://localhost:8088/api/v1'

export function normalizeApiBaseUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

export function isLocalApiBaseUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname
    return host === 'localhost' || host === '127.0.0.1' || host === '::1'
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url)
  }
}

/** URL tĩnh từ .env (không qua probe failover). */
export function resolveApiBaseUrlFromEnv(): string {
  const fromEnv =
    import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL
  if (fromEnv) {
    return normalizeApiBaseUrl(String(fromEnv))
  }
  const fallback = import.meta.env.PROD
    ? PRODUCTION_API_BASE_URL
    : DEVELOPMENT_API_BASE_URL
  return normalizeApiBaseUrl(fallback)
}

/** @deprecated Dùng {@link getApiBaseUrl} sau {@link initializeApiBaseUrl}. */
export function resolveApiBaseUrl(): string {
  return resolveApiBaseUrlFromEnv()
}
