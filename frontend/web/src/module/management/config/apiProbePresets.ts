export type ApiProbeMethod = 'GET'

export type ApiProbePreset = {
  id: string
  method: ApiProbeMethod
  /** Đường dẫn tương đối `apiClient` (không có leading slash) */
  path: string
  params?: Record<string, string | number | boolean>
}

/**
 * Các endpoint nhẹ (GET, phân trang nhỏ) để kiểm tra backend đang phản hồi.
 * 403/404 vẫn coi là "máy chủ trả lời" — hiển thị mã HTTP.
 */
export const API_PROBE_PRESETS: ApiProbePreset[] = [
  { id: 'health', method: 'GET', path: 'system/health' },
  { id: 'toursPublic', method: 'GET', path: 'tours', params: { page: 0, size: 1 } },
  { id: 'destinationsPublic', method: 'GET', path: 'destinations', params: { page: 0, size: 1 } },
  { id: 'adminTours', method: 'GET', path: 'admin/tours', params: { page: 0, size: 1 } },
  { id: 'adminDestinations', method: 'GET', path: 'admin/destinations', params: { page: 0, size: 1 } },
  { id: 'adminBookings', method: 'GET', path: 'admin/bookings', params: { page: 0, size: 1 } },
  { id: 'rbacRoles', method: 'GET', path: 'roles' },
  { id: 'bookingsMine', method: 'GET', path: 'bookings/me' },
]
