type EmptyStateProps = {
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <section className="bg-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/4 p-6 text-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {message && <p className="mt-2 text-sm text-slate-300">{message}</p>}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 ring-1 ring-white/15 transition hover:bg-white/15"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  )
}
