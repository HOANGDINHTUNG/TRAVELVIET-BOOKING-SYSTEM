import { useTranslation } from 'react-i18next'

type FlightSearchLoadingSkeletonProps = {
  progress: number
}

export function FlightSearchLoadingSkeleton({ progress }: FlightSearchLoadingSkeletonProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'flightsPage' })

  return (
    <div className="fr-loading" aria-busy="true" aria-live="polite">
      <div className="fr-quick fr-quick--skeleton">
        {[t('results.lowestPrice'), t('results.shortest'), t('results.sortBy')].map((label) => (
          <div key={label} className="fr-quick__card fr-quick__card--skeleton">
            <span className="fr-quick__label">{label}</span>
            <span className="fr-skeleton fr-skeleton--inline" />
          </div>
        ))}
      </div>

      <div className="fr-loading__progress-wrap">
        <div className="fr-loading__track">
          <div
            className="fr-loading__bar"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="fr-loading__labels">
          <p>{t('results.loadingMessage')}</p>
          <span>{progress}%</span>
        </div>
      </div>

      <div className="fr-loading__cards" aria-label={t('results.loadingCardsAria')}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={`fr-card-sk-${i}`} className="fr-skeleton fr-skeleton--card" />
        ))}
      </div>
    </div>
  )
}
