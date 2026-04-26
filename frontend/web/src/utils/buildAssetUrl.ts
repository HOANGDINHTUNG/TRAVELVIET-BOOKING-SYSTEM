import { API_BASE_URL } from './axiosInstance'

const assetBaseUrl = String(
  import.meta.env.VITE_ASSET_URL ??
    API_BASE_URL.replace(/\/api\/v\d+$/i, ''),
).replace(/\/+$/, '')

export function buildAssetUrl(path?: string | null) {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${assetBaseUrl}/${path.replace(/^\/+/, '')}`
}
