import { CalendarDays, Camera, Compass, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  DestinationDetailStat,
  DestinationDetailStatId,
} from '../../utils/destinationDetailViewModel'

const statIcons: Record<DestinationDetailStatId, LucideIcon> = {
  idealTime: CalendarDays,
  crowdDefault: Compass,
  media: Camera,
  contentBlocks: Sparkles,
}

type DestinationQuickStatsStripProps = {
  stats: DestinationDetailStat[]
}

export function DestinationQuickStatsStrip({ stats }: DestinationQuickStatsStripProps) {
  return (
    <section
      aria-label="Quick stats"
      className="grid grid-cols-2 gap-3 md:grid-cols-4"
    >
      {stats.map((item) => {
        const Icon = statIcons[item.id]
        return (
          <article
            key={item.id}
            className="rounded-2xl border border-white/30 bg-white/55 p-3 shadow-md shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Icon className="h-4 w-4 text-teal-600" aria-hidden />
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 font-serif text-lg font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500">{item.note}</p>
          </article>
        )
      })}
    </section>
  )
}
