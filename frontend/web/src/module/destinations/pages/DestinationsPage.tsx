import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Compass, Image, MapPin, RotateCcw, Search } from 'lucide-react'
import { destinationApi } from '../../../api/server/Destination.api'
import { Footer } from '../../../components/Footer/Footer'
import { PageSkeletonBlock } from '../../../components/ui/skeletons/PageSkeletonBlock'
import type { DestinationDetail } from '../database/interface/destination'
import type { Destination } from '../../home/database/interface/publicTravel'
import { DestinationsPageMainSkeleton } from '../components/DestinationsPageSkeleton'
import '../components/DestinationsPageSkeleton.css'
import '../styles/DestinationsPage.css'

const HERO_DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1440&q=80'

const ALL_REGION = '__all__'
const ALL_ACTIVITY = '__all__'

type ActivityTypeId = typeof ALL_ACTIVITY | 'resort' | 'adventure' | 'culture'

interface ActivityType {
  id: ActivityTypeId
  label: string
  keywords?: string[]
}

const ACTIVITY_TYPES: ActivityType[] = [
  { id: ALL_ACTIVITY, label: 'Tất cả' },
  {
    id: 'resort',
    label: 'Nghỉ dưỡng',
    keywords: ['nghỉ dưỡng', 'resort', 'biển', 'đảo', 'beach', 'sea', 'spa'],
  },
  {
    id: 'adventure',
    label: 'Phiêu lưu',
    keywords: ['phiêu lưu', 'trekking', 'leo núi', 'adventure', 'rừng', 'cắm trại'],
  },
  {
    id: 'culture',
    label: 'Văn hóa',
    keywords: ['văn hóa', 'lịch sử', 'cổ', 'đền', 'chùa', 'di sản', 'heritage'],
  },
]

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function getDestinationArea(destination: Destination) {
  return destination.region ?? destination.province ?? 'Vietnam'
}

function getDestinationCopy(destination: Destination) {
  return (
    destination.shortDescription ??
    `Khám phá ${destination.name} — điểm đến hấp dẫn với nhiều trải nghiệm đặc sắc.`
  )
}

function branchLink(programSlug: string) {
  return `/destinations/branch/${encodeURIComponent(programSlug)}`
}

// keyword-based filter on shortDescription / name / region
// TODO: replace with backend filter params when API supports it
function matchesActivity(dest: Destination, activityId: ActivityTypeId): boolean {
  if (activityId === ALL_ACTIVITY) return true
  const type = ACTIVITY_TYPES.find((t) => t.id === activityId)
  if (!type?.keywords) return true
  const haystack = [dest.shortDescription, dest.name, dest.region, dest.province]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return type.keywords.some((kw) => haystack.includes(kw))
}

