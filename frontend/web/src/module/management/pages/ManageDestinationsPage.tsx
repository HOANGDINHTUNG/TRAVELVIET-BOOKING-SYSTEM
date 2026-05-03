import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  Edit3,
  Eye,
  Image,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import {
  contentManagementApi,
  destinationDetailToPayload,
  type AdminDestination,
  type AdminDestinationDetail,
  type AdminDestinationPayload,
} from '../api/contentManagementApi'
import './ManagementContentPage.css'

const ALL_STATUS = ''
const DESTINATION_STATUSES = [
  { value: ALL_STATUS, label: 'Tat ca trang thai' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'REJECTED', label: 'Rejected' },
]

type DestinationFormState = {
  code: string
  name: string
  slug: string
  countryCode: string
  province: string
  district: string
  region: string
  address: string
  latitude: string
  longitude: string
  shortDescription: string
  description: string
  bestTimeFromMonth: string
  bestTimeToMonth: string
  crowdLevelDefault: string
  isFeatured: boolean
  isActive: boolean
  isOfficial: boolean
}

function toText(value: unknown) {
  return value === undefined || value === null ? '' : String(value)
}

function normalizeStatus(value?: string) {
  return (value || 'unknown').toLowerCase()
}

function optionalNumber(value: string) {
  if (!value.trim()) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function optionalText(value: string) {
  const trimmed = value.trim()
  return trimmed || undefined
}

function destinationToForm(detail: AdminDestinationDetail): DestinationFormState {
  return {
    code: toText(detail.code),
    name: toText(detail.name),
    slug: toText(detail.slug),
    countryCode: toText(detail.countryCode || 'VN'),
    province: toText(detail.province),
    district: toText(detail.district),
    region: toText(detail.region),
    address: toText(detail.address),
    latitude: toText(detail.latitude),
    longitude: toText(detail.longitude),
    shortDescription: toText(detail.shortDescription),
    description: toText(detail.description),
    bestTimeFromMonth: toText(detail.bestTimeFromMonth),
    bestTimeToMonth: toText(detail.bestTimeToMonth),
    crowdLevelDefault: toText(detail.crowdLevelDefault || 'MEDIUM'),
    isFeatured: Boolean(detail.isFeatured),
    isActive: detail.isActive !== false,
    isOfficial: Boolean(detail.isOfficial),
  }
}

function buildPayload(
  detail: AdminDestinationDetail,
  form: DestinationFormState,
): AdminDestinationPayload {
  return {
    ...destinationDetailToPayload(detail),
    code: form.code.trim(),
    name: form.name.trim(),
    slug: optionalText(form.slug),
    countryCode: optionalText(form.countryCode)?.toUpperCase(),
    province: form.province.trim(),
    district: optionalText(form.district),
    region: optionalText(form.region),
    address: optionalText(form.address),
    latitude: optionalNumber(form.latitude),
    longitude: optionalNumber(form.longitude),
    shortDescription: optionalText(form.shortDescription),
    description: optionalText(form.description),
    bestTimeFromMonth: optionalNumber(form.bestTimeFromMonth),
    bestTimeToMonth: optionalNumber(form.bestTimeToMonth),
    crowdLevelDefault: optionalText(form.crowdLevelDefault),
    isFeatured: form.isFeatured,
    isActive: form.isActive,
    isOfficial: form.isOfficial,
  }
}

function getDestinationArea(destination: AdminDestination) {
  return destination.region || destination.province || 'Vietnam'
}

function getDestinationSummary(destination: AdminDestination) {
  return (
    destination.shortDescription ||
    destination.description ||
    'Noi dung diem den dang duoc cap nhat.'
  )
}

function ManageDestinationsPage() {
  const [destinations, setDestinations] = useState<AdminDestination[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(ALL_STATUS)
  const [selectedDetail, setSelectedDetail] = useState<AdminDestinationDetail | null>(null)
  const [form, setForm] = useState<DestinationFormState | null>(null)

  const loadDestinations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const page = await contentManagementApi.getAdminDestinations({
        keyword: searchQuery.trim() || undefined,
        status: selectedStatus || undefined,
      })

      setDestinations(page.content)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Khong the tai danh sach diem den quan tri.',
      )
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedStatus])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDestinations()
    }, 220)

    return () => window.clearTimeout(timer)
  }, [loadDestinations])

  const statusCounts = useMemo(() => {
    return destinations.reduce<Record<string, number>>((counts, destination) => {
      const key = normalizeStatus(destination.status)
      counts[key] = (counts[key] ?? 0) + 1
      return counts
    }, {})
  }, [destinations])

  const openEdit = async (destination: AdminDestination) => {
    if (!destination.uuid) {
      return
    }

    setBusyId(destination.uuid)
    setError(null)

    try {
      const detail = await contentManagementApi.getAdminDestinationByUuid(destination.uuid)
      setSelectedDetail(detail)
      setForm(destinationToForm(detail))
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Khong the tai chi tiet diem den.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const updateForm = <Key extends keyof DestinationFormState>(
    key: Key,
    value: DestinationFormState[Key],
  ) => {
    setForm((current) => (current ? { ...current, [key]: value } : current))
  }

  const saveDestination = async () => {
    if (!selectedDetail || !form) {
      return
    }

    if (!form.code.trim() || !form.name.trim() || !form.province.trim()) {
      setError('Code, ten diem den va tinh/thanh la bat buoc.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await contentManagementApi.updateDestination(
        selectedDetail.uuid,
        buildPayload(selectedDetail, form),
      )
      setSelectedDetail(null)
      setForm(null)
      await loadDestinations()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Khong the luu diem den.',
      )
    } finally {
      setSaving(false)
    }
  }

  const deleteDestination = async (destination: AdminDestination) => {
    if (!destination.uuid) {
      return
    }

    const confirmed = window.confirm(`Xoa diem den "${destination.name}"?`)
    if (!confirmed) {
      return
    }

    setBusyId(destination.uuid)
    setError(null)

    try {
      await contentManagementApi.deleteDestination(destination.uuid)
      if (selectedDetail?.uuid === destination.uuid) {
        setSelectedDetail(null)
        setForm(null)
      }
      await loadDestinations()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Khong the xoa diem den.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const approveDestination = async (destination: AdminDestination) => {
    if (!destination.uuid) {
      return
    }

    setBusyId(destination.uuid)
    setError(null)

    try {
      await contentManagementApi.approveDestination(destination.uuid)
      await loadDestinations()
    } catch (approveError) {
      setError(
        approveError instanceof Error
          ? approveError.message
          : 'Khong the duyet diem den.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const rejectDestination = async (destination: AdminDestination) => {
    if (!destination.uuid) {
      return
    }

    const reason = window.prompt('Ly do tu choi de luu vao ho so diem den:')
    if (reason === null) {
      return
    }

    setBusyId(destination.uuid)
    setError(null)

    try {
      await contentManagementApi.rejectDestination(
        destination.uuid,
        reason.trim() || 'No reason provided',
      )
      await loadDestinations()
    } catch (rejectError) {
      setError(
        rejectError instanceof Error
          ? rejectError.message
          : 'Khong the tu choi diem den.',
      )
    } finally {
      setBusyId(null)
    }
  }

  if (loading && destinations.length === 0) {
    return <PageLoader label="Dang tai diem den quan tri..." />
  }

  return (
    <div className="mgmt-content-page">
      <header className="mgmt-content-header">
        <div>
          <p className="mgmt-content-kicker">Destination management</p>
          <h2>Quan ly diem den nhu trang khach dang xem</h2>
          <p>
            Moi diem den duoc hien thanh card co anh, khu vuc, trang thai va
            nut xem chi tiet. Quan tri vien co the sua nhanh, xoa hoac duyet de
            noi dung di vao luong public.
          </p>
        </div>
        <div className="mgmt-content-count">
          <strong>{destinations.length}</strong>
          <span>Diem den</span>
        </div>
      </header>

      <div className="mgmt-content-toolbar" aria-label="Destination management filters">
        <label className="mgmt-content-search">
          <Search size={18} strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            placeholder="Tim ten, code, tinh thanh..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <select
          className="mgmt-content-select"
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          {DESTINATION_STATUSES.map((status) => (
            <option key={status.value || 'all'} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <button
          className="mgmt-content-refresh"
          type="button"
          onClick={() => void loadDestinations()}
        >
          <RefreshCw size={16} strokeWidth={2.2} aria-hidden="true" />
          Lam moi
        </button>
      </div>

      {error ? <div className="mgmt-content-alert">{error}</div> : null}

      {selectedDetail && form ? (
        <section className="mgmt-edit-panel" aria-label="Edit destination">
          <header>
            <div>
              <h3>Sua diem den</h3>
              <p>{selectedDetail.name}</p>
            </div>
            <button
              className="mgmt-action-btn"
              type="button"
              onClick={() => {
                setSelectedDetail(null)
                setForm(null)
              }}
            >
              <X size={16} strokeWidth={2.2} aria-hidden="true" />
              Dong
            </button>
          </header>

          <div className="mgmt-edit-grid">
            <div className="mgmt-edit-field">
              <label htmlFor="destination-code">Code</label>
              <input
                id="destination-code"
                value={form.code}
                onChange={(event) => updateForm('code', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-name">Ten diem den</label>
              <input
                id="destination-name"
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-slug">Slug</label>
              <input
                id="destination-slug"
                value={form.slug}
                onChange={(event) => updateForm('slug', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-country">Country</label>
              <input
                id="destination-country"
                value={form.countryCode}
                onChange={(event) => updateForm('countryCode', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-province">Tinh/Thanh</label>
              <input
                id="destination-province"
                value={form.province}
                onChange={(event) => updateForm('province', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-region">Khu vuc</label>
              <input
                id="destination-region"
                value={form.region}
                onChange={(event) => updateForm('region', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-district">Quan/Huyen</label>
              <input
                id="destination-district"
                value={form.district}
                onChange={(event) => updateForm('district', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-latitude">Latitude</label>
              <input
                id="destination-latitude"
                value={form.latitude}
                onChange={(event) => updateForm('latitude', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-longitude">Longitude</label>
              <input
                id="destination-longitude"
                value={form.longitude}
                onChange={(event) => updateForm('longitude', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-from-month">Mua dep tu thang</label>
              <input
                id="destination-from-month"
                value={form.bestTimeFromMonth}
                onChange={(event) => updateForm('bestTimeFromMonth', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-to-month">Den thang</label>
              <input
                id="destination-to-month"
                value={form.bestTimeToMonth}
                onChange={(event) => updateForm('bestTimeToMonth', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field">
              <label htmlFor="destination-crowd">Crowd</label>
              <select
                id="destination-crowd"
                value={form.crowdLevelDefault}
                onChange={(event) => updateForm('crowdLevelDefault', event.target.value)}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
            <div className="mgmt-edit-field wide">
              <label htmlFor="destination-address">Dia chi</label>
              <input
                id="destination-address"
                value={form.address}
                onChange={(event) => updateForm('address', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field wide">
              <label htmlFor="destination-short">Mo ta ngan</label>
              <textarea
                id="destination-short"
                value={form.shortDescription}
                onChange={(event) => updateForm('shortDescription', event.target.value)}
              />
            </div>
            <div className="mgmt-edit-field wide">
              <label htmlFor="destination-description">Noi dung chi tiet</label>
              <textarea
                id="destination-description"
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
              />
            </div>
            <label className="mgmt-edit-field checkbox">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => updateForm('isFeatured', event.target.checked)}
              />
              <span>Noi bat</span>
            </label>
            <label className="mgmt-edit-field checkbox">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => updateForm('isActive', event.target.checked)}
              />
              <span>Dang hien thi</span>
            </label>
            <label className="mgmt-edit-field checkbox">
              <input
                type="checkbox"
                checked={form.isOfficial}
                onChange={(event) => updateForm('isOfficial', event.target.checked)}
              />
              <span>Official</span>
            </label>
          </div>

          <div className="mgmt-edit-actions">
            <button
              className="mgmt-action-btn"
              type="button"
              onClick={() => setForm(destinationToForm(selectedDetail))}
              disabled={saving}
            >
              Hoan tac
            </button>
            <button
              className="mgmt-action-btn primary"
              type="button"
              onClick={() => void saveDestination()}
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

      {destinations.length === 0 && !loading ? (
        <div className="mgmt-empty-content">
          <ErrorBlock message="Chua co diem den nao phu hop bo loc hien tai." />
        </div>
      ) : (
        <div className="mgmt-content-grid">
          {destinations.map((destination) => {
            const status = normalizeStatus(destination.status)
            const pending = status === 'pending'
            const canEdit = status === 'approved' && !destination.deletedAt
            const busy = busyId === destination.uuid

            return (
              <article className="mgmt-content-card" key={destination.uuid || destination.name}>
                <div className="mgmt-content-media">
                  {destination.coverImageUrl ? (
                    <img src={destination.coverImageUrl} alt={destination.name} />
                  ) : (
                    <div className="mgmt-content-media-empty">
                      <Image size={32} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                  )}
                  <span className={`mgmt-status-badge status-${status}`}>
                    {destination.status || 'unknown'}
                  </span>
                </div>
                <div className="mgmt-content-card-body">
                  <h3>{destination.name}</h3>
                  <p>{getDestinationSummary(destination)}</p>
                  <div className="mgmt-content-meta">
                    <span>
                      <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
                      {getDestinationArea(destination)}
                    </span>
                    <span>{destination.code || destination.slug || 'No code'}</span>
                    <span>
                      {destination.isOfficial ? 'Official' : 'Community'} -{' '}
                      {destination.isActive === false ? 'Hidden' : 'Visible'}
                    </span>
                    {statusCounts[status] ? <span>{statusCounts[status]} cung trang thai</span> : null}
                  </div>
                  <div className="mgmt-content-actions">
                    {destination.uuid ? (
                      <Link
                        className="mgmt-action-link"
                        to={`/destinations/${destination.uuid}`}
                      >
                        <Eye size={15} strokeWidth={2.1} aria-hidden="true" />
                        Xem nhu khach
                      </Link>
                    ) : null}
                    <button
                      className="mgmt-action-btn primary"
                      type="button"
                      disabled={!canEdit || busy}
                      onClick={() => void openEdit(destination)}
                    >
                      <Edit3 size={15} strokeWidth={2.1} aria-hidden="true" />
                      Sua
                    </button>
                    {pending ? (
                      <>
                        <button
                          className="mgmt-action-btn"
                          type="button"
                          disabled={busy}
                          onClick={() => void approveDestination(destination)}
                        >
                          <Check size={15} strokeWidth={2.1} aria-hidden="true" />
                          Duyet
                        </button>
                        <button
                          className="mgmt-action-btn danger"
                          type="button"
                          disabled={busy}
                          onClick={() => void rejectDestination(destination)}
                        >
                          <X size={15} strokeWidth={2.1} aria-hidden="true" />
                          Tu choi
                        </button>
                      </>
                    ) : null}
                    <button
                      className="mgmt-action-btn danger"
                      type="button"
                      disabled={busy}
                      onClick={() => void deleteDestination(destination)}
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

export default ManageDestinationsPage
