import {
  DEVELOPMENT_API_BASE_URL,
  PRODUCTION_API_BASE_URL,
  isLocalApiBaseUrl,
  normalizeApiBaseUrl,
  resolveApiBaseUrlFromEnv,
} from './apiConfig'

const API_HEALTH_PATH = '/system/health'
/** Probe startup — ngắn hơn để không kéo dài TTI khi API chậm. */
const DEFAULT_PROBE_MS = 3_000

let activeBaseUrl: string | null = null

export function getApiBaseUrl(): string {
  return activeBaseUrl ?? resolveApiBaseUrlFromEnv()
}

export function shouldUseApiFailover(): boolean {
  if (import.meta.env.VITE_API_FAILOVER_ENABLED === 'true') {
    return true
  }
  if (import.meta.env.VITE_API_FAILOVER_ENABLED === 'false') {
    return false
  }
  return import.meta.env.DEV
}

export function resolvePublicApiBaseUrl(): string {
  const explicit = import.meta.env.VITE_API_PUBLIC_BASE_URL
  if (explicit) {
    return normalizeApiBaseUrl(String(explicit))
  }
  const configured = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL
  if (configured && !isLocalApiBaseUrl(String(configured))) {
    return normalizeApiBaseUrl(String(configured))
  }
  return PRODUCTION_API_BASE_URL
}

export function resolveLocalApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_LOCAL_BASE_URL
  if (fromEnv) {
    return normalizeApiBaseUrl(String(fromEnv))
  }
  return DEVELOPMENT_API_BASE_URL
}

export async function probeApiHealth(
  baseUrl: string,
  timeoutMs = DEFAULT_PROBE_MS,
): Promise<boolean> {
  const url = `${normalizeApiBaseUrl(baseUrl)}${API_HEALTH_PATH}`
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    return response.ok
  } catch {
    return false
  } finally {
    window.clearTimeout(timer)
  }
}

function preferPublicApiFirst(): boolean {
  return import.meta.env.VITE_API_PREFER_PUBLIC === 'true'
}

async function chooseWithFailover(
  primaryUrl: string,
  fallbackUrl: string,
  primaryLabel: string,
  fallbackLabel: string,
): Promise<string> {
  if (primaryUrl === fallbackUrl) {
    activeBaseUrl = primaryUrl
    return primaryUrl
  }

  const primaryOk = await probeApiHealth(primaryUrl)
  if (primaryOk) {
    activeBaseUrl = primaryUrl
    console.info(`[api] ${primaryLabel} OK:`, primaryUrl)
    return primaryUrl
  }

  activeBaseUrl = fallbackUrl
  console.warn(
    `[api] ${primaryLabel} không phản hồi (${primaryUrl}) — chuyển sang ${fallbackLabel}:`,
    fallbackUrl,
  )
  return fallbackUrl
}

/**
 * Chọn API base URL trước khi render app.
 * Mặc định (dev): thử local trước → Render public nếu local down.
 * `VITE_API_PREFER_PUBLIC=true`: thử Render trước → local.
 */
export async function initializeApiBaseUrl(): Promise<string> {
  if (!shouldUseApiFailover()) {
    const url = resolveApiBaseUrlFromEnv()
    activeBaseUrl = url
    return url
  }

  const localUrl = resolveLocalApiBaseUrl()
  const publicUrl = resolvePublicApiBaseUrl()

  if (isLocalApiBaseUrl(publicUrl)) {
    activeBaseUrl = publicUrl
    return publicUrl
  }

  if (preferPublicApiFirst()) {
    return chooseWithFailover(publicUrl, localUrl, 'Public API', 'local API')
  }

  return chooseWithFailover(localUrl, publicUrl, 'Local API', 'public API (Render)')
}

/** URL dự phòng so với URL đang dùng (local ↔ public). */
export function resolveAlternateApiBaseUrl(currentUrl: string): string | null {
  const localUrl = resolveLocalApiBaseUrl()
  const publicUrl = resolvePublicApiBaseUrl()
  const current = normalizeApiBaseUrl(currentUrl)

  if (current === normalizeApiBaseUrl(localUrl) && publicUrl !== localUrl) {
    return publicUrl
  }
  if (current === normalizeApiBaseUrl(publicUrl) && publicUrl !== localUrl) {
    return localUrl
  }
  return null
}

export function switchToLocalApiBaseUrl(): string {
  const localUrl = resolveLocalApiBaseUrl()
  if (getApiBaseUrl() !== localUrl) {
    activeBaseUrl = localUrl
    console.warn('[api] Runtime failover → local:', localUrl)
  }
  return localUrl
}

export function switchToPublicApiBaseUrl(): string {
  const publicUrl = resolvePublicApiBaseUrl()
  if (getApiBaseUrl() !== publicUrl) {
    activeBaseUrl = publicUrl
    console.warn('[api] Runtime failover → public (Render):', publicUrl)
  }
  return publicUrl
}

export function switchToAlternateApiBaseUrl(): string | null {
  const alternate = resolveAlternateApiBaseUrl(getApiBaseUrl())
  if (!alternate) return null
  if (isLocalApiBaseUrl(alternate)) {
    return switchToLocalApiBaseUrl()
  }
  return switchToPublicApiBaseUrl()
}
