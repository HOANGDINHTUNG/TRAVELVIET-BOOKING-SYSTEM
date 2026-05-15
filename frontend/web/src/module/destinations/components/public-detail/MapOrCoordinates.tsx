import { ExternalLink, Map } from 'lucide-react'
import type { DestinationDetail } from '../../database/interface/destination'
import type { DestinationDetailCopy } from '../../utils/destinationDetailCopy'
import { formatCoordinate } from '../../utils/destinationDetailFormatters'

type MapOrCoordinatesProps = {
  detail: DestinationDetail
  copy: DestinationDetailCopy
}

export function MapOrCoordinates({ detail, copy }: MapOrCoordinatesProps) {
  const lat = detail.latitude != null && detail.latitude !== '' ? Number(detail.latitude) : NaN
  const lng = detail.longitude != null && detail.longitude !== '' ? Number(detail.longitude) : NaN
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)
  const mapsHref = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : detail.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail.address)}`
      : null

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white/80 to-slate-50/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 text-slate-800">
        <Map className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
        <span className="text-sm font-semibold">{copy.facts.address}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {detail.address || copy.updating}
      </p>
      <dl className="mt-3 grid gap-1 text-xs text-slate-600">
        <div className="flex justify-between gap-2">
          <dt>{copy.facts.latitude}</dt>
          <dd className="font-mono text-slate-800">{formatCoordinate(detail.latitude, copy)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>{copy.facts.longitude}</dt>
          <dd className="font-mono text-slate-800">{formatCoordinate(detail.longitude, copy)}</dd>
        </div>
      </dl>
      {mapsHref ? (
        <a
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline-offset-4 transition hover:text-teal-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Google Maps
        </a>
      ) : null}
    </div>
  )
}
