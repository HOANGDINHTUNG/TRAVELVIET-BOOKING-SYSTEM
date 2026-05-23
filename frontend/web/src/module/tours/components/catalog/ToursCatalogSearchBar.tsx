import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Calendar, MapPin, Plane, Search } from 'lucide-react'
import type { TourCatalogUiFilters } from '../../utils/tourCatalogSearch'

export type ToursCatalogSearchBarHandle = {
  focusKeyword: () => void
}

type ToursCatalogSearchBarProps = {
  filters: TourCatalogUiFilters
  onChange: (patch: Partial<TourCatalogUiFilters>) => void
  onSubmit: () => void
}

export const ToursCatalogSearchBar = forwardRef<
  ToursCatalogSearchBarHandle,
  ToursCatalogSearchBarProps
>(function ToursCatalogSearchBar({ filters, onChange, onSubmit }, ref) {
  const keywordInputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focusKeyword: () => {
      const input = keywordInputRef.current
      if (!input) return
      input.focus({ preventScroll: true })
      input.select()
    },
  }))

  return (
    <form
      className="tours-vt-search-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <p className="tours-vt-search-form__kicker">Tìm tour phù hợp</p>
      <div className="tours-vt-search-form__grid">
        <label className="tours-vt-search-cell tours-vt-search-cell--wide">
          <span className="tours-vt-search-cell__label">
            <Search size={14} strokeWidth={2.4} aria-hidden />
            Từ khóa
          </span>
          <input
            ref={keywordInputRef}
            id="tour-keyword"
            type="search"
            placeholder="Tên tour, điểm đến..."
            value={filters.keyword}
            onChange={(e) => onChange({ keyword: e.target.value })}
          />
        </label>

        <label className="tours-vt-search-cell">
          <span className="tours-vt-search-cell__label">
            <Plane size={14} strokeWidth={2.4} aria-hidden />
            Loại
          </span>
          <select
            id="tour-type"
            value={filters.scope}
            onChange={(e) =>
              onChange({
                scope: e.target.value as TourCatalogUiFilters['scope'],
                destinationLabel:
                  e.target.value === 'international'
                    ? 'Du lịch nước ngoài'
                    : 'Du lịch trong nước',
              })
            }
          >
            <option value="all">Tất cả</option>
            <option value="domestic">Trong nước</option>
            <option value="international">Nước ngoài</option>
          </select>
        </label>

        <label className="tours-vt-search-cell">
          <span className="tours-vt-search-cell__label">
            <MapPin size={14} strokeWidth={2.4} aria-hidden />
            Khởi hành
          </span>
          <select
            id="tour-departure"
            value={filters.departure}
            onChange={(e) => onChange({ departure: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
        </label>

        <label className="tours-vt-search-cell">
          <span className="tours-vt-search-cell__label">
            <MapPin size={14} strokeWidth={2.4} aria-hidden />
            Điểm đến
          </span>
          <strong className="tours-vt-search-cell__value" id="tour-destination">
            {filters.destinationLabel}
          </strong>
        </label>

        <label className="tours-vt-search-cell">
          <span className="tours-vt-search-cell__label">
            <Calendar size={14} strokeWidth={2.4} aria-hidden />
            Ngày đi
          </span>
          <input
            id="tour-date"
            type="date"
            value={filters.departDate}
            onChange={(e) => onChange({ departDate: e.target.value })}
          />
        </label>

        <button className="tours-vt-search-submit" type="submit">
          <Search size={18} strokeWidth={2.4} aria-hidden />
          <span>Tìm tour</span>
        </button>
      </div>
    </form>
  )
})
