import type { TourCatalogUiFilters } from '../../utils/tourCatalogSearch'
import {
  priceSliderStep,
  type TourLineFacet,
} from '../../utils/tourCatalogFacets'
import { formatCurrencyVnd } from '../../../management/schedules/utils/currency'

type ToursCatalogSidebarProps = {
  filters: TourCatalogUiFilters
  tourLines: TourLineFacet[]
  priceBounds: { min: number; max: number }
  onChange: (patch: Partial<TourCatalogUiFilters>) => void
  onReset: () => void
}

export function ToursCatalogSidebar({
  filters,
  tourLines,
  priceBounds,
  onChange,
  onReset,
}: ToursCatalogSidebarProps) {
  const hasPriceRange = priceBounds.max > priceBounds.min
  const step = hasPriceRange
    ? priceSliderStep(priceBounds.min, priceBounds.max)
    : 1
  const effectiveMax = filters.maxPrice ?? priceBounds.max
  const budgetActive =
    filters.maxPrice != null && filters.maxPrice < priceBounds.max

  const toggleLine = (id: string) => {
    const set = new Set(filters.tourLines)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    onChange({ tourLines: Array.from(set) })
  }

  const toggleTransport = (id: string) => {
    const set = new Set(filters.transportTypes)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    onChange({ transportTypes: Array.from(set) })
  }

  return (
    <aside className="tours-vt-sidebar" aria-label="Bộ lọc tour">
      <div className="tours-vt-sidebar-head">
        <h2>Bộ lọc</h2>
        <button className="tours-vt-sidebar-reset" type="button" onClick={onReset}>
          Đặt lại
        </button>
      </div>

      <div className="tours-vt-esg-toggle">
        <span>ESG &amp; LEI</span>
        <input
          type="checkbox"
          checked={filters.esgOnly}
          onChange={(e) => onChange({ esgOnly: e.target.checked })}
          aria-label="Chỉ tour ESG và LEI"
        />
      </div>

      <div className="tours-vt-filter-block">
        <h3>Dòng tour</h3>
        {tourLines.map((line) => (
          <div className="tours-vt-check-row" key={line.id}>
            <label>
              <input
                type="checkbox"
                checked={filters.tourLines.includes(line.id)}
                onChange={() => toggleLine(line.id)}
              />
              {line.label}
            </label>
            <span className="count">{line.count}</span>
          </div>
        ))}
      </div>

      <div className="tours-vt-filter-block">
        <h3>Phương tiện</h3>
        <div className="tours-vt-check-row">
          <label>
            <input
              type="checkbox"
              checked={filters.transportTypes.includes('may_bay')}
              onChange={() => toggleTransport('may_bay')}
            />
            Máy bay
          </label>
        </div>
        <div className="tours-vt-check-row">
          <label>
            <input
              type="checkbox"
              checked={filters.transportTypes.includes('xe')}
              onChange={() => toggleTransport('xe')}
            />
            Xe
          </label>
        </div>
      </div>

      {priceBounds.max > 0 ? (
        <div className="tours-vt-filter-block">
          <div className="tours-vt-budget-head">
            <h3>Ngân sách tối đa</h3>
            {budgetActive ? (
              <button
                type="button"
                className="tours-vt-budget-clear"
                onClick={() => onChange({ minPrice: undefined, maxPrice: undefined })}
              >
                Bỏ giới hạn
              </button>
            ) : null}
          </div>
          <p className="tours-vt-budget-hint">
            Kéo để giới hạn giá tour; thả ở mức cao nhất để xem tất cả.
          </p>
          {hasPriceRange ? (
            <input
              className="tours-vt-range"
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={step}
              value={Math.min(Math.max(effectiveMax, priceBounds.min), priceBounds.max)}
              onChange={(e) => {
                const next = Number(e.target.value)
                const atCeiling = next >= priceBounds.max - step / 2
                onChange({
                  minPrice: undefined,
                  maxPrice: atCeiling ? undefined : next,
                })
              }}
              aria-valuemin={priceBounds.min}
              aria-valuemax={priceBounds.max}
              aria-valuenow={effectiveMax}
              aria-label="Ngân sách tối đa"
            />
          ) : (
            <input
              className="tours-vt-range"
              type="range"
              min={0}
              max={priceBounds.max}
              step={step}
              value={effectiveMax}
              disabled
              aria-label="Ngân sách tối đa"
            />
          )}
          <div className="tours-vt-range-labels">
            <span>{formatCurrencyVnd(priceBounds.min)}</span>
            <span className="tours-vt-range-labels__current">
              {budgetActive ? formatCurrencyVnd(effectiveMax) : 'Không giới hạn'}
            </span>
            <span>{formatCurrencyVnd(priceBounds.max)}</span>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
