import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  Eye,
  Grid3x3,
  Image,
  LayoutList,
  MapPin,
  Tag,
  Users,
} from 'lucide-react'
import {
  catalogFiltersToServerParams,
  catalogHeroCopy,
  catalogDefaultFilters,
  buildTourCatalogUrl,
  parseTourCatalogFilters,
  type TourCatalogUiFilters,
} from '../utils/tourCatalogSearch'
import {
  buildTourLineFacets,
  hasTourLineTag,
  priceBounds,
  sortCatalogTours,
  tourMatchesDeparture,
  tourMatchesLine,
  tourMatchesPrice,
  tourMatchesTransport,
} from '../utils/tourCatalogFacets'
import {
  hasSustainabilityScores,
  resolveEsgScore,
  resolveLeiScore,
} from '../utils/tourSustainability'
import { tourApi } from '../../../api/server/Tour.api'
import { EmptyState } from '../../../components/common/ui/EmptyState'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import { Footer } from '../../../components/Footer/Footer'
import {
  TourQuickViewDialog,
  type TourQuickViewPayload,
} from '../../../components/ui/TourCard/TourQuickViewDialog'
import type { Tour } from '../../home/database/interface/publicTravel'
import { ToursCatalogHero } from '../components/catalog/ToursCatalogHero'
import { ToursCatalogSearchBar } from '../components/catalog/ToursCatalogSearchBar'
import { ToursCatalogSidebar } from '../components/catalog/ToursCatalogSidebar'
import { ToursCatalogFab } from '../components/catalog/ToursCatalogFab'
import { buildTourSlug } from '../utils/slug'
import { inclusionBadgeLabels } from '../utils/tourInclusionBadges'
import {
  catalogDepartureCity,
  catalogRemainingSeats,
  formatCatalogDepartureDate,
  resolveCatalogListPrice,
} from '../utils/tourListingDisplay'
import '../styles/ToursCatalogCards.css'
import '../styles/ToursCatalogLayout.css'

const formatListingPrice = (price: number) =>
  `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(price)}đ`

function tourListingBadge(tour: Tour): { kind: 'deal' | 'standard' | 'esg'; label: string } {
  const esg = resolveEsgScore(tour)
  if (hasTourLineTag(tour, 'esg') || (esg != null && esg >= 85)) {
    return { kind: 'esg', label: 'ESG & LEI' }
  }
  if (hasTourLineTag(tour, 'cao_cap')) return { kind: 'standard', label: 'Cao cấp' }
  if (hasTourLineTag(tour, 'tieu_chuan')) return { kind: 'standard', label: 'Tiêu chuẩn' }
  if (hasTourLineTag(tour, 'tiet_kiem')) return { kind: 'deal', label: 'Tiết kiệm' }
  if (hasTourLineTag(tour, 'gia_tot')) return { kind: 'deal', label: 'Giá tốt' }
  return { kind: 'deal', label: 'Giá tốt' }
}

function ToursPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draftFilters, setDraftFilters] = useState<TourCatalogUiFilters>(() =>
    parseTourCatalogFilters(searchParams),
  )
  const [quickView, setQuickView] = useState<TourQuickViewPayload | null>(null)
  const [quickOpen, setQuickOpen] = useState(false)

  const appliedFilters = useMemo(
    () => parseTourCatalogFilters(searchParams),
    [searchParams],
  )

  useEffect(() => {
    if (!searchParams.toString()) {
      navigate('/tours?domesticOnly=true', { replace: true })
    }
  }, [navigate, searchParams])

  useEffect(() => {
    setDraftFilters(appliedFilters)
  }, [appliedFilters])

  const catalogSearchKey = searchParams.toString()

  useEffect(() => {
    let isActive = true

    async function loadTours() {
      if (!catalogSearchKey) return

      setLoading(true)
      setError(null)

      try {
        const serverFilter = catalogFiltersToServerParams(
          parseTourCatalogFilters(new URLSearchParams(catalogSearchKey)),
        )
        const data = await tourApi.searchPublicTours(serverFilter)
        if (isActive) setTours(data)
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Không thể tải danh sách tour.',
          )
        }
      } finally {
        if (isActive) setLoading(false)
      }
    }

    void loadTours()
    return () => {
      isActive = false
    }
  }, [catalogSearchKey])

  const translateTourField = useCallback(
    (tour: Tour, field: 'title' | 'days' | 'location', fallback: string) => {
      if (!tour.translationKey) return fallback
      const key = `data.tours.${tour.translationKey}.${field}`
      return i18n.exists(key) ? t(key) : fallback
    },
    [i18n, t],
  )

  const hero = useMemo(() => catalogHeroCopy(appliedFilters), [appliedFilters])
  const bounds = useMemo(() => priceBounds(tours), [tours])
  const lineFacets = useMemo(() => buildTourLineFacets(tours), [tours])

  const filteredTours = useMemo(() => {
    const matched = tours.filter((tour) => {
      if (!tourMatchesDeparture(tour, appliedFilters.departure)) return false
      if (!tourMatchesTransport(tour, appliedFilters.transportTypes)) return false
      /* esgOnly đã lọc phía server khi bật toggle */
      if (appliedFilters.tourLines.length > 0) {
        const ok = appliedFilters.tourLines.some((line) => tourMatchesLine(tour, line))
        if (!ok) return false
      }
      if (!tourMatchesPrice(tour, appliedFilters.minPrice, appliedFilters.maxPrice)) {
        return false
      }
      return true
    })
    return sortCatalogTours(
      matched,
      appliedFilters.sortBy,
      appliedFilters.sortDir,
    )
  }, [appliedFilters, tours])

  const applyFilters = useCallback(
    (next: TourCatalogUiFilters) => {
      navigate(buildTourCatalogUrl(next))
    },
    [navigate],
  )

  const resetFilters = () => {
    applyFilters({
      ...catalogDefaultFilters,
      scope: appliedFilters.scope,
      sortBy: appliedFilters.sortBy,
      sortDir: appliedFilters.sortDir,
      view: appliedFilters.view,
    })
  }

  const openQuickView = (tour: Tour, title: string, days: string, location: string) => {
    const detailSlug = buildTourSlug(tour.title, tour.id)
    setQuickView({
      title,
      imageUrl: tour.image,
      location,
      duration: days,
      price: tour.price,
      programCode: `TV${String(tour.id).padStart(4, '0')}`,
      attractions: tour.highlights.slice(0, 3).join(' · ') || '—',
      cuisine: 'Ẩm thực địa phương',
      detailPath: `/tour/${detailSlug}`,
    })
    setQuickOpen(true)
  }

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Mới nhất' },
    { value: 'basePrice:asc', label: 'Giá thấp → cao' },
    { value: 'basePrice:desc', label: 'Giá cao → thấp' },
    { value: 'durationDays:asc', label: 'Thời lượng ngắn' },
  ]

  const currentSort = `${appliedFilters.sortBy}:${appliedFilters.sortDir}`

  if (!catalogSearchKey) {
    return <PageLoader label="Đang mở danh sách tour..." />
  }

  if (loading) {
    return <PageLoader label="Đang tải danh sách tour..." />
  }

  if (error && tours.length === 0) {
    return (
      <>
        <ErrorBlock message={error} />
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="tours-vt-page tours-catalog-page">
        <ToursCatalogHero title={hero.title} lead={hero.lead} />

        <ToursCatalogSearchBar
          filters={draftFilters}
          onChange={(patch) => setDraftFilters((prev) => ({ ...prev, ...patch }))}
          onSubmit={() => applyFilters(draftFilters)}
        />

        <div className="tours-vt-body">
          <ToursCatalogSidebar
            filters={draftFilters}
            tourLines={lineFacets}
            priceBounds={bounds}
            onChange={(patch) => {
              const next = { ...draftFilters, ...patch }
              setDraftFilters(next)
              applyFilters(next)
            }}
            onReset={resetFilters}
          />

          <section aria-label="Kết quả tour">
            <div className="tours-vt-main-toolbar">
              <p className="tours-vt-results-count">
                Kết quả: <strong>{filteredTours.length}</strong> chương trình tour
              </p>
              <div className="tours-vt-toolbar-actions">
                <label className="tours-vt-sort">
                  Sắp xếp theo
                  <select
                    value={currentSort}
                    onChange={(e) => {
                      const [sortBy, sortDir] = e.target.value.split(':') as [
                        TourCatalogUiFilters['sortBy'],
                        'asc' | 'desc',
                      ]
                      const next = { ...appliedFilters, sortBy, sortDir }
                      applyFilters(next)
                    }}
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="tours-vt-view-toggle" role="group" aria-label="Chế độ xem">
                  <button
                    type="button"
                    className={appliedFilters.view === 'grid' ? 'is-active' : ''}
                    aria-label="Lưới"
                    onClick={() => applyFilters({ ...appliedFilters, view: 'grid' })}
                  >
                    <Grid3x3 size={18} aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={appliedFilters.view === 'list' ? 'is-active' : ''}
                    aria-label="Danh sách"
                    onClick={() => applyFilters({ ...appliedFilters, view: 'list' })}
                  >
                    <LayoutList size={18} aria-hidden />
                  </button>
                </div>
              </div>
            </div>

            {tours.length === 0 ? (
              <EmptyState title="Danh sách tour đang trống." />
            ) : filteredTours.length === 0 ? (
              <div className="catalog-empty">
                <Tag size={24} strokeWidth={1.8} aria-hidden />
                <div>
                  <h2>Không có tour phù hợp</h2>
                  <p>Thử đổi bộ lọc hoặc nhấn Đặt lại.</p>
                </div>
                <button type="button" onClick={resetFilters}>
                  Đặt lại
                </button>
              </div>
            ) : (
              <div
                className={`tours-vt-grid catalog-grid ${
                  appliedFilters.view === 'list' ? 'is-list' : 'is-grid'
                }`}
              >
                {filteredTours.map((tour) => {
                  const title = translateTourField(tour, 'title', tour.title)
                  const days = translateTourField(tour, 'days', tour.days)
                  const location = translateTourField(tour, 'location', tour.location)
                  const provinceLine =
                    tour.destinationProvince?.trim() || location || '—'
                  const departCity = catalogDepartureCity(tour, provinceLine)
                  const nextDepart = formatCatalogDepartureDate(tour)
                  const seatsLeft = catalogRemainingSeats(tour)
                  const inclusionBadges = inclusionBadgeLabels(tour.inclusionFlags)
                  const listPrice = resolveCatalogListPrice(tour)
                  const badge = tourListingBadge(tour)
                  const esgScore = resolveEsgScore(tour)
                  const leiScore = resolveLeiScore(tour)
                  const showSustainability = hasSustainabilityScores(tour)
                  const detailSlug = buildTourSlug(tour.title, tour.id)

                  return (
                    <article className="tours-catalog-card" key={tour.id}>
                      <div className="tours-catalog-card__media">
                          {tour.image ? (
                            <img src={tour.image} alt={title} loading="lazy" />
                          ) : (
                            <div className="tours-catalog-card__empty">
                              <Image size={30} strokeWidth={1.8} aria-hidden />
                            </div>
                          )}

                          <span
                            className={`tours-catalog-card__tag tours-catalog-card__tag--${
                              badge.kind === 'esg' ? 'standard' : badge.kind
                            }`}
                          >
                            {badge.label}
                          </span>

                          {showSustainability ? (
                            <span
                              className="tours-vt-card-esg"
                              aria-label={`ESG ${esgScore ?? '—'}, LEI ${leiScore ?? '—'}`}
                            >
                              {esgScore != null ? `ESG ${esgScore}` : ''}
                              {esgScore != null && leiScore != null ? ' | ' : ''}
                              {leiScore != null ? `LEI ${leiScore}` : ''}
                            </span>
                          ) : null}
                      </div>

                      <button
                        type="button"
                        className="tours-catalog-card__quick-btn"
                        onClick={() => openQuickView(tour, title, days, provinceLine)}
                      >
                        <Eye size={16} strokeWidth={2.2} aria-hidden />
                        Xem nhanh
                      </button>

                      <div className="tours-catalog-card__panel">
                          <h2 className="tours-catalog-card__title">{title}</h2>
                          <div className="tours-catalog-card__row">
                            <span>
                              <MapPin size={15} strokeWidth={2} aria-hidden />
                              {provinceLine}
                            </span>
                            <span>
                              <Clock size={15} strokeWidth={2} aria-hidden />
                              {days}
                            </span>
                          </div>
                          <div className="tours-catalog-card__booking-meta">
                            <span title="Điểm khởi hành">
                              <MapPin size={14} strokeWidth={2} aria-hidden />
                              {departCity}
                            </span>
                            <span title="Lịch gần nhất">
                              <CalendarDays size={14} strokeWidth={2} aria-hidden />
                              {nextDepart}
                            </span>
                            {seatsLeft != null ? (
                              <span title="Chỗ còn">
                                <Users size={14} strokeWidth={2} aria-hidden />
                                Còn {seatsLeft}
                              </span>
                            ) : null}
                          </div>
                          {inclusionBadges.length > 0 ? (
                            <div
                              className="tours-catalog-card__badges"
                              aria-label="Dịch vụ bao gồm"
                            >
                              {inclusionBadges.map((label) => (
                                <span key={label} className="tours-catalog-card__badge">
                                  {label}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          <div className="tours-catalog-card__foot">
                            <div className="tours-catalog-card__price-block">
                              <span className="tours-catalog-card__price-label">Giá từ:</span>
                              {listPrice != null ? (
                                <span className="tours-catalog-card__price-old">
                                  {formatListingPrice(listPrice)}
                                </span>
                              ) : null}
                              <span className="tours-catalog-card__price-value">
                                {formatListingPrice(tour.price)}
                              </span>
                            </div>
                            <Link
                              className="tours-catalog-card__cta"
                              to={`/tour/${detailSlug}`}
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        <ToursCatalogFab />
      </main>

      <TourQuickViewDialog
        open={quickOpen}
        onOpenChange={setQuickOpen}
        tour={quickView}
      />
      <Footer />
    </>
  )
}

export default ToursPage
