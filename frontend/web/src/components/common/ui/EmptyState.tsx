type EmptyStateProps = {
  title: string
  message?: string
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <section className="bg-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/4 p-6 text-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {message && <p className="mt-2 text-sm text-slate-300">{message}</p>}
      </div>
    </section>
  )
}
