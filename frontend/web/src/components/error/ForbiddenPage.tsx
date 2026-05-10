import { Link } from 'react-router-dom'

type ForbiddenPageProps = {
  /** Tên quyền/role thiếu — hiển thị ở dòng phụ giúp user/dev hiểu nguyên nhân. */
  reason?: string
  /** Đường dẫn nút quay lại — mặc định về trang chủ. */
  homeHref?: string
}

function ForbiddenPage({ reason, homeHref = '/' }: ForbiddenPageProps) {
  return (
    <section className="grid min-h-screen place-items-center px-6 text-center">
      <div className="grid gap-4">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          403
        </p>
        <h1 className="text-4xl font-black">Bạn không có quyền truy cập</h1>
        <p className="mx-auto max-w-md text-base text-[var(--color-muted)]">
          {reason ??
            'Tài khoản của bạn không đủ quyền để mở khu vực này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là nhầm lẫn.'}
        </p>
        <Link
          className="mx-auto inline-flex min-h-11 items-center rounded-md bg-[var(--color-primary)] px-5 font-bold text-white no-underline"
          to={homeHref}
        >
          Về trang chủ
        </Link>
      </div>
    </section>
  )
}

export default ForbiddenPage
