import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Compass, Image, MapPin, Search } from 'lucide-react'
import { destinationApi } from '../../../api/server/Destination.api'
import { EmptyState } from '../../../components/common/ui/EmptyState'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import { Footer } from '../../../components/Footer/Footer'
import type { Destination } from '../../home/database/interface/publicTravel'
import '../../catalog/styles/CatalogListPage.css'

const ALL_FILTER = 'Tat ca'

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function getDestinationArea(destination: Destination) {
  return destination.region || destination.province || 'Vietnam'
}

function getDestinationCopy(destination: Destination) {
  return (
    destination.shortDescription ||
    `${destination.name} dang co ${destination.tours.toLowerCase()} san sang de kham pha.`
  )
}

function DestinationsPage() {
  const { t, i18n } = useTranslation()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArea, setSelectedArea] = useState(ALL_FILTER)

  useEffect(() => {
    let isActive = true

    async function loadDestinations() {
      setLoading(true)
      setError(null)

      try {
        const data = await destinationApi.getAllDestinations()

        if (isActive) {
          setDestinations(data)
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Khong the tai danh sach diem den.',
          )
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadDestinations()

    return () => {
      isActive = false
    }
  }, [])

  const resolveDestinationName = useCallback((item: Destination) => {
    const key = item.translationKey ? `data.destinations.${item.translationKey}` : ''
    return key && i18n.exists(key) ? t(key) : item.name
  }, [i18n, t])

  const areaOptions = useMemo(() => {
    const areas = destinations.map(getDestinationArea).filter(Boolean)
    return [ALL_FILTER, ...Array.from(new Set(areas))]
  }, [destinations])

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery)

    return destinations.filter((destination) => {
      const area = getDestinationArea(destination)
      const areaMatch = selectedArea === ALL_FILTER || area === selectedArea
      const destinationName = resolveDestinationName(destination)
      const searchableText = normalizeText(
        [
          destinationName,
          destination.name,
          destination.province,
          destination.region,
          destination.shortDescription,
          destination.tours,
        ]
          .filter(Boolean)
          .join(' '),
      )

      return areaMatch && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [destinations, resolveDestinationName, searchQuery, selectedArea])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedArea(ALL_FILTER)
  }

  if (loading) {
    return <PageLoader label="Dang tai danh sach diem den..." />
  }

  if (error && destinations.length === 0) {
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
              <p className="catalog-kicker">Tat ca diem den</p>
              <h1>Chon diem den theo cach ban muon trai nghiem</h1>
              <p>
                Xem toan bo diem den dang mo ban, loc nhanh theo khu vuc va
                mo trang chi tiet de xem thoi tiet, goi tour, am thuc va meo
                di chuyen.
              </p>
            </div>
            <div className="catalog-summary">
              <strong>{destinations.length}</strong>
              <span>Diem den</span>
            </div>
          </header>

          <div className="catalog-toolbar" aria-label="Destination filters">
            <label className="catalog-search">
              <Search size={18} strokeWidth={2} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                placeholder="Tim ten diem den, tinh thanh, khu vuc..."
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <div className="catalog-filter-row" aria-label="Destination areas">
              {areaOptions.map((area) => (
                <button
                  className={area === selectedArea ? 'is-active' : ''}
                  key={area}
                  type="button"
                  onClick={() => setSelectedArea(area)}
                >
                  {area}
                </button>
              ))}
            </div>
            <strong className="catalog-count">
              {filteredDestinations.length}/{destinations.length} ket qua
            </strong>
          </div>

          {destinations.length === 0 ? (
            <EmptyState title="Danh sach diem den dang trong." />
          ) : filteredDestinations.length === 0 ? (
            <div className="catalog-empty">
              <Compass size={24} strokeWidth={1.8} aria-hidden="true" />
              <div>
                <h2>Khong co diem den phu hop</h2>
                <p>Thu doi tu khoa hoac chon lai khu vuc de xem du lieu khac.</p>
              </div>
              <button type="button" onClick={resetFilters}>
                Xoa bo loc
              </button>
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredDestinations.map((destination) => {
                const destinationName = resolveDestinationName(destination)
                const area = getDestinationArea(destination)
                const content = (
                  <article className="catalog-card">
                    <div className="catalog-card-media">
                      {destination.image ? (
                        <img src={destination.image} alt={destinationName} />
                      ) : (
                        <div className="catalog-card-empty">
                          <Image size={30} strokeWidth={1.8} aria-hidden="true" />
                        </div>
                      )}
                      <span className="catalog-card-badge">{area}</span>
                    </div>
                    <div className="catalog-card-body">
                      <h2>{destinationName}</h2>
                      <p>{getDestinationCopy(destination)}</p>
                      <div className="catalog-card-meta">
                        <span>
                          <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
                          {area}
                        </span>
                        <span>
                          <Compass size={15} strokeWidth={1.8} aria-hidden="true" />
                          {destination.tours}
                        </span>
                      </div>
                      {destination.uuid ? (
                        <span className="catalog-action-link">
                          Xem chi tiet
                          <ArrowRight size={16} strokeWidth={2.1} aria-hidden="true" />
                        </span>
                      ) : null}
                    </div>
                  </article>
                )

                return destination.uuid ? (
                  <Link
                    className="catalog-card-link"
                    key={destination.uuid}
                    to={`/destinations/${destination.uuid}`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={destination.name}>{content}</div>
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

export default DestinationsPage
