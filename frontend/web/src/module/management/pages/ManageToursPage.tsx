import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Check,
  Edit3,
  Eye,
  Image,
  LoaderCircle,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import {
  contentManagementApi,
  resolveTourCover,
  tourDetailToPayload,
  type AdminTour,
  type AdminTourPayload,
} from '../api/contentManagementApi'
import './ManagementContentPage.css'

const ALL_STATUS = ''
const TOUR_STATUSES = [
  { value: ALL_STATUS, label: 'Tat ca trang thai' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
]

type TourFormState = {
  code: string
  name: string
  slug: string
  destinationId: string
  basePrice: string
  currency: string
  durationDays: string
  durationNights: string
  transportType: string
  tripMode: string
  status: string
  shortDescription: string
  description: string
  highlights: string
  inclusions: string
  exclusions: string
  notes: string
  isFeatured: boolean
}

function toText(value: unknown) {
  return value === undefined || value === null ? '' : String(value)
}

function normalizeStatus(value?: string) {
  return (value || 'unknown').toLowerCase()
}

function optionalText(value: string) {
  const trimmed = value.trim()
  return trimmed || undefined
}

function optionalNumber(value: string) {
  if (!value.trim()) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function formatPrice(value?: string | number, currency = 'VND') {
  const numeric = Number(value ?? 0)
  const safeValue = Number.isFinite(numeric) ? numeric : 0

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency || 'VND',
    maximumFractionDigits: 0,
  }).format(safeValue)
}

function formatDuration(days?: number, nights?: number) {
  if (!days && !nights) {
    return 'Lich trinh chua cap nhat'
  }

  if (days && nights !== undefined) {
    return `${days} ngay ${nights} dem`
  }

  return `${days ?? nights} ngay`
}

function tourToForm(tour: AdminTour): TourFormState {
  return {
    code: toText(tour.code),
    name: toText(tour.name),
    slug: toText(tour.slug),
    destinationId: toText(tour.destinationId),
    basePrice: toText(tour.basePrice),
    currency: toText(tour.currency || 'VND'),
    durationDays: toText(tour.durationDays),
    durationNights: toText(tour.durationNights),
    transportType: toText(tour.transportType),
    tripMode: toText(tour.tripMode || 'group'),
    status: toText(tour.status || 'draft'),
    shortDescription: toText(tour.shortDescription),
    description: toText(tour.description),
    highlights: toText(tour.highlights),
    inclusions: toText(tour.inclusions),
    exclusions: toText(tour.exclusions),
    notes: toText(tour.notes),
    isFeatured: Boolean(tour.isFeatured),
  }
}

function buildPayload(tour: AdminTour, form: TourFormState): AdminTourPayload {
  return {
    ...tourDetailToPayload(tour),
    code: form.code.trim(),
    name: form.name.trim(),
    slug: form.slug.trim(),
    destinationId: optionalNumber(form.destinationId),
    basePrice: optionalNumber(form.basePrice),
    currency: form.currency.trim().toUpperCase() || 'VND',
    durationDays: optionalNumber(form.durationDays),
    durationNights: optionalNumber(form.durationNights) ?? 0,
    transportType: optionalText(form.transportType),
    tripMode: optionalText(form.tripMode),
    status: optionalText(form.status),
    shortDescription: optionalText(form.shortDescription),
    description: optionalText(form.description),
    highlights: optionalText(form.highlights),
    inclusions: optionalText(form.inclusions),
    exclusions: optionalText(form.exclusions),
    notes: optionalText(form.notes),
    isFeatured: form.isFeatured,
  }
}

function getTourSummary(tour: AdminTour) {
  return (
    tour.shortDescription ||
    tour.description ||
    tour.highlights ||
    'Noi dung tour dang duoc cap nhat.'
  )
}

