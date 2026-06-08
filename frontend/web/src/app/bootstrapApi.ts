import { applyApiClientBaseUrl } from '../lib/apiClient'
import { initializeApiBaseUrl } from '../config/apiBaseUrl'

/**
 * Probe API trước khi render React.
 * Mặc định dev: local (8088) trước → Render nếu local không phản hồi.
 */
export async function bootstrapApi(): Promise<void> {
  await initializeApiBaseUrl()
  applyApiClientBaseUrl()
}
