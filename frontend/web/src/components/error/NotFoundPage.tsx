import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="grid min-h-screen place-items-center px-6 text-center">
      <div className="grid gap-4">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          404
        </p>
        <h1 className="text-4xl font-black">Không tìm thấy trang</h1>
        <Link
          className="mx-auto inline-flex min-h-11 items-center rounded-md bg-[var(--color-primary)] px-5 font-bold text-white no-underline"
          to="/"
        >
          Về trang chủ
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
