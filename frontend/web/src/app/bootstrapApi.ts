import { applyApiClientBaseUrl } from '../lib/apiClient'
import { initializeApiBaseUrl } from '../config/apiBaseUrl'

/**
 * Probe API public (Render); nếu down thì gắn axios vào localhost trước khi render React.
 */
export async function bootstrapApi(): Promise<void> {
  await initializeApiBaseUrl()
  applyApiClientBaseUrl()
}
