import { useTranslation } from 'react-i18next'
import { BrandCardsSkeleton } from '@/components/ui/BrandCardsSkeleton'

type ComboSearchLoadingSkeletonProps = {
  progress: number
  showFlightSkeleton?: boolean
}

export function ComboSearchLoadingSkeleton({
  progress,
  showFlightSkeleton = true,
}: ComboSearchLoadingSkeletonProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'combosPage' })
  const { t: tHotels } = useTranslation('translation', { keyPrefix: 'hotelsPage' })

  return (
    <div className="csr-loading" aria-busy="true" aria-live="polite">
      <div className="csr-loading__progress-wrap">
        <div className="csr-loading__track">
          <div
            className="csr-loading__bar"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="csr-loading__labels">
          <p>{t('results.loadingMessage')}</p>
          <span>{progress}%</span>
        </div>
      </div>

      {showFlightSkeleton ? <div className="csr-skeleton csr-skeleton--flight" /> : null}
      <div className="csr-skeleton csr-skeleton--toolbar" />
      <BrandCardsSkeleton
        count={12}
        layout="grid"
        columns={4}
        tallCards
        className="csr-brand-cards-skeleton"
        ariaLabel={t('results.loadingCardsAria')}
        tagline={tHotels('hero.brandTagline')}
      />
    </div>
  )
}
