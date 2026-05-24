import { getApiBaseUrl } from '../config/apiBaseUrl'

const assetBaseUrl = String(
  import.meta.env.VITE_ASSET_URL ??
    getApiBaseUrl().replace(/\/api\/v\d+$/i, ''),
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
