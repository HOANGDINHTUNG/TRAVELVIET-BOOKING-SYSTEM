import { useTranslation } from 'react-i18next'

export function FlightSidebarFiltersSkeleton() {
  const { t } = useTranslation('translation', { keyPrefix: 'flightsPage' })

  return (
    <ul className="fr-filters-skeleton__lines" aria-busy="true" aria-label={t('results.loadingFiltersAria')}>
      {Array.from({ length: 12 }, (_, i) => (
        <li key={`filter-sk-${i}`} className="fr-filters-skeleton__line" />
      ))}
    </ul>
  )
}
