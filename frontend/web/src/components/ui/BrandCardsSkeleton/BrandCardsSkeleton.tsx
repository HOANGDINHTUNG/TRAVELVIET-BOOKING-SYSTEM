import { BRAND_WORDMARK_SRC } from '@/constants/brandAssets'
import './BrandCardsSkeleton.css'

export type BrandCardsSkeletonLayout = 'flex' | 'grid'

export type BrandCardsSkeletonProps = {
  count?: number
  layout?: BrandCardsSkeletonLayout
  columns?: 3 | 4
  ariaLabel: string
  tagline?: string
  className?: string
  /** Chiếm full width khi nằm trong grid cha (vd. fd-section__grid). */
  spanParentGrid?: boolean
  /** Chiều cao thẻ khớp tour/hotel card (carousel). */
  tallCards?: boolean
}

export function BrandCardsSkeleton({
  count = 4,
  layout = 'flex',
  columns = 4,
  ariaLabel,
  tagline = 'YOUR JOURNEY - YOUR VALUE',
  className = '',
  spanParentGrid = false,
  tallCards = false,
}: BrandCardsSkeletonProps) {
  const classes = [
    'brand-cards-skeleton',
    layout === 'grid' ? 'brand-cards-skeleton--grid' : 'brand-cards-skeleton--flex',
    layout === 'grid' ? `brand-cards-skeleton--cols-${columns}` : '',
    spanParentGrid ? 'brand-cards-skeleton--span-full' : '',
    tallCards ? 'brand-cards-skeleton--tall' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role="status" aria-busy="true" aria-live="polite" aria-label={ariaLabel}>
      {Array.from({ length: count }, (_, i) => (
        <article key={i} className="brand-cards-skeleton__card" aria-hidden>
          <div className="brand-cards-skeleton__brand">
            <img
              src={BRAND_WORDMARK_SRC}
              alt=""
              className="brand-cards-skeleton__logo"
              decoding="async"
            />
            <span className="brand-cards-skeleton__tagline">{tagline}</span>
          </div>
          <div className="brand-cards-skeleton__lines">
            <span className="brand-cards-skeleton__line brand-cards-skeleton__line--lg" />
            <span className="brand-cards-skeleton__line brand-cards-skeleton__line--md" />
            <span className="brand-cards-skeleton__line brand-cards-skeleton__line--sm" />
          </div>
        </article>
      ))}
    </div>
  )
}
