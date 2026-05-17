import { Navigate, useParams } from 'react-router-dom'

/**
 * Chuyển URL cũ `/tours/:id` → `/tour/:id` (chi tiết public).
 */
export default function TourLegacyIdRedirect() {
  const { id } = useParams<{ id: string }>()
  if (!id?.trim()) {
    return <Navigate to="/tours" replace />
  }
  return <Navigate to={`/tour/${id.trim()}`} replace />
}
