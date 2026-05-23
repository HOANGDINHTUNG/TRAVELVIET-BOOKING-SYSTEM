/**
 * API backend URL. Production build defaults to Render; dev defaults to localhost.
 * Override: VITE_API_BASE_URL or VITE_API_URL in .env / hosting dashboard.
 */
export const PRODUCTION_API_BASE_URL =
  'https://travelviet-booking-system.onrender.com/api/v1'

export const DEVELOPMENT_API_BASE_URL = 'http://localhost:8088/api/v1'

export function resolveApiBaseUrl(): string {
  const fromEnv =
    import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL
  if (fromEnv) {
    return String(fromEnv).replace(/\/+$/, '')
  }
  const fallback = import.meta.env.PROD
    ? PRODUCTION_API_BASE_URL
    : DEVELOPMENT_API_BASE_URL
  return fallback.replace(/\/+$/, '')
}
