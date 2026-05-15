import type { TourResponse } from '../../types/publicTour'

type TagRowProps = {
  tour: TourResponse
}

export function TagRow({ tour }: TagRowProps) {
  const tags = tour.tags ?? []
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center rounded-full border border-slate-200/90 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm"
        >
          {tag.name ?? tag.code ?? '—'}
          {tag.tagGroup ? (
            <span className="ml-1 text-[10px] uppercase text-slate-400">· {tag.tagGroup}</span>
          ) : null}
        </span>
      ))}
    </div>
  )
}
