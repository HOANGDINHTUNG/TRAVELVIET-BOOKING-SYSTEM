import { Search } from 'lucide-react'

type ToursCatalogStickySearchProps = {
  visible: boolean
  onOpenSearch: () => void
}

/** Chỉ nút tìm kiếm cố định khi đã cuộn qua form đầy đủ. */
export function ToursCatalogStickySearch({
  visible,
  onOpenSearch,
}: ToursCatalogStickySearchProps) {
  return (
    <button
      type="button"
      className={`tours-vt-sticky-search-btn${visible ? ' is-visible' : ''}`}
      aria-label="Mở tìm kiếm tour"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={onOpenSearch}
    >
      <Search size={20} strokeWidth={2.4} aria-hidden />
      <span>Tìm tour</span>
    </button>
  )
}
