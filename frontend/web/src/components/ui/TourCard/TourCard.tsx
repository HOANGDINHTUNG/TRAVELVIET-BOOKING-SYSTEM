import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, MapPin, PlayCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { showInfo } from '@/lib/toast'
import { TruncatedTextTooltip } from '@/components/ui/TruncatedTextTooltip'
import { useDisplayMoney } from '@/hooks/useDisplayMoney'

import './TourCard.css'

/**
 * 4 mức "savingTier" — map từ chính sách marketing.
 * Khi không truyền, badge top-left sẽ ẩn.
 */
export type TourCardSavingTier =
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
  brandLogoUrl?: string
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

/**
 * TourCard 300×400 — một ảnh; vùng ảnh chia 4 phần dọc (3/4 trên = ảnh, 1/4 dưới = xám).
 * Panel trắng nổi đè lên phía dưới.
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
  const badgeLabel = savingTier
    ? t(`tourCard.savingTier.${savingTier}`)
    : null
  const badgeStyle = savingTier ? SAVING_TIER_STYLES[savingTier] : null

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
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)

  return (
    <article
      aria-label={ariaLabel}
      style={{ width: 300, height: 400 }}
      className={cn(
        'tv-tour-card group/tour relative isolate shrink-0 overflow-hidden rounded-[18px] bg-neutral-200',
        'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,23,42,0.05)]',
        'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1 motion-reduce:hover:translate-y-0',
        'hover:shadow-[0_2px_4px_rgba(15,23,42,0.06),0_18px_36px_rgba(15,23,42,0.14),0_0_0_1px_rgba(15,23,42,0.06)]',
        className,
      )}
    >
      {/* Nền ảnh full thẻ (z-0): 3/4 trên = ảnh, 1/4 dưới = xám; panel z-10 đè lên */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 overflow-hidden bg-[#C5CBD3]"
      >
        <div className="tv-tour-card__image-wrap absolute inset-x-0 top-0 h-3/4 bg-neutral-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              loading={priorityImage ? 'eager' : 'lazy'}
              fetchPriority={priorityImage ? 'high' : 'low'}
              decoding="async"
              className="tv-tour-card__image absolute inset-0 h-full w-full"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400" />
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-black/10 to-transparent"
      />

      {savingTier && badgeLabel && badgeStyle && (
        <span
          className="pointer-events-none absolute left-3 top-3 z-[2] inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold leading-none shadow-[0_2px_6px_rgba(15,23,42,0.08)]"
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
      )}

      {extraLabels.length > 0 && (
        <div
          className={cn(
            'pointer-events-none absolute left-3 z-[2] flex max-w-[min(200px,calc(100%-88px))] flex-col gap-1',
            savingTier && badgeLabel ? 'top-[46px]' : 'top-3',
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
      )}

      {/* Panel + Xem nhanh — nút luôn cách panel một khoảng cố định dù tên tour cao thấp */}
      <div className="absolute bottom-[14px] left-[10px] right-[10px] z-10">
        <div className="relative">
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

          <div
            className={cn(
              'tv-tour-card-panel overflow-hidden rounded-[16px] bg-card',
              'shadow-[0_4px_20px_rgba(15,23,42,0.12),0_2px_8px_rgba(15,23,42,0.06)]',
            )}
          >
            <div className="px-4 pb-3 pt-4">
              <div className="flex items-start gap-2.5">
                {brandLogoUrl ? (
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
            </div>

            <div className="relative flex min-h-[54px] items-stretch">
              <div className="flex min-w-0 flex-1 flex-col justify-center px-4 pb-3.5 leading-tight">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {t('tourCard.priceFrom')}
                </span>
                <span
                  className="truncate text-[19px] font-bold text-primary"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {priceLabel}
                </span>
              </div>

              <Link
                to={detailPath}
                className={cn(
                  'inline-flex shrink-0 items-center justify-center',
                  'min-w-[120px] px-5 py-3.5',
                  'bg-[#0046BE] text-[13px] font-bold text-white leading-none',
                  'rounded-tl-[24px] rounded-br-[16px]',
                  'transition-[filter,transform] duration-200 ease-out',
                  'hover:brightness-110 hover:scale-[1.02] motion-reduce:hover:scale-100',
                  'active:scale-[0.98]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0046BE] focus-visible:ring-offset-2',
                )}
              >
                {t('tourCard.viewDetail')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
