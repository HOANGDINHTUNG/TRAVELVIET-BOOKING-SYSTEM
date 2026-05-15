import { CalendarRange, MapPin, Users } from 'lucide-react'
import type { DestinationDetail } from '../../database/interface/destination'
import type { DestinationDetailViewModel } from '../../utils/destinationDetailViewModel'

type DestinationMetaChipsProps = {
  detail: DestinationDetail
  viewModel: DestinationDetailViewModel
}

export function DestinationMetaChips({ detail, viewModel }: DestinationMetaChipsProps) {
  const crowdStat = viewModel.stats.find((s) => s.id === 'crowdDefault')

  return (
    <div className="flex flex-wrap gap-2">
      {viewModel.locationParts ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-sm">
          <MapPin className="h-3.5 w-3.5 text-teal-600" aria-hidden />
          {viewModel.locationParts}
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-sm">
        <CalendarRange className="h-3.5 w-3.5 text-teal-600" aria-hidden />
        {viewModel.bestTime}
      </span>
      {crowdStat ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-sm">
          <Users className="h-3.5 w-3.5 text-teal-600" aria-hidden />
          {crowdStat.value}
        </span>
      ) : null}
      {detail.countryCode ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-900/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {detail.countryCode}
        </span>
      ) : null}
    </div>
  )
}
