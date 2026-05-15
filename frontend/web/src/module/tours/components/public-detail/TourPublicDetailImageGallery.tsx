import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { ImageIcon, ImageOff } from 'lucide-react'
import type { TourMediaSummary } from '../../types/publicTour'

type TourPublicDetailImageGalleryProps = {
  media: TourMediaSummary[] | null | undefined
  altFallback?: string | null
}

const PLACEHOLDER =
  'flex aspect-[16/10] w-full items-center justify-center rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-100 via-white to-teal-50/50 text-slate-400 shadow-inner'

/**
 * Gallery: khung cố định (CLS), LCP ảnh đầu, overlay + bộ đếm; filmstrip cuộn ngang trên mobile.
 */
export function TourPublicDetailImageGallery({
  media,
  altFallback,
}: TourPublicDetailImageGalleryProps) {
  const { t } = useTranslation('tours')
  const items = (media ?? []).filter((m) => Boolean(m?.mediaUrl))
  const [activeIndex, setActiveIndex] = useState(0)

  if (items.length === 0) {
    return (
      <div className={PLACEHOLDER}>
        <ImageOff className="h-10 w-10" aria-hidden />
        <span className="ml-2 text-sm font-medium">{String(t('detail.noMedia'))}</span>
      </div>
    )
  }

  const active = items[Math.min(activeIndex, items.length - 1)]
  const isFirst = activeIndex === 0
  const total = items.length

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-slate-900 shadow-2xl shadow-slate-900/25 ring-1 ring-slate-900/10">
        <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
          <motion.div
            key={active.id ?? active.mediaUrl ?? activeIndex}
            initial={{ opacity: 0.001 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {active.mediaType?.toLowerCase() === 'video' ? (
              <video
                src={active.mediaUrl ?? undefined}
                className="h-full w-full object-cover"
                controls
                playsInline
              />
            ) : (
              <img
                src={active.mediaUrl ?? undefined}
                alt={active.altText ?? altFallback ?? 'Tour'}
                width={1600}
                height={900}
                decoding="async"
                fetchPriority={isFirst ? 'high' : 'low'}
                loading={isFirst ? 'eager' : 'lazy'}
                className="h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.03]"
              />
            )}
          </motion.div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent"
            aria-hidden
          />
          {total > 1 ? (
            <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md md:bottom-4 md:right-4">
              <ImageIcon className="h-3.5 w-3.5 opacity-90" aria-hidden />
              {String(t('detail.galleryCount', { current: activeIndex + 1, total }))}
            </div>
          ) : null}
        </div>
      </div>

      {total > 1 ? (
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin] md:mx-0 md:grid md:min-h-[76px] md:grid-cols-6 md:gap-2.5 md:overflow-visible">
          {items.slice(0, 14).map((item, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={item.id ?? `${item.mediaUrl}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square w-[4.25rem] shrink-0 snap-start overflow-hidden rounded-xl border-2 transition md:w-auto ${
                  isActive
                    ? 'border-teal-500 shadow-lg shadow-teal-600/25 ring-2 ring-teal-400/40 md:scale-[1.02]'
                    : 'border-white/40 opacity-80 hover:opacity-100 md:border-slate-200/90'
                }`}
                aria-label={`${String(t('detail.thumbnail'))} ${index + 1}`}
              >
                {item.mediaType?.toLowerCase() === 'video' ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-900 text-[10px] font-bold tracking-wide text-white">
                    ▶
                  </div>
                ) : (
                  <img
                    src={item.mediaUrl ?? undefined}
                    alt=""
                    width={160}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                )}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
