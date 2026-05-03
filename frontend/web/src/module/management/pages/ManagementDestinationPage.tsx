import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Eye,
  MapPinned,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  XCircle,
} from 'lucide-react'
import { Navigate, useOutletContext } from 'react-router-dom'
import {
  destinationApi,
  type AdminDestination,
  type AdminDestinationDetail,
  type AdminDestinationPayload,
} from '../../../api/server/Destination.api'
import type { UserAccessContext } from '../../auth/api/authApi'
import {
  canAccessManagementItem,
  getManagementNavItem,
} from '../config/managementNavigation'

type ManagementOutletContext = {
  accessContext: UserAccessContext | null
}

type DestinationQueryState = {
  keyword: string
  province: string
  region: string
  status: string
  crowdLevel: string
  isFeatured: string
  isActive: string
  isOfficial: string
}

type DestinationFormState = {
  uuid: string | null
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

const destinationStatusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Đã từ chối' },
]

const crowdLevelOptions = [
  { value: '', label: 'Tất cả mật độ' },
  { value: 'LOW', label: 'Thấp' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HIGH', label: 'Cao' },
  { value: 'VERY_HIGH', label: 'Rất cao' },
]

const booleanFilterOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'true', label: 'Có' },
  { value: 'false', label: 'Không' },
]

function createEmptyDestinationForm(): DestinationFormState {
  return {
    uuid: null,
    code: '',
    name: '',
    slug: '',
    countryCode: 'VN',
    province: '',
    district: '',
    region: '',
    address: '',
    latitude: '',
    longitude: '',
    shortDescription: '',
    description: '',
    bestTimeFromMonth: '',
    bestTimeToMonth: '',
    crowdLevelDefault: 'MEDIUM',
    isFeatured: false,
    isActive: true,
    isOfficial: true,
  }
}

function canUsePermission(accessContext: UserAccessContext, permission: string) {
  return (
    Boolean(accessContext.isSuperAdmin) ||
    (accessContext.permissions ?? []).includes(permission)
  )
}

function toBooleanFilter(value: string) {
  if (!value) {
    return undefined
  }

  return value === 'true'
}

function toOptionalNumber(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  const numberValue = Number(trimmed)
  return Number.isFinite(numberValue) ? numberValue : undefined
}

function normalizeStatus(status: string | undefined) {
  return status?.toUpperCase() ?? ''
}

function labelFor(options: Array<{ value: string; label: string }>, value: string | undefined) {
  const normalized = value?.toUpperCase() ?? ''
  return options.find((option) => option.value === normalized)?.label ?? value ?? '-'
}

function formatDate(value: string | undefined) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function toDestinationForm(destination: AdminDestination): DestinationFormState {
  return {
    uuid: destination.uuid,
    code: destination.code ?? '',
    name: destination.name ?? '',
    slug: destination.slug ?? '',
    countryCode: destination.countryCode ?? 'VN',
    province: destination.province ?? '',
    district: destination.district ?? '',
    region: destination.region ?? '',
    address: destination.address ?? '',
    latitude: destination.latitude?.toString() ?? '',
    longitude: destination.longitude?.toString() ?? '',
    shortDescription: destination.shortDescription ?? '',
    description: destination.description ?? '',
    bestTimeFromMonth: destination.bestTimeFromMonth?.toString() ?? '',
    bestTimeToMonth: destination.bestTimeToMonth?.toString() ?? '',
    crowdLevelDefault: normalizeStatus(destination.crowdLevelDefault) || 'MEDIUM',
    isFeatured: Boolean(destination.isFeatured),
    isActive: destination.isActive !== false,
    isOfficial: destination.isOfficial !== false,
  }
}

