import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { ImageOff } from 'lucide-react'
import type { TourMediaSummary } from '../types/publicTour'

type TourGalleryProps = {
  media: TourMediaSummary[] | null | undefined
  altFallback?: string
}

const PLACEHOLDER_GRADIENT =
  'bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50'

/**
 * Gallery với 1 ảnh main + thumbnail strip, hiệu ứng motion mượt khi đổi ảnh.
 * Empty state hiển thị placeholder thân thiện.
 */
function TourGallery({ media, altFallback }: TourGalleryProps) {
  const { t } = useTranslation('tours')
  const items = (media ?? []).filter((m) => Boolean(m?.mediaUrl))
  const [activeIndex, setActiveIndex] = useState(0)

  if (items.length === 0) {
    return (
      <div
        className={`flex aspect-[16/10] w-full items-center justify-center rounded-2xl text-slate-400 ${PLACEHOLDER_GRADIENT}`}
      >
        <ImageOff className="h-10 w-10" aria-hidden />
        <span className="ml-2 text-sm">{String(t('detail.noMedia'))}</span>
      </div>
    )
  }

  const active = items[Math.min(activeIndex, items.length - 1)]

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl">
        <motion.div
          key={active.id ?? active.mediaUrl}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative aspect-[16/10] w-full bg-slate-100"
        >
          {active.mediaType === 'video' ? (
            <video
              src={active.mediaUrl ?? undefined}
              className="h-full w-full object-cover"
              controls
              playsInline
            />
          ) : (
            <img
              src={active.mediaUrl ?? undefined}
              alt={active.altText ?? altFallback ?? 'Tour media'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </motion.div>
      </div>

      {items.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 md:grid-cols-6">
          {items.slice(0, 12).map((item, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={item.id ?? `${item.mediaUrl}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-md transition ${
                  isActive
                    ? 'ring-2 ring-[var(--color-primary,#0ea5e9)]'
                    : 'opacity-70 hover:opacity-100'
                }`}
                aria-label={`${String(t('detail.thumbnail'))} ${index + 1}`}
              >
                {item.mediaType === 'video' ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-900 text-[10px] font-medium text-white">
                    VIDEO
                  </div>
                ) : (
                  <img
                    src={item.mediaUrl ?? undefined}
                    alt={item.altText ?? `${altFallback ?? ''} ${index + 1}`}
                    loading="lazy"
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

export default TourGallery
