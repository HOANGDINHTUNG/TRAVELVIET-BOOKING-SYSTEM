import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Compass, Image, MapPin, Search } from 'lucide-react'
import { destinationApi } from '../../../api/server/Destination.api'
import { EmptyState } from '../../../components/common/ui/EmptyState'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import { Footer } from '../../../components/Footer/Footer'
import type { DestinationDetail } from '../database/interface/destination'
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

function branchLink(programSlug: string) {
  return `/destinations/branch/${encodeURIComponent(programSlug)}`
}

function DestinationsPage() {
  const { programSlug: branchProgramSlug } = useParams<{ programSlug?: string }>()
  const { t, i18n } = useTranslation()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [anchorDetail, setAnchorDetail] = useState<DestinationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArea, setSelectedArea] = useState(ALL_FILTER)

  const deferredSearchQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    let isActive = true

    async function loadDestinations() {
      setLoading(true)
      setError(null)

      try {
        if (branchProgramSlug) {
          const anchor = await destinationApi.getDestinationByProgramSlug(branchProgramSlug)
          if (!isActive) {
            return
          }
          setAnchorDetail(anchor)
          const children = await destinationApi.getDestinationsByParentUuid(anchor.uuid)
          if (!isActive) {
            return
          }
          setDestinations(children)
        } else {
          setAnchorDetail(null)
          const roots = await destinationApi.getRootDestinations()
          if (!isActive) {
            return
          }
          setDestinations(roots)
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
  }, [branchProgramSlug])

  const resolveDestinationName = useCallback((item: Destination) => {
    const key = item.translationKey ? `data.destinations.${item.translationKey}` : ''
    return key && i18n.exists(key) ? t(key) : item.name
  }, [i18n, t])

  const areaOptions = useMemo(() => {
    const areas = destinations.map(getDestinationArea).filter(Boolean)
    return [ALL_FILTER, ...Array.from(new Set(areas))]
  }, [destinations])

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = normalizeText(deferredSearchQuery)

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
  }, [destinations, deferredSearchQuery, resolveDestinationName, selectedArea])

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

  const pageTitle = branchProgramSlug && anchorDetail ? anchorDetail.name : 'Chon diem den theo cach ban muon trai nghiem'
  const pageKicker = branchProgramSlug && anchorDetail ? 'Cap con trong cay diem den' : 'Tat ca diem den'

  return (
    <>
      <main className="catalog-page">
        <div className="catalog-page-inner">
          <Link className="catalog-back-link" to="/">
            <ArrowLeft size={17} strokeWidth={2.1} aria-hidden="true" />
            Ve trang chu
          </Link>

          {anchorDetail?.breadcrumbs?.length ? (
            <nav className="catalog-toolbar" style={{ flexWrap: 'wrap', gap: '0.35rem' }} aria-label="Breadcrumb">
              <Link to="/destinations">Tat ca (goc)</Link>
              {anchorDetail.breadcrumbs.map((crumb, index) => {
                const last = index === anchorDetail.breadcrumbs!.length - 1
                const label = crumb.name
                if (last) {
                  return (
                    <span key={`${crumb.uuid ?? label}-${index}`}>
                      {' '}
                      / {label}
                    </span>
                  )
                }
                const to = crumb.programSlug ? branchLink(crumb.programSlug) : '/destinations'
                return (
                  <span key={`${crumb.uuid ?? label}-${index}`}>
                    {' '}
                    /{' '}
                    <Link to={to}>{label}</Link>
                  </span>
                )
              })}
            </nav>
          ) : null}

          <header className="catalog-header">
            <div>
              <p className="catalog-kicker">{pageKicker}</p>
              <h1>{pageTitle}</h1>
              <p>
                {branchProgramSlug
                  ? 'Chon cap con de tiep tuc drill-down, hoac xem tour gan khu vuc nay.'
                  : 'Xem cac chau luc / quoc gia o cap goc, loc nhanh theo khu vuc va mo cap con bang slug chuong trinh.'}
              </p>
            </div>
            <div className="catalog-summary">
              <strong>{destinations.length}</strong>
              <span>{branchProgramSlug ? 'Cap con' : 'Diem den goc'}</span>
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
            <EmptyState title="Khong co cap con hoac danh sach dang trong." />
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
                const toursQuery =
                  destination.id != null
                    ? `/tours?destinationId=${destination.id}&destinationSubtree=true`
                    : '/tours'
                const drillHref =
                  destination.programSlug != null && destination.programSlug !== ''
                    ? branchLink(destination.programSlug)
                    : null

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
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
                        {drillHref ? (
                          <span className="catalog-action-link">
                            Vao cap con
                            <ArrowRight size={16} strokeWidth={2.1} aria-hidden="true" />
                          </span>
                        ) : null}
                        {destination.uuid ? (
                          <Link className="catalog-action-link" style={{ fontSize: '0.9em' }} to={`/destinations/${destination.uuid}`}>
                            Chi tiet (can dang nhap)
                          </Link>
                        ) : null}
                        <Link className="catalog-action-link" style={{ fontSize: '0.9em' }} to={toursQuery}>
                          Xem tour
                        </Link>
                      </div>
                    </div>
                  </article>
                )

                if (drillHref) {
                  return (
                    <Link className="catalog-card-link" key={destination.uuid ?? destination.programSlug} to={drillHref}>
                      {content}
                    </Link>
                  )
                }

                return (
                  <div key={destination.uuid ?? destination.name}>{content}</div>
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
