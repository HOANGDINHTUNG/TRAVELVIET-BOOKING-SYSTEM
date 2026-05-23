import { Link } from 'react-router-dom'
import { Compass, MapPin, LifeBuoy } from 'lucide-react'
import './ErrorPage.css'

function NotFoundPage() {
  return (
    <div className="error-page">
      <div className="error-page__card">
        <div className="error-page__code" aria-hidden="true">404</div>

        <div className="error-page__icon">
          <Compass size={32} strokeWidth={1.6} className="error-icon-404" aria-hidden="true" />
        </div>

        <h1 className="error-page__title">Không tìm thấy trang</h1>
        <p className="error-page__desc">
          Trang bạn tìm kiếm có thể đã bị di chuyển, đổi tên hoặc không còn tồn tại.
          Hãy thử một trong các đường dẫn bên dưới.
        </p>

        <nav className="error-page__links" aria-label="Điều hướng gợi ý">
          <Link className="error-page__link-primary" to="/">
            <MapPin size={15} strokeWidth={2.2} aria-hidden="true" />
            Về trang chủ
          </Link>
          <Link className="error-page__link-secondary" to="/tours">
            Xem tour
          </Link>
          <Link className="error-page__link-secondary" to="/support">
            <LifeBuoy size={15} strokeWidth={2} aria-hidden="true" />
            Hỗ trợ
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default NotFoundPage
