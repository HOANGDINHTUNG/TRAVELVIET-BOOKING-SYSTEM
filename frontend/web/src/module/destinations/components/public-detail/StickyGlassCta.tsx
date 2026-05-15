import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import type { DestinationDetailCopy } from '../../utils/destinationDetailCopy'

type StickyGlassCtaProps = {
  toursHref: string
  copy: DestinationDetailCopy
  className?: string
  variant?: 'card' | 'bar'
}

export function StickyGlassCta({
  toursHref,
  copy,
  className = '',
  variant = 'card',
}: StickyGlassCtaProps) {
  if (variant === 'bar') {
    return (
      <div
        className={`border-t border-white/25 bg-white/55 p-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-lg ${className}`}
      >
        <Link
          to={toursHref}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-teal-500 hover:to-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:scale-[0.99]"
        >
          {copy.toursGlassCta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl border border-white/20 bg-white/60 p-5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur-lg ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700">
          <Compass className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-800/90">
            {copy.toursGlassKicker}
          </p>
          <p className="mt-1 font-serif text-lg font-semibold text-slate-900">{copy.toursGlassTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy.toursGlassCopy}</p>
        </div>
      </div>
      <Link
        to={toursHref}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:from-teal-500 hover:to-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:scale-[0.99]"
      >
        {copy.toursGlassCta}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  )
}