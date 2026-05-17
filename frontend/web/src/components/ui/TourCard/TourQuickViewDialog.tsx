import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText, MapPin, Maximize2, Phone, Utensils, X } from 'lucide-react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import type { TourCardSavingTier } from './TourCard'

const SAVING_BADGE: Record<
  TourCardSavingTier,
  { bg: string; text: string }
> = {
  tiet_kiem: { bg: 'rgba(168, 132, 244, 0.92)', text: '#fff' },
  tieu_chuan: { bg: 'rgba(244, 246, 251, 0.98)', text: '#1B1B4D' },
  cao_cap: { bg: 'rgba(255, 222, 145, 0.96)', text: '#7A4A0F' },
  hang_sang: { bg: '#0F1F3D', text: '#FFFFFF' },
}

export type TourQuickViewPayload = {
  title: string
  imageUrl?: string | null
  location: string
  duration: string
  price: number
  programCode: string
  attractions: string
  cuisine: string
  detailPath: string
  savingTier?: TourCardSavingTier
}

const DEFAULT_HOTLINE = 'tel:+0883459876'

function formatPriceVnd(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '—'
  return `${Math.round(value).toLocaleString('vi-VN')}đ`
}

type TourQuickViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tour: TourQuickViewPayload | null
  /** Override footer hotline; default matches Footer.tsx */
  hotlineHref?: string
}

export function TourQuickViewDialog({
  open,
  onOpenChange,
  tour,
  hotlineHref = DEFAULT_HOTLINE,
}: TourQuickViewDialogProps) {
  const { t } = useTranslation('translation')

  if (!tour) return null

  const priceLabel = formatPriceVnd(tour.price)
  const tierStyle = tour.savingTier
    ? SAVING_BADGE[tour.savingTier]
    : null
  const tierLabel = tour.savingTier
    ? t(`tourCard.savingTier.${tour.savingTier}`)
    : null

  const rowClass =
    'flex gap-3 text-[13px] leading-snug [&_svg]:mt-0.5 [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:shrink-0 [&_svg]:text-[#9CA3AF]'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'max-h-[min(92vh,720px)] w-[min(92vw,960px)] max-w-none gap-0 overflow-visible border-0 p-0',
          'rounded-2xl bg-white shadow-2xl',
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{tour.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {t('tourCard.quickViewModal.a11yDescription', { title: tour.title })}
        </DialogDescription>

        <DialogClose
          className={cn(
            'absolute -right-2 -top-2 z-[70] flex h-10 w-10 items-center justify-center rounded-full',
            'border border-black/8 bg-white text-[#1A1A1A] shadow-lg',
            'ring-2 ring-white transition-opacity hover:opacity-90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0046BE]',
          )}
          aria-label={t('tourCard.quickViewModal.close')}
        >
          <X className="h-5 w-5" strokeWidth={2} aria-hidden />
        </DialogClose>

        <div className="grid max-h-[min(92vh,720px)] overflow-hidden rounded-2xl md:grid-cols-[1.05fr_1fr]">
          {/* Ảnh trái */}
          <div className="relative min-h-[200px] bg-[#E5E8ED] md:min-h-[320px]">
            {tour.imageUrl ? (
              <img
                src={tour.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400"
              />
            )}

            {tierStyle && tierLabel && (
              <span
                className="pointer-events-none absolute left-4 top-4 z-[2] rounded-full px-3 py-1.5 text-[12px] font-bold leading-none shadow-sm"
                style={{ background: tierStyle.bg, color: tierStyle.text }}
              >
                {tierLabel}
              </span>
            )}

            <div
              className="pointer-events-none absolute bottom-4 right-4 z-[2] flex h-10 w-10 items-center justify-center rounded-lg bg-white/88 text-[#334155] shadow-md backdrop-blur-[2px]"
              aria-hidden
            >
              <Maximize2 className="h-[18px] w-[18px]" strokeWidth={2} />
            </div>
          </div>

          {/* Nội dung phải */}
          <div className="flex min-h-0 flex-col overflow-y-auto">
            <div className="flex-1 px-5 pb-4 pt-6 md:px-7 md:pt-8">
              <h2 className="text-[17px] font-extrabold leading-snug tracking-tight text-[#0A0A0A] md:text-[18px]">
                {tour.title}
              </h2>

              <div className="mt-5 space-y-4">
                <div className={rowClass}>
                  <FileText aria-hidden />
                  <span>
                    <span className="text-[#6B7280]">
                      {t('tourCard.quickViewModal.programCode')}
                    </span>{' '}
                    <span className="font-semibold text-[#0046BE]">
                      {tour.programCode}
                    </span>
                  </span>
                </div>
                <div className={rowClass}>
                  <MapPin aria-hidden />
                  <span>
                    <span className="text-[#6B7280]">
                      {t('tourCard.quickViewModal.attractions')}
                    </span>{' '}
                    <span className="font-medium text-[#111827]">
                      {tour.attractions}
                    </span>
                  </span>
                </div>
                <div className={rowClass}>
                  <Utensils aria-hidden />
                  <span>
                    <span className="text-[#6B7280]">
                      {t('tourCard.quickViewModal.cuisine')}
                    </span>{' '}
                    <span className="font-medium text-[#111827]">
                      {tour.cuisine}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-[#EEF1F6] px-5 py-4 md:px-7">
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-[#8B95A8]">
                  {t('tourCard.priceFrom')}
                </p>
                <p
                  className="text-[22px] font-bold leading-tight text-[#0046BE]"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {priceLabel}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={hotlineHref}
                  className={cn(
                    'inline-flex h-12 w-12 items-center justify-center rounded-full',
                    'bg-[#0046BE] text-white shadow-md',
                    'transition-[transform,filter] hover:brightness-110 motion-safe:hover:scale-105',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0046BE] focus-visible:ring-offset-2',
                  )}
                  aria-label={t('tourCard.quickViewModal.callUs')}
                >
                  <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
                </a>
                <Link
                  to={tour.detailPath}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    'inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5',
                    'bg-[#E31E24] text-[14px] font-bold text-white shadow-md',
                    'transition-[transform,filter] hover:brightness-110 motion-safe:hover:scale-[1.02]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31E24] focus-visible:ring-offset-2',
                  )}
                >
                  {t('tourCard.viewDetail')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
