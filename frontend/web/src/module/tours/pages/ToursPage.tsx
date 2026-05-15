import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Clock, Eye, Image, MapPin, Search, Tag } from 'lucide-react'
import { tourApi, tourListSearchParamsFromUrl } from '../../../api/server/Tour.api'
import { EmptyState } from '../../../components/common/ui/EmptyState'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import { Footer } from '../../../components/Footer/Footer'
import type { Tour } from '../../home/database/interface/publicTravel'
import '../../catalog/styles/CatalogListPage.css'
import '../styles/ToursCatalogCards.css'
import { buildTourSlug } from '../utils/slug'

const ALL_FILTER = 'Tat ca'

const formatListingPrice = (price: number) =>
  `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(price)}đ`

function tourListingBadge(tour: Tour): { kind: 'deal' | 'standard'; label: string } {
  const mode = (tour.category || '').toLowerCase()
  const intl =
    Boolean(tour.destinationCountryCode && tour.destinationCountryCode !== 'VN') ||
    mode.includes('quốc tế') ||
    mode.includes('international')

  if (intl) {
    return { kind: 'standard', label: 'Tiêu chuẩn' }
  }

  return { kind: 'deal', label: 'Giá tốt' }
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function ToursPage() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('query') ?? '')
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get('category') ?? ALL_FILTER,
  )

  const deferredSearchQuery = useDeferredValue(searchQuery)

  const catalogSearchKey = searchParams.toString()

  useEffect(() => {
    let isActive = true

    async function loadTours() {
      setLoading(true)
      setError(null)

      try {
        const serverFilter = tourListSearchParamsFromUrl(
          new URLSearchParams(catalogSearchKey),
        )
        const data = serverFilter
          ? await tourApi.searchPublicTours(serverFilter)
          : await tourApi.getAllTours()

        if (isActive) {
          setTours(data)
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Khong the tai danh sach tour.',
          )
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadTours()

    return () => {
      isActive = false
    }
  }, [catalogSearchKey])

  const translateTourField = useCallback(
    (
      tour: Tour,
      field: 'title' | 'description' | 'days' | 'location',
      fallback: string,
    ) => {
      if (!tour.translationKey) {
        return fallback
      }

      const key = `data.tours.${tour.translationKey}.${field}`
      return i18n.exists(key) ? t(key) : fallback
    },
    [i18n, t],
  )

  const catalogHead = useMemo(() => {
    const p = tourListSearchParamsFromUrl(
      new URLSearchParams(catalogSearchKey),
    )
    if (!p) {
      return {
        kicker: t('catalog.all.kicker'),
        title: t('catalog.all.title'),
        lead: t('catalog.all.lead'),
      }
    }
    if (p.internationalOnly || p.tagCodes?.includes('HOME_HOT_INTL')) {
      return {
        kicker: t('catalog.international.kicker'),
        title: t('catalog.international.title'),
        lead: t('catalog.international.lead'),
      }
    }
    if (
      p.tagCodes?.includes('HOME_BEACH_VN') ||
      (p.domesticOnly && p.tagCodes?.includes('BIEN'))
    ) {
      return {
        kicker: t('catalog.domesticBeach.kicker'),
        title: t('catalog.domesticBeach.title'),
        lead: t('catalog.domesticBeach.lead'),
      }
    }
    if (p.destinationId != null) {
      return {
        kicker: t('catalog.filtered.kicker'),
        title: t('catalog.filtered.title'),
        lead: t('catalog.filtered.lead'),
      }
    }
    return {
      kicker: t('catalog.filtered.kicker'),
      title: t('catalog.filtered.title'),
      lead: t('catalog.filtered.lead'),
    }
  }, [catalogSearchKey, t])

  const categoryOptions = useMemo(() => {
    const categories = tours
      .map((tour) => tour.category)
      .filter((category): category is string => Boolean(category))

    return [ALL_FILTER, ...Array.from(new Set(categories))]
  }, [tours])

  const filteredTours = useMemo(() => {
    const normalizedQuery = normalizeText(deferredSearchQuery)

    return tours.filter((tour) => {
      const title = translateTourField(tour, 'title', tour.title)
      const description = translateTourField(
        tour,
        'description',
        tour.shortDescription ||
          tour.description ||
          tour.highlights.join(', ') ||
          tour.category,
      )
      const location = translateTourField(tour, 'location', tour.location)
      const days = translateTourField(tour, 'days', tour.days)
      const categoryMatch =
        selectedCategory === ALL_FILTER || tour.category === selectedCategory
      const searchableText = normalizeText(
        [
          title,
          tour.title,
          description,
          tour.shortDescription,
          tour.description,
          location,
          tour.category,
          days,
          ...tour.highlights,
        ]
          .filter(Boolean)
          .join(' '),
      )

      return categoryMatch && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [deferredSearchQuery, selectedCategory, tours, translateTourField])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory(ALL_FILTER)
  }

  if (loading) {
    return <PageLoader label="Dang tai danh sach tour..." />
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
      <main className="catalog-page tours-catalog-page">
        <div className="catalog-page-inner">
          <Link className="catalog-back-link" to="/">
            <ArrowLeft size={17} strokeWidth={2.1} aria-hidden="true" />
            Ve trang chu
          </Link>

          <header className="catalog-header">
            <div>
              <p className="catalog-kicker">{catalogHead.kicker}</p>
              <h1>{catalogHead.title}</h1>
              <p>{catalogHead.lead}</p>
            </div>
            <div className="catalog-summary">
              <strong>{tours.length}</strong>
              <span>Tour</span>
            </div>
          </header>

          <div className="catalog-toolbar" aria-label="Tour filters">
            <label className="catalog-search">
              <Search size={18} strokeWidth={2} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                placeholder="Tim ten tour, diem den, trai nghiem..."
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <div className="catalog-filter-row" aria-label="Tour categories">
              {categoryOptions.map((category) => (
                <button
                  className={category === selectedCategory ? 'is-active' : ''}
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <strong className="catalog-count">
              {filteredTours.length}/{tours.length} ket qua
            </strong>
          </div>

          {tours.length === 0 ? (
            <EmptyState title="Danh sach tour dang trong." />
          ) : filteredTours.length === 0 ? (
            <div className="catalog-empty">
              <Tag size={24} strokeWidth={1.8} aria-hidden="true" />
              <div>
                <h2>Khong co tour phu hop</h2>
                <p>Thu doi tu khoa hoac xoa bo loc de xem lai tat ca tour.</p>
              </div>
              <button type="button" onClick={resetFilters}>
                Xoa bo loc
              </button>
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredTours.map((tour) => {
                const title = translateTourField(tour, 'title', tour.title)
                const days = translateTourField(tour, 'days', tour.days)
                const location = translateTourField(tour, 'location', tour.location)
                const provinceLine =
                  tour.destinationProvince?.trim() ||
                  location ||
                  '—'
                const badge = tourListingBadge(tour)
                const detailSlug = buildTourSlug(tour.title, tour.id)

                return (
                  <Link
                    className="tours-catalog-card-link"
                    key={tour.id}
                    to={`/tour/${detailSlug}`}
                  >
                    <article className="tours-catalog-card">
                      <div className="tours-catalog-card__media">
                        {tour.image ? (
                          <img src={tour.image} alt={title} loading="lazy" />
                        ) : (
                          <div className="tours-catalog-card__empty">
                            <Image size={30} strokeWidth={1.8} aria-hidden="true" />
                          </div>
                        )}

                        <span
                          className={`tours-catalog-card__tag tours-catalog-card__tag--${badge.kind}`}
                        >
                          {badge.label}
                        </span>

                        <span className="tours-catalog-card__quick">
                          <Eye size={16} strokeWidth={2.2} aria-hidden="true" />
                          Xem nhanh
                        </span>
                      </div>

                      <div className="tours-catalog-card__panel">
                        <h2 className="tours-catalog-card__title">{title}</h2>

                        <div className="tours-catalog-card__row">
                          <span>
                            <MapPin size={15} strokeWidth={2} aria-hidden="true" />
                            {provinceLine}
                          </span>
                          <span>
                            <Clock size={15} strokeWidth={2} aria-hidden="true" />
                            {days}
                          </span>
                        </div>

                        <div className="tours-catalog-card__foot">
                          <div className="tours-catalog-card__price-block">
                            <span className="tours-catalog-card__price-label">Giá từ:</span>
                            <span className="tours-catalog-card__price-value">
                              {formatListingPrice(tour.price)}
                            </span>
                          </div>
                          <span className="tours-catalog-card__cta">Xem chi tiết</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ToursPage