function buildDestinationPayload(form: DestinationFormState): AdminDestinationPayload {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    slug: form.slug.trim() || undefined,
    countryCode: form.countryCode.trim() || 'VN',
    province: form.province.trim(),
    district: form.district.trim() || undefined,
    region: form.region.trim() || undefined,
    address: form.address.trim() || undefined,
    latitude: toOptionalNumber(form.latitude),
    longitude: toOptionalNumber(form.longitude),
    shortDescription: form.shortDescription.trim() || undefined,
    description: form.description.trim() || undefined,
    bestTimeFromMonth: toOptionalNumber(form.bestTimeFromMonth),
    bestTimeToMonth: toOptionalNumber(form.bestTimeToMonth),
    crowdLevelDefault: form.crowdLevelDefault || undefined,
    isFeatured: form.isFeatured,
    isActive: form.isActive,
    isOfficial: form.isOfficial,
  }
}

function updateDestinationList(
  destinations: AdminDestination[],
  updated: AdminDestination,
) {
  const exists = destinations.some((destination) => destination.uuid === updated.uuid)
  return exists
    ? destinations.map((destination) =>
        destination.uuid === updated.uuid ? { ...destination, ...updated } : destination,
      )
    : [updated, ...destinations]
}

function ManagementDestinationPage() {
  const { accessContext } = useOutletContext<ManagementOutletContext>()
  const pageConfig = getManagementNavItem('destinations')
  const [query, setQuery] = useState<DestinationQueryState>({
    keyword: '',
    province: '',
    region: '',
    status: '',
    crowdLevel: '',
    isFeatured: '',
    isActive: '',
    isOfficial: '',
  })
  const [destinations, setDestinations] = useState<AdminDestination[]>([])
  const [selectedDestination, setSelectedDestination] = useState<AdminDestinationDetail | null>(null)
  const [form, setForm] = useState<DestinationFormState>(() => createEmptyDestinationForm())
  const [rejectReason, setRejectReason] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [workingUuid, setWorkingUuid] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const hasPageAccess = Boolean(
    pageConfig &&
      accessContext &&
      canAccessManagementItem(
        pageConfig,
        accessContext.permissions ?? [],
        Boolean(accessContext.isSuperAdmin),
      ),
  )
  const canCreate = accessContext ? canUsePermission(accessContext, 'destination.create') : false
  const canUpdate = accessContext ? canUsePermission(accessContext, 'destination.update') : false
  const canDelete = accessContext ? canUsePermission(accessContext, 'destination.delete') : false
  const canReview = accessContext
    ? canUsePermission(accessContext, 'destination.review') ||
      canUsePermission(accessContext, 'destination.publish')
    : false
  const editing = Boolean(form.uuid)
  const approvedCount = destinations.filter(
    (destination) => normalizeStatus(destination.status) === 'APPROVED',
  ).length
  const pendingCount = destinations.filter(
    (destination) => normalizeStatus(destination.status) === 'PENDING',
  ).length
  const activeCount = destinations.filter((destination) => destination.deletedAt == null).length

  const loadDestinations = async (nextPage = page) => {
    if (!hasPageAccess) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await destinationApi.getAdminDestinations({
        page: nextPage,
        size: 12,
        keyword: query.keyword.trim() || undefined,
        province: query.province.trim() || undefined,
        region: query.region.trim() || undefined,
        status: query.status || undefined,
        crowdLevel: query.crowdLevel || undefined,
        isFeatured: toBooleanFilter(query.isFeatured),
        isActive: toBooleanFilter(query.isActive),
        isOfficial: toBooleanFilter(query.isOfficial),
        sortBy: 'updatedAt',
        sortDir: 'desc',
      })

      const nextDestinations = response.content ?? []
      setDestinations(nextDestinations)
      setPage(response.page)
      setTotalPages(Math.max(response.totalPages, 1))
      setTotalElements(response.totalElements)

      if (nextDestinations.length > 0 && !selectedDestination) {
        void loadDestinationDetail(nextDestinations[0].uuid)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải danh sách điểm đến.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasPageAccess) {
      void loadDestinations(0)
    }
  }, [hasPageAccess])

  const updateQuery = (patch: Partial<DestinationQueryState>) => {
    setQuery((current) => ({ ...current, ...patch }))
  }

  const updateForm = (patch: Partial<DestinationFormState>) => {
    setForm((current) => ({ ...current, ...patch }))
  }

  const startCreate = () => {
    setMessage('')
    setSelectedDestination(null)
    setRejectReason('')
    setForm(createEmptyDestinationForm())
  }

  const loadDestinationDetail = async (uuid: string) => {
    setDetailLoading(true)
    setMessage('')

    try {
      const detail = await destinationApi.getAdminDestination(uuid)
      setSelectedDestination(detail)
      setForm(toDestinationForm(detail))
      setRejectReason(detail.rejectionReason ?? '')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải chi tiết điểm đến.')
    } finally {
      setDetailLoading(false)
    }
  }

  const saveDestination = async () => {
    if ((editing && !canUpdate) || (!editing && !canCreate)) {
      setMessage('Bạn chưa có quyền thực hiện thao tác này.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const payload = buildDestinationPayload(form)
      const saved = editing && form.uuid
        ? await destinationApi.updateAdminDestination(form.uuid, payload)
        : await destinationApi.createAdminDestination(payload)

      setSelectedDestination(saved)
      setForm(toDestinationForm(saved))
      setDestinations((current) => updateDestinationList(current, saved))
      if (!editing) {
        setTotalElements((current) => current + 1)
      }
      setMessage(editing ? 'Đã cập nhật điểm đến.' : 'Đã tạo điểm đến mới.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu điểm đến.')
    } finally {
      setSaving(false)
    }
  }

  const approveDestination = async (destination: AdminDestination) => {
    if (!canReview) {
      setMessage('Bạn chưa có quyền duyệt điểm đến.')
      return
    }

    setWorkingUuid(destination.uuid)
    setMessage('')

    try {
      const approved = await destinationApi.approveAdminDestination(destination.uuid)
      setSelectedDestination(approved)
      setForm(toDestinationForm(approved))
      setDestinations((current) => updateDestinationList(current, approved))
      setRejectReason('')
      setMessage('Đã duyệt điểm đến.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể duyệt điểm đến.')
    } finally {
      setWorkingUuid(null)
    }
  }

  const rejectDestination = async (destination: AdminDestination) => {
    if (!canReview) {
      setMessage('Bạn chưa có quyền từ chối điểm đến.')
      return
    }

    if (!rejectReason.trim()) {
      setMessage('Vui lòng nhập lý do từ chối.')
      return
    }

    setWorkingUuid(destination.uuid)
    setMessage('')

    try {
      const rejected = await destinationApi.rejectAdminDestination(
        destination.uuid,
        rejectReason.trim(),
      )
      setSelectedDestination(rejected)
      setForm(toDestinationForm(rejected))
      setDestinations((current) => updateDestinationList(current, rejected))
      setMessage('Đã từ chối điểm đến.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể từ chối điểm đến.')
    } finally {
      setWorkingUuid(null)
    }
  }

  const deleteDestination = async (destination: AdminDestination) => {
    if (!canDelete) {
      setMessage('Bạn chưa có quyền xóa điểm đến.')
      return
    }

    setWorkingUuid(destination.uuid)
    setMessage('')

    try {
      await destinationApi.deleteAdminDestination(destination.uuid)
      setDestinations((current) =>
        current.filter((item) => item.uuid !== destination.uuid),
      )
      if (selectedDestination?.uuid === destination.uuid) {
        setSelectedDestination(null)
        setForm(createEmptyDestinationForm())
      }
      setTotalElements((current) => Math.max(current - 1, 0))
      setMessage('Đã xóa mềm điểm đến.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể xóa điểm đến.')
    } finally {
      setWorkingUuid(null)
    }
  }

  const currentStatus = normalizeStatus(selectedDestination?.status)
  const canEditCurrent = !editing || currentStatus === 'APPROVED'

  if (!pageConfig) {
    return <Navigate to="/management/dashboard" replace />
  }

  if (!accessContext) {
    return (
      <div className="mgmt-page">
        <section className="mgmt-module-shell">
          <p className="mgmt-kicker">ĐANG TẢI</p>
          <h2>Đang kiểm tra quyền truy cập</h2>
          <p>Hệ thống đang lấy quyền hiệu lực của tài khoản hiện tại.</p>
        </section>
      </div>
    )
  }

  if (
    !canAccessManagementItem(
      pageConfig,
      accessContext.permissions ?? [],
      Boolean(accessContext.isSuperAdmin),
    )
  ) {
    return (
      <div className="mgmt-page">
        <section className="mgmt-module-shell">
          <p className="mgmt-kicker">KHÔNG CÓ QUYỀN</p>
          <h2>Bạn không có quyền truy cập quản lý điểm đến</h2>
          <p>Chỉ tài khoản có quyền destination.view mới được xem khu vực này.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="mgmt-page">
      <section className="mgmt-crud-shell">
        <header className="mgmt-crud-head">
          <div>
            <p className="mgmt-kicker">ĐIỂM ĐẾN</p>
            <h2>Quản lý điểm đến và đề xuất</h2>
            <p>
              Tìm kiếm, xem chi tiết, tạo mới, cập nhật thông tin lõi và duyệt
              hoặc từ chối các đề xuất điểm đến.
            </p>
          </div>

          <div className="mgmt-crud-summary">
            <span>
              <MapPinned aria-hidden="true" />
              {activeCount}/{destinations.length} đang hiện
            </span>
            <span>
              <CheckCircle2 aria-hidden="true" />
              {approvedCount} đã duyệt
            </span>
            <span>
              <ShieldCheck aria-hidden="true" />
              {pendingCount} chờ duyệt
            </span>
          </div>
        </header>

        <div className="mgmt-destination-toolbar">
          <label className="mgmt-crud-search">
            <Search aria-hidden="true" />
            <input
              value={query.keyword}
              onChange={(event) => updateQuery({ keyword: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void loadDestinations(0)
                }
              }}
              placeholder="Tìm theo tên hoặc mã điểm đến"
            />
          </label>
          <input
            value={query.province}
            onChange={(event) => updateQuery({ province: event.target.value })}
            placeholder="Tỉnh/thành"
            aria-label="Lọc tỉnh thành"
          />
          <input
            value={query.region}
            onChange={(event) => updateQuery({ region: event.target.value })}
            placeholder="Vùng miền"
            aria-label="Lọc vùng miền"
          />
          <select value={query.status} onChange={(event) => updateQuery({ status: event.target.value })}>
            {destinationStatusOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select value={query.crowdLevel} onChange={(event) => updateQuery({ crowdLevel: event.target.value })}>
            {crowdLevelOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select value={query.isFeatured} onChange={(event) => updateQuery({ isFeatured: event.target.value })}>
            {booleanFilterOptions.map((option) => (
              <option value={option.value} key={option.value}>
                Nổi bật: {option.label}
              </option>
            ))}
          </select>
          <select value={query.isActive} onChange={(event) => updateQuery({ isActive: event.target.value })}>
            {booleanFilterOptions.map((option) => (
              <option value={option.value} key={option.value}>
                Hoạt động: {option.label}
              </option>
            ))}
          </select>
          <select value={query.isOfficial} onChange={(event) => updateQuery({ isOfficial: event.target.value })}>
            {booleanFilterOptions.map((option) => (
              <option value={option.value} key={option.value}>
                Chính thức: {option.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => void loadDestinations(0)} disabled={loading}>
            <RefreshCcw aria-hidden="true" />
            Tải lại
          </button>
          {canCreate && (
            <button type="button" onClick={startCreate}>
              <Plus aria-hidden="true" />
              Tạo mới
            </button>
          )}
        </div>

        <div className="mgmt-destination-layout">
          <article className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>Danh sách điểm đến</h3>
              <p>
                Trang {page + 1}/{totalPages}, tổng {totalElements} điểm đến theo bộ lọc.
              </p>
            </div>

            {loading ? (
              <p className="mgmt-crud-empty">Đang tải danh sách điểm đến...</p>
            ) : destinations.length > 0 ? (
              <div className="mgmt-destination-list">
                {destinations.map((destination) => {
                  const status = normalizeStatus(destination.status)
                  const pending = status === 'PENDING'

                  return (
                    <article className="mgmt-destination-row" key={destination.uuid}>
                      <div>
                        <strong>{destination.name || destination.code || destination.uuid}</strong>
                        <small>{destination.province || '-'} · {destination.region || '-'}</small>
                      </div>
                      <span>{destination.code || '-'}</span>
                      <b className={`mgmt-status-chip status-${status.toLowerCase() || 'unknown'}`}>
                        {labelFor(destinationStatusOptions, status)}
                      </b>
                      <em>{destination.isFeatured ? 'Nổi bật' : 'Thường'}</em>
                      <time>{formatDate(destination.updatedAt || destination.createdAt)}</time>
                      <div className="mgmt-row-actions">
                        <button type="button" onClick={() => void loadDestinationDetail(destination.uuid)}>
                          <Eye aria-hidden="true" />
                          Xem
                        </button>
                        <button
                          type="button"
                          onClick={() => void approveDestination(destination)}
                          disabled={!canReview || !pending || workingUuid === destination.uuid}
                        >
                          <CheckCircle2 aria-hidden="true" />
                          Duyệt
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteDestination(destination)}
                          disabled={!canDelete || workingUuid === destination.uuid}
                        >
                          <Trash2 aria-hidden="true" />
                          Xóa
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p className="mgmt-crud-empty">Không có điểm đến phù hợp.</p>
            )}

            <div className="mgmt-crud-pagination">
              <button
                type="button"
                onClick={() => void loadDestinations(Math.max(page - 1, 0))}
                disabled={loading || page <= 0}
              >
                Trước
              </button>
              <span>{page + 1}/{totalPages}</span>
              <button
                type="button"
                onClick={() => void loadDestinations(Math.min(page + 1, totalPages - 1))}
                disabled={loading || page >= totalPages - 1}
              >
                Sau
              </button>
            </div>
          </article>

          <aside className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>{editing ? 'Chi tiết & cập nhật' : 'Tạo điểm đến'}</h3>
              <p>
                Form này xử lý thông tin lõi. Media, món ăn, hoạt động và sự kiện
                sẽ tách thành các tab riêng ở giai đoạn sau.
              </p>
            </div>

            {detailLoading && <p className="mgmt-crud-empty">Đang tải chi tiết...</p>}

            {selectedDestination && (
              <div className="mgmt-destination-preview">
                <span>{labelFor(destinationStatusOptions, selectedDestination.status)}</span>
                <strong>{selectedDestination.name}</strong>
                <small>
                  {selectedDestination.mediaList?.length ?? 0} media · {selectedDestination.foods?.length ?? 0} món ăn · {selectedDestination.events?.length ?? 0} sự kiện
                </small>
                {selectedDestination.rejectionReason && (
                  <p>Lý do từ chối: {selectedDestination.rejectionReason}</p>
                )}
              </div>
            )}

            <div className="mgmt-destination-form">
              <label>
                <span>Mã điểm đến</span>
                <input value={form.code} onChange={(event) => updateForm({ code: event.target.value })} />
              </label>
              <label>
                <span>Tên điểm đến</span>
                <input value={form.name} onChange={(event) => updateForm({ name: event.target.value })} />
              </label>
              <label>
                <span>Slug</span>
                <input value={form.slug} onChange={(event) => updateForm({ slug: event.target.value })} />
              </label>
              <label>
                <span>Quốc gia</span>
                <input value={form.countryCode} onChange={(event) => updateForm({ countryCode: event.target.value })} />
              </label>
              <label>
                <span>Tỉnh/thành</span>
                <input value={form.province} onChange={(event) => updateForm({ province: event.target.value })} />
              </label>
              <label>
                <span>Quận/huyện</span>
                <input value={form.district} onChange={(event) => updateForm({ district: event.target.value })} />
              </label>
              <label>
                <span>Vùng miền</span>
                <input value={form.region} onChange={(event) => updateForm({ region: event.target.value })} />
              </label>
              <label>
                <span>Mật độ mặc định</span>
                <select value={form.crowdLevelDefault} onChange={(event) => updateForm({ crowdLevelDefault: event.target.value })}>
                  {crowdLevelOptions.slice(1).map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Vĩ độ</span>
                <input value={form.latitude} onChange={(event) => updateForm({ latitude: event.target.value })} />
              </label>
              <label>
                <span>Kinh độ</span>
                <input value={form.longitude} onChange={(event) => updateForm({ longitude: event.target.value })} />
              </label>
              <label>
                <span>Tháng đẹp từ</span>
                <input value={form.bestTimeFromMonth} onChange={(event) => updateForm({ bestTimeFromMonth: event.target.value })} />
              </label>
              <label>
                <span>Tháng đẹp đến</span>
                <input value={form.bestTimeToMonth} onChange={(event) => updateForm({ bestTimeToMonth: event.target.value })} />
              </label>
              <label className="mgmt-destination-wide">
                <span>Địa chỉ</span>
                <input value={form.address} onChange={(event) => updateForm({ address: event.target.value })} />
              </label>
              <label className="mgmt-destination-wide">
                <span>Mô tả ngắn</span>
                <textarea value={form.shortDescription} onChange={(event) => updateForm({ shortDescription: event.target.value })} />
              </label>
              <label className="mgmt-destination-wide">
                <span>Mô tả đầy đủ</span>
                <textarea value={form.description} onChange={(event) => updateForm({ description: event.target.value })} />
              </label>

              <div className="mgmt-destination-checks mgmt-destination-wide">
                <label>
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) => updateForm({ isFeatured: event.target.checked })}
                  />
                  Nổi bật
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) => updateForm({ isActive: event.target.checked })}
                  />
                  Đang hoạt động
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.isOfficial}
                    onChange={(event) => updateForm({ isOfficial: event.target.checked })}
                  />
                  Chính thức
                </label>
              </div>

              {editing && currentStatus && currentStatus !== 'APPROVED' && (
                <p className="mgmt-destination-note mgmt-destination-wide">
                  Backend chỉ cho cập nhật điểm đến đã duyệt. Với đề xuất đang chờ,
                  hãy duyệt hoặc từ chối trước khi sửa nội dung.
                </p>
              )}

              <div className="mgmt-crud-actions mgmt-destination-wide">
                <button
                  type="button"
                  onClick={() => void saveDestination()}
                  disabled={saving || (editing ? !canUpdate || !canEditCurrent : !canCreate)}
                >
                  <Save aria-hidden="true" />
                  {saving ? 'Đang lưu...' : 'Lưu điểm đến'}
                </button>
                <button type="button" onClick={startCreate}>
                  <Plus aria-hidden="true" />
                  Tạo form mới
                </button>
              </div>
            </div>

            {selectedDestination && currentStatus === 'PENDING' && (
              <div className="mgmt-destination-review">
                <strong>Duyệt đề xuất</strong>
                <textarea
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                  placeholder="Nhập lý do nếu cần từ chối đề xuất"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => void approveDestination(selectedDestination)}
                    disabled={!canReview || workingUuid === selectedDestination.uuid}
                  >
                    <CheckCircle2 aria-hidden="true" />
                    Duyệt
                  </button>
                  <button
                    type="button"
                    onClick={() => void rejectDestination(selectedDestination)}
                    disabled={!canReview || workingUuid === selectedDestination.uuid}
                  >
                    <XCircle aria-hidden="true" />
                    Từ chối
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>

        {message && <p className="mgmt-crud-message">{message}</p>}
      </section>
    </div>
  )
}

export default ManagementDestinationPage
