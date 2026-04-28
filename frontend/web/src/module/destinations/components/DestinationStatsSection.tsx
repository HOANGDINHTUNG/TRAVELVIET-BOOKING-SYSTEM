import { CalendarDays, Camera, Compass, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  DestinationDetailStat,
  DestinationDetailStatId,
} from '../utils/destinationDetailViewModel'

type DestinationStatsSectionProps = {
  stats: DestinationDetailStat[]
}

const statIcons: Record<DestinationDetailStatId, LucideIcon> = {
  idealTime: CalendarDays,
  crowdDefault: Compass,
  media: Camera,
  contentBlocks: Sparkles,
}

export function DestinationStatsSection({ stats }: DestinationStatsSectionProps) {
  return (
    <section className="destination-detail-section">
      <div className="destination-detail-stat-grid">
        {stats.map((item) => {
          const Icon = statIcons[item.id]
          return (
            <article className="destination-detail-stat" key={item.label}>
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}
