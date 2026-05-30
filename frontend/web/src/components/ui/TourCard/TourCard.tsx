import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, MapPin, PlayCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { showInfo } from '@/lib/toast'
import { TruncatedTextTooltip } from '@/components/ui/TruncatedTextTooltip'
import { TravelOfferCardFrame } from '@/components/ui/TravelOfferCard'
import { useDisplayMoney } from '@/hooks/useDisplayMoney'

import './TourCard.css'

/**
 * 4 mức "savingTier" — map từ chính sách marketing.
 * Khi không truyền, badge top-left sẽ ẩn.
 */
export type TourCardSavingTier =
  | 'gia_tot'
  | 'tiet_kiem'
  | 'tieu_chuan'
  | 'cao_cap'
  | 'hang_sang'

export type TourCardProps = {
  title: string
  detailPath: string
  imageUrl?: string | null
  location: string
  duration: string
  price: number
  savingTier?: TourCardSavingTier
  /** Thêm pill nhỏ bên dưới badge saving (VD: loại tour, tag) — tối đa ~2 dòng */
  cornerLabels?: string[]
  /**
   * string: hiển thị ảnh logo; undefined: dùng fallback brand mark; null: ẩn hoàn toàn phần brand mark/logo.
   */
  brandLogoUrl?: string | null
  priorityImage?: boolean
  onQuickView?: () => void
  className?: string
}

type SavingTierStyle = {
  bg: string
  text: string
  ring?: string
}

const SAVING_TIER_STYLES: Record<TourCardSavingTier, SavingTierStyle> = {
  gia_tot: {
    bg: 'rgba(254, 240, 138, 0.96)',
    text: '#854D0E',
    ring: 'rgba(217, 119, 6, 0.28)',
  },
  tiet_kiem: {
    bg: 'rgba(168, 132, 244, 0.18)',
    text: '#1B1B4D',
    ring: 'rgba(168, 132, 244, 0.32)',
  },
  tieu_chuan: {
    bg: 'rgba(244, 246, 251, 0.95)',
    text: '#1B1B4D',
    ring: 'rgba(15, 31, 61, 0.10)',
  },
  cao_cap: {
    bg: 'rgba(255, 222, 145, 0.92)',
    text: '#7A4A0F',
    ring: 'rgba(204, 134, 26, 0.32)',
  },
  hang_sang: {
    bg: '#0F1F3D',
    text: '#FFFFFF',
    ring: 'rgba(255, 255, 255, 0.22)',
  },
}

