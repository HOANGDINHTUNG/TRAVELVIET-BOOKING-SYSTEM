import { Calendar, ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  CATALOG_DEPARTURE_OPTIONS,
  CATALOG_DESTINATION_OPTIONS,
  type CatalogBudgetKey,
  type CatalogScope,
  type CatalogTransportFilter,
  type ComboCatalogFiltersState,
} from '../hooks/useComboCatalogFilters'

type ComboCatalogFiltersProps = {
  filters: ComboCatalogFiltersState
  onPatch: (partial: Partial<ComboCatalogFiltersState>) => void
  onReset: () => void
  onApply: () => void
}

const BUDGET_KEYS: CatalogBudgetKey[] = ['under5', '5to10', '10to20', 'over20']

function StarRadioRow({
  stars,
  checked,
  onChange,
}: {
  stars: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="cc-filter__star-row">
      <input type="radio" name="catalog-stars" checked={checked} onChange={onChange} />
      <span className="cc-filter__star-icons" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < stars ? 'is-on' : 'is-off'}>
            ★
          </span>
        ))}
      </span>
    </label>
  )
}

export function ComboCatalogFilters({
  filters,
  onPatch,
  onReset,
  onApply,
}: ComboCatalogFiltersProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'combosPage' })

  const scopeOptions: { id: CatalogScope; label: string }[] = [
    { id: 'domestic', label: t('catalog.filters.domestic') },
    { id: 'international', label: t('catalog.filters.international') },
  ]

  const transportOptions: { id: CatalogTransportFilter; label: string }[] = [
    { id: 'car', label: t('catalog.filters.transportCar') },
    { id: 'flight', label: t('catalog.filters.transportFlight') },
  ]

  return (
    <aside className="cc-filters" aria-label={t('catalog.filters.title')}>
      <header className="cc-filters__head">
        <span className="cc-filters__title">
          <SlidersHorizontal size={16} strokeWidth={2.2} aria-hidden />
          {t('catalog.filters.title')}
        </span>
        <button type="button" className="cc-filters__reset" onClick={onReset}>
          <RotateCcw size={13} aria-hidden />
          {t('catalog.filters.reset')}
        </button>
      </header>

      <div className="cc-filters__body">
        <fieldset className="cc-filter__group">
          <legend className="cc-filter__label">{t('catalog.filters.region')}</legend>
          <div className="cc-filter__pills cc-filter__pills--2">
            {scopeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`cc-filter__pill${filters.scope === opt.id ? ' is-active' : ''}`}
                onClick={() => onPatch({ scope: opt.id })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="cc-filter__group">
          <legend className="cc-filter__label">{t('catalog.filters.transport')}</legend>
          <div className="cc-filter__pills cc-filter__pills--2">
            {transportOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`cc-filter__pill${filters.transport === opt.id ? ' is-active' : ''}`}
                onClick={() =>
                  onPatch({
                    transport: filters.transport === opt.id ? 'all' : opt.id,
                  })
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="cc-filter__group">
          <label className="cc-filter__label" htmlFor="cc-departure">
            {t('catalog.filters.departurePoint')}
          </label>
          <span className="cc-filter__select-wrap">
            <select
              id="cc-departure"
              value={filters.departure}
              onChange={(e) => onPatch({ departure: e.target.value })}
            >
              {CATALOG_DEPARTURE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="cc-filter__chevron" aria-hidden />
          </span>
        </div>

        <div className="cc-filter__group">
          <label className="cc-filter__label" htmlFor="cc-destination">
            {t('catalog.filters.destination')}
          </label>
          <span className="cc-filter__select-wrap">
            <select
              id="cc-destination"
              value={filters.destination}
              onChange={(e) => onPatch({ destination: e.target.value })}
            >
              {CATALOG_DESTINATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="cc-filter__chevron" aria-hidden />
          </span>
        </div>

        <div className="cc-filter__group">
          <label className="cc-filter__label" htmlFor="cc-depart-date">
            {t('catalog.filters.departFrom')}
          </label>
          <span className="cc-filter__date-wrap">
            <input
              id="cc-depart-date"
              type="date"
              value={filters.departDate}
              onChange={(e) => onPatch({ departDate: e.target.value })}
            />
            <Calendar size={15} className="cc-filter__date-icon" aria-hidden />
          </span>
        </div>

        <fieldset className="cc-filter__group">
          <legend className="cc-filter__label">{t('catalog.filters.starRating')}</legend>
          <div className="cc-filter__stars">
            {[5, 4, 3, 2, 1].map((stars) => (
              <StarRadioRow
                key={stars}
                stars={stars}
                checked={filters.minStars === stars}
                onChange={() =>
                  onPatch({
                    minStars: filters.minStars === stars ? null : stars,
                  })
                }
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="cc-filter__group">
          <legend className="cc-filter__label">{t('catalog.filters.budget')}</legend>
          <div className="cc-filter__budget-grid">
            {BUDGET_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className={`cc-filter__pill${filters.budget === key ? ' is-active' : ''}`}
                onClick={() =>
                  onPatch({
                    budget: filters.budget === key ? null : key,
                  })
                }
              >
                {t(`catalog.filters.budget_${key}`)}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <button type="button" className="cc-filters__apply" onClick={onApply}>
        {t('catalog.filters.apply')}
      </button>
    </aside>
  )
}
