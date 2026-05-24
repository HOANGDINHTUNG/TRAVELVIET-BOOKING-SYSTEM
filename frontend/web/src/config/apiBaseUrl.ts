import {
  DEVELOPMENT_API_BASE_URL,
  PRODUCTION_API_BASE_URL,
  isLocalApiBaseUrl,
  normalizeApiBaseUrl,
  resolveApiBaseUrlFromEnv,
} from './apiConfig'

const API_HEALTH_PATH = '/system/health'
const DEFAULT_PROBE_MS = 8_000

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

/**
 * Chọn API base URL trước khi render app: thử public (Render), không được thì localhost.
 */
export async function initializeApiBaseUrl(): Promise<string> {
  if (!shouldUseApiFailover()) {
    const url = resolveApiBaseUrlFromEnv()
    activeBaseUrl = url
    return url
  }

  const localUrl = resolveLocalApiBaseUrl()
  const preferPublic = import.meta.env.VITE_API_PREFER_PUBLIC !== 'false'

  if (!preferPublic) {
    activeBaseUrl = localUrl
    console.info('[api] VITE_API_PREFER_PUBLIC=false — dùng local:', localUrl)
    return localUrl
  }

  const publicUrl = resolvePublicApiBaseUrl()
  if (isLocalApiBaseUrl(publicUrl)) {
    activeBaseUrl = publicUrl
    return publicUrl
  }

  const reachable = await probeApiHealth(publicUrl)
  const chosen = reachable ? publicUrl : localUrl
  activeBaseUrl = chosen

  if (reachable) {
    console.info('[api] Public API OK:', publicUrl)
  } else {
    console.warn(
      `[api] Public API không phản hồi (${publicUrl}) — chuyển sang local:`,
      localUrl,
    )
  }

  return chosen
}

export function switchToLocalApiBaseUrl(): string {
  const localUrl = resolveLocalApiBaseUrl()
  if (getApiBaseUrl() !== localUrl) {
    activeBaseUrl = localUrl
    console.warn('[api] Runtime failover → local:', localUrl)
  }
  return localUrl
}
