import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'
import { Compass, MapPin } from 'lucide-react'
import './ErrorPage.css'

/**
 * Hiển thị lỗi runtime/load route — không dùng trang 404 khi component crash.
 */
export default function RouteErrorPage() {
  const error = useRouteError()

  let title = 'Đã xảy ra lỗi'
  let description = 'Không thể tải trang này. Vui lòng thử tải lại hoặc quay về trang chủ.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Không tìm thấy trang'
      description = 'Đường dẫn không tồn tại hoặc đã bị đổi.'
    } else {
      title = `Lỗi ${error.status}`
      description = error.statusText || description
    }
  } else if (error instanceof Error) {
    description = import.meta.env.DEV ? error.message : description
  }

  return (
    <div className="error-page">
      <div className="error-page__card">
        <div className="error-page__code" aria-hidden="true">
          {isRouteErrorResponse(error) && error.status === 404 ? '404' : '!'}
        </div>
        <div className="error-page__icon">
          <Compass size={32} strokeWidth={1.6} className="error-icon-404" aria-hidden />
        </div>
        <h1 className="error-page__title">{title}</h1>
        <p className="error-page__desc">{description}</p>
        <nav className="error-page__links" aria-label="Điều hướng gợi ý">
          <Link className="error-page__link-primary" to="/">
            <MapPin size={15} strokeWidth={2.2} aria-hidden />
            Về trang chủ
          </Link>
          <button type="button" className="error-page__link-secondary" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </nav>
      </div>
    </div>
  )
}
