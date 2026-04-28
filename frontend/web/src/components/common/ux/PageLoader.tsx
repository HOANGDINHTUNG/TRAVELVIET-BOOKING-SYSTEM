type PageLoaderProps = {
  label?: string
}

export function PageLoader({ label = 'Dang tai du lieu...' }: PageLoaderProps) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/4 px-5 py-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </section>
  )
}
