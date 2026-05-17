import { Search } from 'lucide-react'
import type { TourCatalogUiFilters } from '../../utils/tourCatalogSearch'

type ToursCatalogSearchBarProps = {
  filters: TourCatalogUiFilters
  onChange: (patch: Partial<TourCatalogUiFilters>) => void
  onSubmit: () => void
}

export function ToursCatalogSearchBar({
  filters,
  onChange,
  onSubmit,
}: ToursCatalogSearchBarProps) {
  return (
    <div className="tours-vt-search-wrap">
      <form
        className="tours-vt-search-bar"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="tours-vt-search-field">
          <label htmlFor="tour-keyword">Từ khóa</label>
          <input
            id="tour-keyword"
            type="search"
            placeholder="Tên tour, điểm đến..."
            value={filters.keyword}
            onChange={(e) => onChange({ keyword: e.target.value })}
          />
        </div>

        <div className="tours-vt-search-field">
          <label htmlFor="tour-type">Loại</label>
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
        </div>

        <div className="tours-vt-search-field">
          <label htmlFor="tour-departure">Điểm khởi hành</label>
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
        </div>

        <div className="tours-vt-search-field">
          <label htmlFor="tour-destination">Điểm đến</label>
          <strong id="tour-destination">{filters.destinationLabel}</strong>
        </div>

        <div className="tours-vt-search-field">
          <label htmlFor="tour-date">Ngày đi</label>
          <input
            id="tour-date"
            type="date"
            value={filters.departDate}
            onChange={(e) => onChange({ departDate: e.target.value })}
          />
        </div>

        <button className="tours-vt-search-submit" type="submit">
          <Search size={18} strokeWidth={2.2} aria-hidden />
          Đổi tìm kiếm
        </button>
      </form>
    </div>
  )
}
