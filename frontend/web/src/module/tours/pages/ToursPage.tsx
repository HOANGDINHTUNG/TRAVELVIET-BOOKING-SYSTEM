import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Image,
  MapPin,
  Search,
  Star,
  Tag,
} from 'lucide-react'
import { tourApi } from '../../../api/server/Tour.api'
import { EmptyState } from '../../../components/common/ui/EmptyState'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import { Footer } from '../../../components/Footer/Footer'
import type { Tour } from '../../home/database/interface/publicTravel'
import '../../catalog/styles/CatalogListPage.css'

const ALL_FILTER = 'Tat ca'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function ToursPage() {
  const { t, i18n } = useTranslation()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER)

  useEffect(() => {
    let isActive = true

    async function loadTours() {
      setLoading(true)
      setError(null)

      try {
        const data = await tourApi.getAllTours()

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
  }, [])

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

  const categoryOptions = useMemo(() => {
    const categories = tours
      .map((tour) => tour.category)
      .filter((category): category is string => Boolean(category))

    return [ALL_FILTER, ...Array.from(new Set(categories))]
  }, [tours])

  const filteredTours = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery)

    return tours.filter((tour) => {
      const title = translateTourField(tour, 'title', tour.title)
      const description = translateTourField(
        tour,
        'description',
        tour.description || tour.highlights.join(', ') || tour.category,
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
  }, [searchQuery, selectedCategory, tours, translateTourField])

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
      <main className="catalog-page">
        <div className="catalog-page-inner">
          <Link className="catalog-back-link" to="/">
            <ArrowLeft size={17} strokeWidth={2.1} aria-hidden="true" />
            Ve trang chu
          </Link>

          <header className="catalog-header">
            <div>
              <p className="catalog-kicker">Tat ca tour</p>
              <h1>Tim tour phu hop voi ngan sach va cach di cua ban</h1>
              <p>
                Xem toan bo goi tour dang mo ban, loc nhanh theo kieu chuyen
                di va mo trang chi tiet de xem lich trinh, gia, diem don va
                chinh sach dat cho.
              </p>
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
                const description = translateTourField(
                  tour,
                  'description',
                  tour.description || tour.highlights.join(', ') || tour.category,
                )
                const days = translateTourField(tour, 'days', tour.days)
                const location = translateTourField(tour, 'location', tour.location)

                return (
                  <Link
                    className="catalog-card-link"
                    key={tour.id}
                    to={`/tours/${tour.id}`}
                  >
                    <article className="catalog-card">
                      <div className="catalog-card-media">
                        {tour.image ? (
                          <img src={tour.image} alt={title} />
                        ) : (
                          <div className="catalog-card-empty">
                            <Image size={30} strokeWidth={1.8} aria-hidden="true" />
                          </div>
                        )}
                        <span className="catalog-card-badge">
                          {tour.rating ? (
                            <>
                              <Star
                                size={13}
                                fill="currentColor"
                                strokeWidth={1.5}
                                aria-hidden="true"
                              />
                              {tour.rating.toFixed(1)}
                            </>
                          ) : (
                            tour.category
                          )}
                        </span>
                      </div>
                      <div className="catalog-card-body">
                        <h2>{title}</h2>
                        <p>{description}</p>
                        <div className="catalog-card-meta">
                          <span>
                            <CalendarDays
                              size={15}
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                            {days}
                          </span>
                          <span>
                            <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
                            {location}
                          </span>
                          <span>
                            <Tag size={15} strokeWidth={1.8} aria-hidden="true" />
                            {formatPrice(tour.price)}
                          </span>
                        </div>
                        <span className="catalog-action-link">
                          Xem chi tiet
                          <ArrowRight size={16} strokeWidth={2.1} aria-hidden="true" />
                        </span>
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
