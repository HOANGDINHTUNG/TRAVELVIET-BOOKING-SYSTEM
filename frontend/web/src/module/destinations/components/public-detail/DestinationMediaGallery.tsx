import { Image as ImageIcon, Play } from 'lucide-react'
import type { DestinationDetailCopy } from '../../utils/destinationDetailCopy'
import type { DestinationDetailViewModel } from '../../utils/destinationDetailViewModel'

type DestinationMediaGalleryProps = {
  viewModel: DestinationDetailViewModel
  copy: DestinationDetailCopy
}

export function DestinationMediaGallery({ viewModel, copy }: DestinationMediaGalleryProps) {
  const thumbs = viewModel.imageMedia.filter((m) => m.url !== viewModel.heroImage)

  if (thumbs.length === 0 && viewModel.videoMedia.length === 0) {
    return (
      <section
        id="section-gallery"
        className="scroll-mt-28 rounded-2xl border border-dashed border-slate-300/80 bg-white/50 p-8 text-center text-sm text-slate-600 backdrop-blur-sm"
      >
        <ImageIcon className="mx-auto mb-2 h-8 w-8 text-slate-400" aria-hidden />
        {copy.noMedia}
      </section>
    )
  }

  return (
    <section
      id="section-gallery"
      className="scroll-mt-28 rounded-2xl border border-white/30 bg-white/50 p-4 shadow-lg shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-md md:p-5"
    >
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700/90">
            {copy.galleryKicker}
          </p>
          <h2 className="font-serif text-lg font-semibold text-slate-900">{copy.galleryTitle}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
        {thumbs.map((item) => (
          <figure
            key={item.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/40 bg-slate-100 shadow-inner"
          >
            <img
              src={item.url}
              alt={item.altText || copy.galleryTitle}
              width={640}
              height={480}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
            />
          </figure>
        ))}
        {viewModel.videoMedia.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-white/40 bg-slate-900/90 text-white shadow-inner transition hover:border-teal-300/50"
          >
            <Play className="h-10 w-10 opacity-90 transition group-hover:scale-110" aria-hidden />
            <span className="sr-only">{copy.videoLabel}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