function normalizeOverlayText(value: string): string {
  return value
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasVisibleLabelContent(value: string): boolean {
  return value.length > 0 && /[\p{L}\p{N}]/u.test(value)
}

/**
 * TourCard — khung TravelOfferCardFrame (ảnh 3/4 + panel trắng nổi).
 */
export function TourCard({
  title,
  detailPath,
  imageUrl,
  location,
  duration,
  price,
  savingTier,
  cornerLabels,
  brandLogoUrl = '/icons.svg',
  priorityImage = false,
  onQuickView,
  className,
}: TourCardProps) {
  const { t } = useTranslation('translation')
  const priceLabel = useDisplayMoney(price > 0 ? price : null)
  const ariaLabel = t('tourCard.ariaLabel', { title, price: priceLabel })
  const badgeLabelRaw = savingTier ? t(`tourCard.savingTier.${savingTier}`) : ''
  const badgeLabel =
    typeof badgeLabelRaw === 'string' ? normalizeOverlayText(badgeLabelRaw) : ''
  const isBadgeLabelValid =
    hasVisibleLabelContent(badgeLabel) &&
    !badgeLabel.startsWith('tourCard.savingTier.')
  const badgeStyle = savingTier ? SAVING_TIER_STYLES[savingTier] : null
  const showBadge = Boolean(savingTier && isBadgeLabelValid && badgeStyle)

  const handleQuickView = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (onQuickView) {
      onQuickView()
      return
    }
    showInfo('tourCard.quickViewComingSoon')
  }

  const extraLabels = (cornerLabels ?? [])
    .map((s) => normalizeOverlayText(s))
    .filter((s) => hasVisibleLabelContent(s) && s.length >= 2)
    .slice(0, 3)

  const quickViewButton = (
    <button
      type="button"
      onClick={handleQuickView}
      className={cn(
        'absolute right-0 z-[11] inline-flex items-center gap-1 rounded-full',
        'bottom-[calc(100%+10px)]',
        'px-2 py-1 text-[11px] font-bold leading-none tracking-tight',
        'text-[#E8C547]',
        'bg-[rgba(26,26,26,0.78)] shadow-[0_2px_8px_rgba(0,0,0,0.35)]',
        'ring-1 ring-white/10 backdrop-blur-[2px]',
        'transition-[transform,background-color] duration-200 ease-out',
        'motion-safe:hover:bg-[rgba(26,26,26,0.9)] motion-safe:active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C547] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
      )}
    >
      <PlayCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
      <span className="pr-0.5">{t('tourCard.quickView')}</span>
    </button>
  )

  const topOverlay =
    showBadge || extraLabels.length > 0 ? (
      <div className="pointer-events-none relative">
        {showBadge && badgeStyle ? (
          <span
            className="inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold leading-none shadow-[0_2px_6px_rgba(15,23,42,0.08)]"
            style={{
              background: badgeStyle.bg,
              color: badgeStyle.text,
              boxShadow: badgeStyle.ring
                ? `0 2px 6px rgba(15,23,42,0.08), inset 0 0 0 1px ${badgeStyle.ring}`
                : undefined,
            }}
          >
            {badgeLabel}
          </span>
        ) : null}
        {/* {extraLabels.length > 0 ? (
          <div
            className={cn(
              'flex max-w-[min(200px,calc(100%-88px))] flex-col gap-1',
              showBadge ? 'mt-2' : '',
            )}
          >
            {extraLabels.map((label, i) => (
              <span
                key={`${i}-${label.slice(0, 12)}`}
                className="inline-flex w-fit max-w-full rounded-md border border-white/25 bg-black/35 px-2 py-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-white shadow-sm backdrop-blur-[2px]"
              >
                <span className="truncate">{label}</span>
              </span>
            ))}
          </div>
        ) : null} */}
      </div>
    ) : null

  return (
    <TravelOfferCardFrame
      ariaLabel={ariaLabel}
      imageUrl={imageUrl}
      priorityImage={priorityImage}
      className={className}
      widthMode="fixed"
      topOverlay={topOverlay}
      panelAction={quickViewButton}
      priceLabel={t('tourCard.priceFrom')}
      priceValue={priceLabel}
      ctaVariant="blue"
      cta={
        <Link to={detailPath}>{t('tourCard.viewDetail')}</Link>
      }
    >
      <div className="flex items-start gap-2.5">
        {brandLogoUrl === null ? null : brandLogoUrl ? (
          <img
            src={brandLogoUrl}
            alt=""
            aria-hidden
            className="mt-px h-[24px] w-auto max-w-[56px] shrink-0 object-contain object-left"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span
            aria-hidden
            className="mt-px inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#D4A84B_0%,#9A6B2E_100%)] text-[10px] font-bold text-white shadow-[0_2px_5px_rgba(154,107,46,0.35)] ring-1 ring-[#E8C878]/50"
          >
            {t('tourCard.brandMark')}
          </span>
        )}
        <TruncatedTextTooltip
          as="h3"
          text={title}
          lineClamp={2}
          side="top"
          className="min-h-[38px] min-w-0 flex-1 text-[14px] font-bold leading-[1.38] text-foreground"
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 text-[12.5px] font-medium text-muted-foreground">
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <MapPin
            className="h-[14px] w-[14px] shrink-0 text-muted-foreground"
            strokeWidth={1.75}
            aria-hidden
          />
          <TruncatedTextTooltip
            text={location}
            lineClamp={1}
            side="top"
            className="min-w-0 max-w-full"
          />
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5">
          <Clock
            className="h-[14px] w-[14px] text-muted-foreground"
            strokeWidth={1.75}
            aria-hidden
          />
          <span>{duration}</span>
        </span>
      </div>

      <div className="mt-3 h-px bg-border" aria-hidden />
    </TravelOfferCardFrame>
  )
}