function ManageToursPage() {
  const [tours, setTours] = useState<AdminTour[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(ALL_STATUS)
  const [selectedTour, setSelectedTour] = useState<AdminTour | null>(null)
  const [form, setForm] = useState<TourFormState | null>(null)

  const loadTours = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const page = await contentManagementApi.getAdminTours({
        keyword: searchQuery.trim() || undefined,
        status: selectedStatus || undefined,
      })

      setTours(page.content)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Khong the tai danh sach tour quan tri.',
      )
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedStatus])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTours()
    }, 220)

    return () => window.clearTimeout(timer)
  }, [loadTours])

  const statusCounts = useMemo(() => {
    return tours.reduce<Record<string, number>>((counts, tour) => {
      const key = normalizeStatus(tour.status)
      counts[key] = (counts[key] ?? 0) + 1
      return counts
    }, {})
  }, [tours])

  const openEdit = async (tour: AdminTour) => {
    setBusyId(tour.id)
    setError(null)

    try {
      const detail = await contentManagementApi.getAdminTourById(tour.id)
      setSelectedTour(detail)
      setForm(tourToForm(detail))
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Khong the tai chi tiet tour.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const updateForm = <Key extends keyof TourFormState>(
    key: Key,
    value: TourFormState[Key],
  ) => {
    setForm((current) => (current ? { ...current, [key]: value } : current))
  }

  const saveTour = async () => {
    if (!selectedTour || !form) {
      return
    }

    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.slug.trim() ||
      !form.destinationId.trim() ||
      !form.basePrice.trim() ||
      !form.durationDays.trim()
    ) {
      setError('Code, ten tour, slug, destinationId, gia va so ngay la bat buoc.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await contentManagementApi.updateTour(
        selectedTour.id,
        buildPayload(selectedTour, form),
      )
      setSelectedTour(null)
      setForm(null)
      await loadTours()
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : 'Khong the luu tour.',
      )
    } finally {
      setSaving(false)
    }
  }

  const deleteTour = async (tour: AdminTour) => {
    const confirmed = window.confirm(`Xoa tour "${tour.name}"?`)
    if (!confirmed) {
      return
    }

    setBusyId(tour.id)
    setError(null)

    try {
      await contentManagementApi.deleteTour(tour.id)
      if (selectedTour?.id === tour.id) {
        setSelectedTour(null)
        setForm(null)
      }
      await loadTours()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Khong the xoa tour.',
      )
    } finally {
      setBusyId(null)
    }
  }

  if (loading && tours.length === 0) {
    return <PageLoader label="Dang tai tour quan tri..." />
  }

  return (
    <div className="mgmt-content-page">
      <header className="mgmt-content-header">
        <div>
          <p className="mgmt-content-kicker">Tour management</p>
          <h2>Quan ly tour voi giao dien gan trang khach</h2>
          <p>
            Card tour hien anh, gia, thoi luong, trang thai va nut xem chi
            tiet. Quan tri vien co the sua cac truong chinh va xoa tour truc
            tiep tu man hinh nay.
          </p>
        </div>
        <div className="mgmt-content-count">
          <strong>{tours.length}</strong>
          <span>Tour</span>
        </div>
      </header>

      <div className="mgmt-content-toolbar" aria-label="Tour management filters">
        <label className="mgmt-content-search">
          <Search size={18} strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            placeholder="Tim ten tour, code, mo ta..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <select
          className="mgmt-content-select"
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          {TOUR_STATUSES.map((status) => (
            <option key={status.value || 'all'} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <button
          className="mgmt-content-refresh"
          type="button"
          onClick={() => void loadTours()}
        >
          <RefreshCw size={16} strokeWidth={2.2} aria-hidden="true" />
          Lam moi
        </button>
      </div>

      {error ? <div className="mgmt-content-alert">{error}</div> : null}

      {selectedTour && form ? (
        <section className="mgmt-edit-panel" aria-label="Edit tour">
          <header>
            <div>
              <h3>Sua tour</h3>
              <p>{selectedTour.name}</p>
            </div>
            <button
              className="mgmt-action-btn"
              type="button"
              onClick={() => {
                setSelectedTour(null)
                setForm(null)
              }}
            >
              <X size={16} strokeWidth={2.2} aria-hidden="true" />
              Dong
            </button>
          </header>

          <div className="mgmt-edit-grid">
            <div className="mgmt-edit-field">
              <label htmlFor="tour-code">Code</label>
              <input
                id="tour-code"
                value={form.code}
                onChange={(event) => updateForm('code', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-name">Ten tour</label>
              <input
                id="tour-name"
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-slug">Slug</label>
              <input
                id="tour-slug"
                value={form.slug}
                onChange={(event) => updateForm('slug', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-destination">Destination ID</label>
              <input
                id="tour-destination"
                value={form.destinationId}
                onChange={(event) => updateForm('destinationId', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-price">Gia goc</label>
              <input
                id="tour-price"
                value={form.basePrice}
                onChange={(event) => updateForm('basePrice', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-currency">Currency</label>
              <input
                id="tour-currency"
                value={form.currency}
                onChange={(event) => updateForm('currency', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-days">So ngay</label>
              <input
                id="tour-days"
                value={form.durationDays}
                onChange={(event) => updateForm('durationDays', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-nights">So dem</label>
              <input
                id="tour-nights"
                value={form.durationNights}
                onChange={(event) => updateForm('durationNights', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-transport">Di chuyen</label>
              <input
                id="tour-transport"
                value={form.transportType}
                onChange={(event) => updateForm('transportType', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-mode">Trip mode</label>
              <select
                id="tour-mode"
                value={form.tripMode}
                onChange={(event) => updateForm('tripMode', event.target.value)}
              >
                <option value="group">group</option>
                <option value="private">private</option>
                <option value="shared">shared</option>
              </select>
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="tour-status">Trang thai</label>
              <select
                id="tour-status"
                value={form.status}
                onChange={(event) => updateForm('status', event.target.value)}
              >
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <label className="mgmt-edit-field checkbox">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => updateForm('isFeatured', event.target.checked)}
              />
              <span>Noi bat</span>
            </label>
            <div className="mgmt-edit-field wide">
              <label htmlFor="tour-short">Mo ta ngan</label>
              <textarea
                id="tour-short"
                value={form.shortDescription}
                onChange={(event) => updateForm('shortDescription', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field wide">
              <label htmlFor="tour-description">Noi dung chi tiet</label>
              <textarea
                id="tour-description"
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field wide">
              <label htmlFor="tour-highlights">Highlights</label>
              <textarea
                id="tour-highlights"
                value={form.highlights}
                onChange={(event) => updateForm('highlights', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field wide">
              <label htmlFor="tour-inclusions">Bao gom</label>
              <textarea
                id="tour-inclusions"
                value={form.inclusions}
                onChange={(event) => updateForm('inclusions', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field wide">
              <label htmlFor="tour-exclusions">Khong bao gom</label>
              <textarea
                id="tour-exclusions"
                value={form.exclusions}
                onChange={(event) => updateForm('exclusions', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field wide">
              <label htmlFor="tour-notes">Ghi chu</label>
              <textarea
                id="tour-notes"
                value={form.notes}
                onChange={(event) => updateForm('notes', event.target.value)}
              />
            </div>
          </div>

          <div className="mgmt-edit-actions">
            <button
              className="mgmt-action-btn"
              type="button"
              onClick={() => setForm(tourToForm(selectedTour))}
              disabled={saving}
            >
              Hoan tac
            </button>
            <button
              className="mgmt-action-btn primary"
              type="button"
              onClick={() => void saveTour()}
              disabled={saving}
            >
              {saving ? (
                <LoaderCircle size={16} strokeWidth={2.2} aria-hidden="true" />
              ) : (
                <Check size={16} strokeWidth={2.2} aria-hidden="true" />
              )}
              Luu thay doi
            </button>
          </div>
        </section>
      ) : null}

      {tours.length === 0 && !loading ? (
        <div className="mgmt-empty-content">
          <ErrorBlock message="Chua co tour nao phu hop bo loc hien tai." />
        </div>
      ) : (
        <div className="mgmt-content-grid">
          {tours.map((tour) => {
            const status = normalizeStatus(tour.status)
            const image = resolveTourCover(tour)
            const busy = busyId === tour.id

            return (
              <article className="mgmt-content-card" key={tour.id}>
                <div className="mgmt-content-media">
                  {image ? (
                    <img src={image} alt={tour.name} />
                  ) : (
                    <div className="mgmt-content-media-empty">
                      <Image size={32} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                  )}
                  <span className={`mgmt-status-badge status-${status}`}>
                    {tour.status || 'unknown'}
                  </span>
                </div>
                <div className="mgmt-content-card-body">
                  <h3>{tour.name}</h3>
                  <p>{getTourSummary(tour)}</p>
                  <div className="mgmt-content-meta">
                    <span>
                      <CalendarDays size={15} strokeWidth={1.8} aria-hidden="true" />
                      {formatDuration(tour.durationDays, tour.durationNights)}
                    </span>
                    <span>
                      <Tag size={15} strokeWidth={1.8} aria-hidden="true" />
                      {formatPrice(tour.basePrice, tour.currency)}
                    </span>
                    <span>
                      {tour.code || tour.slug || 'No code'} - Destination #{tour.destinationId || 'N/A'}
                    </span>
                    {statusCounts[status] ? <span>{statusCounts[status]} cung trang thai</span> : null}
                  </div>
                  <div className="mgmt-content-actions">
                    <Link className="mgmt-action-link" to={`/tours/${tour.id}`}>
                      <Eye size={15} strokeWidth={2.1} aria-hidden="true" />
                      Xem nhu khach
                    </Link>
                    <button
                      className="mgmt-action-btn primary"
                      type="button"
                      disabled={busy}
                      onClick={() => void openEdit(tour)}
                    >
                      <Edit3 size={15} strokeWidth={2.1} aria-hidden="true" />
                      Sua
                    </button>
                    <button
                      className="mgmt-action-btn danger"
                      type="button"
                      disabled={busy}
                      onClick={() => void deleteTour(tour)}
                    >
                      <Trash2 size={15} strokeWidth={2.1} aria-hidden="true" />
                      Xoa
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ManageToursPage
