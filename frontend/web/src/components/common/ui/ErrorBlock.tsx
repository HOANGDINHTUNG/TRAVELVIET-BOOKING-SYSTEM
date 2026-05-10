type ErrorBlockProps = {
  message: string
  title?: string
  actionLabel?: string
  onAction?: () => void
}

export function ErrorBlock({
  message,
  title = 'Khong the tai du lieu',
  actionLabel,
  onAction,
}: ErrorBlockProps) {
  return (
    <section className="min-h-[42vh] bg-slate-950 px-4 py-20 text-slate-100">
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-400/30 bg-red-500/10 p-6 shadow-2xl shadow-red-950/20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-200">
          Error
        </p>
        <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-200">{message}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-red-500/20 px-4 py-2 text-sm font-medium text-red-50 ring-1 ring-red-300/30 transition hover:bg-red-500/25"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  )
}