function DestinationsPage() {
  const { programSlug: branchProgramSlug } = useParams<{ programSlug?: string }>()
  const { t, i18n } = useTranslation()

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [anchorDetail, setAnchorDetail] = useState<DestinationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArea, setSelectedArea] = useState(ALL_REGION)
  const [selectedActivity, setSelectedActivity] = useState<ActivityTypeId>(ALL_ACTIVITY)

  const deferredSearchQuery = useDeferredValue(searchQuery)
  const mainContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isActive = true
    setLoading(true)
    setError(null)

    async function load() {
      try {
        if (branchProgramSlug) {
          const anchor = await destinationApi.getDestinationByProgramSlug(branchProgramSlug)
          if (!isActive) return
          setAnchorDetail(anchor)
          const children = await destinationApi.getDestinationsByParentUuid(anchor.uuid)
          if (!isActive) return
          setDestinations(children)
        } else {
          setAnchorDetail(null)
          const roots = await destinationApi.getRootDestinations()
          if (!isActive) return
          setDestinations(roots)
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh sách điểm đến.')
        }
      } finally {
        if (isActive) setLoading(false)
      }
    }

    void load()
    return () => {
      isActive = false
    }
  }, [branchProgramSlug])

  const resolveDestinationName = useCallback(
    (item: Destination) => {
      const key = item.translationKey ? `data.destinations.${item.translationKey}` : ''
      return key && i18n.exists(key) ? t(key) : item.name
    },
    [i18n, t],
  )

  const areaOptions = useMemo(() => {
    const areas = destinations.map(getDestinationArea).filter(Boolean)
    return [ALL_REGION, ...Array.from(new Set(areas))]
  }, [destinations])

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = normalizeText(deferredSearchQuery)
    return destinations.filter((destination) => {
      const area = getDestinationArea(destination)
      const areaMatch = selectedArea === ALL_REGION || area === selectedArea
      if (!areaMatch) return false
      if (!matchesActivity(destination, selectedActivity)) return false
      if (!normalizedQuery) return true
      const name = resolveDestinationName(destination)
      const haystack = normalizeText(
        [name, destination.name, destination.province, destination.region, destination.shortDescription, destination.tours]
          .filter(Boolean)
          .join(' '),
      )
      return haystack.includes(normalizedQuery)
    })
  }, [destinations, deferredSearchQuery, resolveDestinationName, selectedArea, selectedActivity])

  const hasActiveFilters =
    selectedArea !== ALL_REGION || selectedActivity !== ALL_ACTIVITY || searchQuery.trim() !== ''

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedArea(ALL_REGION)
    setSelectedActivity(ALL_ACTIVITY)
  }

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Derived hero values
  const heroImage = (branchProgramSlug && anchorDetail?.coverImage) || HERO_DEFAULT_IMAGE
  const heroTitle =
    branchProgramSlug && anchorDetail
      ? `Khám phá ${anchorDetail.name}`
      : 'Bạn muốn kích hoạt hành trình tại địa điểm nào?'
  const heroKicker = loading
    ? ''
    : destinations.length > 0
      ? `${destinations.length} điểm đến đang chờ khám phá`
      : 'Khám phá các điểm đến hấp dẫn nhất'

  useEffect(() => {
    if (!loading || destinations.length > 0) return undefined
    const timer = window.setTimeout(() => {
      toast.warning('Không nhận được dữ liệu điểm đến. Kiểm tra backend và thử lại.')
    }, 4500)
    return () => window.clearTimeout(timer)
  }, [destinations.length, loading])

  useEffect(() => {
    if (!error || destinations.length > 0) return
    toast.error(error)
  }, [destinations.length, error])

  // Key for resetting card entrance animations when filters change
  const filterKey = `${selectedArea}|${selectedActivity}|${deferredSearchQuery}`

  return (
    <>
      <main className="dest-page">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          className={`dest-page-hero${loading ? ' dest-page-hero--skeleton' : ''}`}
          aria-label="Tìm kiếm điểm đến"
        >
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="dest-page-hero__img"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore — fetchPriority is valid in React 19 / modern JSX
            fetchpriority="high"
            loading="eager"
            decoding="async"
          />
          <div className="dest-page-hero__overlay" aria-hidden="true" />
          <div className="dest-page-hero__content">
            {loading ? (
              <>
                <PageSkeletonBlock className="dest-sk-title psb" style={{ width: 280, height: 12, marginBottom: 10 }} as="div" />
                <PageSkeletonBlock className="dest-sk-title psb" style={{ width: 'min(520px, 90%)', height: 32, marginBottom: 16 }} as="div" />
              </>
            ) : (
              <>
                <p className="dest-page-hero__kicker">{heroKicker}</p>
                <h1 className="dest-page-hero__title">{heroTitle}</h1>
              </>
            )}
            {loading ? (
              <div className="dest-hero-glass-bar dest-hero-glass-bar--skeleton" aria-hidden>
                <PageSkeletonBlock className="dest-sk-search psb" as="div" />
                <PageSkeletonBlock className="dest-sk-search-btn psb" as="div" />
              </div>
            ) : (
              <form className="dest-hero-glass-bar" onSubmit={handleHeroSearch} role="search">
                <label className="dest-hero-glass-bar__input">
                  <Search size={18} strokeWidth={2} aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    placeholder="Tên điểm đến, tỉnh thành, vùng..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Tìm kiếm điểm đến"
                  />
                </label>
                <button type="submit" className="dest-hero-glass-bar__btn">
                  <Search size={15} strokeWidth={2.4} aria-hidden="true" />
                  Khám phá
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── Main content ──────────────────────────────────── */}
        <div ref={mainContentRef} className="dest-page-main">
          <div className="dest-page-inner">
            <Link className="dest-back-link" to="/">
              <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
              Về trang chủ
            </Link>

            {/* Breadcrumbs */}
            {anchorDetail?.breadcrumbs?.length ? (
              <nav className="dest-breadcrumb" aria-label="Đường dẫn điều hướng">
                <Link to="/destinations">Tất cả điểm đến</Link>
                {anchorDetail.breadcrumbs.map((crumb, idx) => {
                  const last = idx === anchorDetail.breadcrumbs!.length - 1
                  if (last) {
                    return (
                      <span key={`${crumb.uuid ?? crumb.name}-${idx}`}>
                        {' / '}
                        <span aria-current="page">{crumb.name}</span>
                      </span>
                    )
                  }
                  const to = crumb.programSlug ? branchLink(crumb.programSlug) : '/destinations'
                  return (
                    <span key={`${crumb.uuid ?? crumb.name}-${idx}`}>
                      {' / '}
                      <Link to={to}>{crumb.name}</Link>
                    </span>
                  )
                })}
              </nav>
            ) : null}

            {/* Loading */}
            {loading || (error && destinations.length === 0) ? (
              <DestinationsPageMainSkeleton />
            ) : (
              <>
                {/* Filter bar */}
                <div className="dest-filter-bar" role="toolbar" aria-label="Bộ lọc điểm đến">
                  {/* Vùng miền */}
                  <div
                    className="dest-filter-group"
                    role="group"
                    aria-label="Lọc theo vùng miền"
                  >
                    <span className="dest-filter-group__label" aria-hidden="true">
                      Vùng
                    </span>
                    {areaOptions.map((area) => (
                      <button
                        key={area}
                        type="button"
                        className={`dest-chip${area === selectedArea ? ' is-active' : ''}`}
                        onClick={() => setSelectedArea(area)}
                        aria-pressed={area === selectedArea}
                      >
                        {area === ALL_REGION ? 'Tất cả' : area}
                      </button>
                    ))}
                  </div>

                  <div className="dest-filter-bar__divider" aria-hidden="true" />

                  {/* Loại hình */}
                  <div
                    className="dest-filter-group"
                    role="group"
                    aria-label="Lọc theo loại hình"
                  >
                    <span className="dest-filter-group__label" aria-hidden="true">
                      Loại
                    </span>
                    {ACTIVITY_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        className={`dest-chip${type.id === selectedActivity ? ' is-active' : ''}`}
                        onClick={() => setSelectedActivity(type.id)}
                        aria-pressed={type.id === selectedActivity}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Count + reset */}
                  <div className="dest-filter-bar__end">
                    <span
                      className="dest-filter-count"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {filteredDestinations.length} / {destinations.length}
                    </span>
                    {hasActiveFilters ? (
                      <button
                        type="button"
                        className="dest-chip dest-chip--reset"
                        onClick={resetFilters}
                        aria-label="Xóa tất cả bộ lọc"
                      >
                        <RotateCcw size={13} strokeWidth={2.2} aria-hidden="true" />
                        Xóa lọc
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Grid */}
                {destinations.length === 0 ? (
                  <div className="dest-empty" role="status">
                    <Compass size={38} strokeWidth={1.4} aria-hidden="true" />
                    <h2 className="dest-empty__title">Chưa có điểm đến nào</h2>
                    <p className="dest-empty__desc">
                      Danh sách điểm đến đang được cập nhật. Vui lòng quay lại sau.
                    </p>
                  </div>
                ) : filteredDestinations.length === 0 ? (
                  <div className="dest-empty" role="status">
                    <Compass size={38} strokeWidth={1.4} aria-hidden="true" />
                    <h2 className="dest-empty__title">Không tìm thấy điểm đến</h2>
                    <p className="dest-empty__desc">
                      Thử thay đổi từ khóa hoặc chọn lại bộ lọc để xem thêm kết quả.
                    </p>
                    <button
                      type="button"
                      className="dest-empty__reset"
                      onClick={resetFilters}
                    >
                      <RotateCcw size={14} strokeWidth={2.2} aria-hidden="true" />
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  <div
                    key={filterKey}
                    className="dest-grid"
                    aria-label={`${filteredDestinations.length} điểm đến`}
                  >
                    {filteredDestinations.map((destination, index) => {
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
                      const detailHref =
                        destination.uuid != null ? `/destinations/${destination.uuid}` : null
                      const secondaryHref = drillHref ?? detailHref

                      return (
                        <article
                          key={destination.uuid ?? destination.programSlug ?? destination.name}
                          className="dest-card"
                          style={{ '--card-idx': Math.min(index, 11) } as CSSProperties}
                        >
                          {/* Media */}
                          <div className="dest-card__media">
                            {destination.image ? (
                              <img
                                src={destination.image}
                                alt={destinationName}
                                className="dest-card__img"
                                loading={index < 3 ? 'eager' : 'lazy'}
                                decoding="async"
                              />
                            ) : (
                              <div className="dest-card__empty-media" aria-hidden="true">
                                <Image size={30} strokeWidth={1.6} />
                              </div>
                            )}
                            <div className="dest-card__media-overlay" aria-hidden="true" />
                            {area ? (
                              <span className="dest-card__region-badge">{area}</span>
                            ) : null}
                            <span
                              className="dest-card__tour-count"
                              aria-label={`${destination.tours} tours sẵn sàng`}
                            >
                              <Compass size={12} strokeWidth={2.2} aria-hidden="true" />
                              {destination.tours}
                            </span>
                          </div>

                          {/* Body */}
                          <div className="dest-card__body">
                            <h2 className="dest-card__name">
                              {secondaryHref ? (
                                <Link to={secondaryHref}>{destinationName}</Link>
                              ) : (
                                destinationName
                              )}
                            </h2>

                            <p className="dest-card__desc">{getDestinationCopy(destination)}</p>

                            <div className="dest-card__meta" aria-label="Thông tin điểm đến">
                              {(destination.province ?? destination.region) ? (
                                <span className="dest-card__meta-item">
                                  <MapPin size={13} strokeWidth={2} aria-hidden="true" />
                                  {destination.province ?? destination.region}
                                </span>
                              ) : null}
                            </div>

                            {/* Actions */}
                            <div className="dest-card__actions">
                              <Link
                                className="dest-card__cta-primary"
                                to={toursQuery}
                                aria-label={`Khám phá tour tại ${destinationName}`}
                              >
                                Khám phá Tour
                                <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                              </Link>
                              {secondaryHref ? (
                                <Link
                                  className="dest-card__cta-secondary"
                                  to={secondaryHref}
                                  aria-label={
                                    drillHref
                                      ? `Xem các điểm đến trong ${destinationName}`
                                      : `Chi tiết ${destinationName}`
                                  }
                                >
                                  {drillHref ? 'Khám phá thêm' : 'Chi tiết'}
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default DestinationsPage
