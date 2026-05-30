import { cloneElement, isValidElement, type CSSProperties, type ReactNode } from 'react'

import { OptimizedImage } from '@/components/common/media/OptimizedImage'
import { cn } from '@/lib/utils'

import './TravelOfferCardFrame.css'

export type TravelOfferCardCtaVariant = 'blue' | 'yellow'

export type TravelOfferCardFrameProps = {
  ariaLabel: string
  imageUrl?: string | null
  imageAlt?: string
  priorityImage?: boolean
  className?: string
  /** fixed = 310×420; fluid = full width of parent (grid), giữ chiều cao cố định */
  widthMode?: 'fixed' | 'fluid'
  topOverlay?: ReactNode
  panelAction?: ReactNode
  children: ReactNode
  priceLabel: string
  priceValue: ReactNode
  priceSuffix?: ReactNode
  cta: ReactNode
  ctaVariant?: TravelOfferCardCtaVariant
}

export function TravelOfferCardFrame({
  ariaLabel,
  imageUrl,
  imageAlt = '',
  priorityImage = false,
  className,
  widthMode = 'fixed',
  topOverlay,
  panelAction,
  children,
  priceLabel,
  priceValue,
  priceSuffix,
  cta,
  ctaVariant = 'yellow',
}: TravelOfferCardFrameProps) {
  const ctaClassName = cn(
    'tv-offer-card__cta',
    ctaVariant === 'blue' ? 'tv-offer-card__cta--blue' : 'tv-offer-card__cta--yellow',
  )

  const ctaNode = isValidElement<{ className?: string }>(cta)
    ? cloneElement(cta, {
        className: cn(ctaClassName, cta.props.className),
      })
    : cta

  const sizeStyle: CSSProperties | undefined =
    widthMode === 'fluid'
      ? {
          width: '100%',
          maxWidth: 'var(--home-tour-card-width, 310px)',
          height: 'var(--home-tour-card-height, 420px)',
        }
      : {
          width: 'var(--home-tour-card-width, 310px)',
          height: 'var(--home-tour-card-height, 420px)',
        }

  return (
    <article
      aria-label={ariaLabel}
      style={sizeStyle}
      className={cn(
        'tv-offer-card tv-tour-card group/offer relative isolate shrink-0 overflow-hidden rounded-[18px] bg-neutral-200',
        widthMode === 'fluid' ? 'tv-offer-card--fluid' : 'tv-offer-card--fixed',
        'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,23,42,0.05)]',
        'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1 motion-reduce:hover:translate-y-0',
        'hover:shadow-[0_2px_4px_rgba(15,23,42,0.06),0_18px_36px_rgba(15,23,42,0.14),0_0_0_1px_rgba(15,23,42,0.06)]',
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-[#C5CBD3]">
        <div className="tv-offer-card__image-wrap absolute inset-x-0 top-0 h-3/4 bg-neutral-200">
          {imageUrl ? (
            <OptimizedImage
              src={imageUrl}
              alt=""
              priority={priorityImage}
              width={310}
              height={310}
              cloudinaryWidth={620}
              className="tv-offer-card__image absolute inset-0 h-full w-full"
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

      {topOverlay ? <div className="absolute left-3 top-3 z-[2]">{topOverlay}</div> : null}

      <div className="absolute bottom-[4px] left-[5px] right-[5px] z-10">
        <div className="relative">
          {panelAction}

          <div className="tv-offer-card__panel overflow-hidden rounded-[16px] bg-card">
            <div className="tv-offer-card__body">{children}</div>

            <div
              className={cn(
                'tv-offer-card__footer',
                ctaVariant === 'yellow' && 'tv-offer-card__footer--corner-cta',
              )}
            >
              <div className="tv-offer-card__price">
                <span className="tv-offer-card__price-label">{priceLabel}</span>
                <span className="tv-offer-card__price-value-line">
                  <span className="tv-offer-card__price-value truncate">{priceValue}</span>
                  {priceSuffix ? (
                    <span className="tv-offer-card__price-suffix">{priceSuffix}</span>
                  ) : null}
                </span>
              </div>
              {ctaNode}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
