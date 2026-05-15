import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import type { DestinationDetail } from '../../database/interface/destination'
import type { DestinationDetailCopy } from '../../utils/destinationDetailCopy'
import type { DestinationDetailViewModel } from '../../utils/destinationDetailViewModel'

type DestinationHeroProps = {
  detail: DestinationDetail
  viewModel: DestinationDetailViewModel
  copy: DestinationDetailCopy
}

export function DestinationHero({ detail, viewModel, copy }: DestinationHeroProps) {
  const heroSrc = viewModel.heroImage

  return (
    <header
      id="section-hero"
      className="scroll-mt-28 overflow-hidden rounded-3xl border border-white/40 bg-white/40 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-sm"
    >
      <div className="relative aspect-[21/9] min-h-[200px] w-full max-md:aspect-[16/10]">
        {heroSrc ? (
          <img
            src={heroSrc}
            alt={detail.name}
            width={1680}
            height={720}
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-stone-200 to-slate-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-6">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            {copy.backToDestinationsList}
          </Link>
          {detail.isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/40 bg-amber-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-50 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {copy.featured}
            </span>
          ) : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200/90">
            {copy.heroKicker}
          </p>
          <h1 className="mt-2 max-w-4xl font-serif text-3xl font-semibold tracking-tight text-white drop-shadow md:text-4xl lg:text-5xl">
            {detail.name}
          </h1>
          {detail.shortDescription ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-100/95 md:text-base">
              {detail.shortDescription}
            </p>
          ) : (
            <p className="mt-3 max-w-2xl text-sm text-slate-200/90 md:text-base">
              {copy.defaultShort}
            </p>
          )}
        </div>
      </div>
    </header>
  )
}
