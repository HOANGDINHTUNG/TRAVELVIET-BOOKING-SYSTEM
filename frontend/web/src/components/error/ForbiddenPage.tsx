import { Link } from 'react-router-dom'
import { ShieldAlert, Home, LifeBuoy } from 'lucide-react'
import './ErrorPage.css'

type ForbiddenPageProps = {
  reason?: string
  homeHref?: string
}

function ForbiddenPage({ reason, homeHref = '/' }: ForbiddenPageProps) {
  return (
    <div className="error-page">
      <div className="error-page__card">
        <div className="error-page__code" aria-hidden="true">403</div>

        <div className="error-page__icon error-page__icon--danger">
          <ShieldAlert size={32} strokeWidth={1.6} className="error-icon-403" aria-hidden="true" />
        </div>

        <h1 className="error-page__title">Bạn không có quyền truy cập</h1>
        <p className="error-page__desc">
          {reason ??
            'Tài khoản của bạn không đủ quyền để mở khu vực này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là nhầm lẫn.'}
        </p>

        <nav className="error-page__links" aria-label="Điều hướng gợi ý">
          <Link className="error-page__link-primary" to={homeHref}>
            <Home size={15} strokeWidth={2.2} aria-hidden="true" />
            Về trang chủ
          </Link>
          <Link className="error-page__link-secondary" to="/support">
            <LifeBuoy size={15} strokeWidth={2} aria-hidden="true" />
            Liên hệ hỗ trợ
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default ForbiddenPage
