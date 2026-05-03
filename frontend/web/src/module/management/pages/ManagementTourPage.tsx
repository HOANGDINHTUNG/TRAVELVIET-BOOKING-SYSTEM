import { useEffect, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Plus,
  RefreshCcw,
  Save,
  Search,
  TicketPercent,
  Trash2,
} from 'lucide-react'
import { Navigate, useOutletContext } from 'react-router-dom'
import {
  tourApi,
} from '../../../api/server/Tour.api'
import type {
  BackendTour,
  BackendTourSchedule,
} from '../../home/database/interface/publicTravel'
import type { UserAccessContext } from '../../auth/api/authApi'
import {
  canAccessManagementItem,
  getManagementNavItem,
} from '../config/managementNavigation'

type TourManagementMode = 'tours' | 'schedules'

type ManagementTourPageProps = {
  mode: TourManagementMode
}

type ManagementOutletContext = {
  accessContext: UserAccessContext | null
}

type TourQueryState = {
  keyword: string
  tripMode: string
  featuredOnly: string
  destinationId: string
}

type TourFormState = {
  id: number | null
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
  shortDescription: string
  description: string
  highlights: string
  inclusions: string
  exclusions: string
  notes: string
  isFeatured: boolean
  status: string
}

type ScheduleFormState = {
  id: number | null
  tourId: number | null
  scheduleCode: string
  departureAt: string
  returnAt: string
  bookingOpenAt: string
  bookingCloseAt: string
  meetingAt: string
  meetingPointName: string
  meetingAddress: string
  capacityTotal: string
  minGuestsToOperate: string
  adultPrice: string
  childPrice: string
  infantPrice: string
  seniorPrice: string
  singleRoomSurcharge: string
  transportDetail: string
  note: string
  status: string
}

const tripModeOptions = [
  { value: '', label: 'Tất cả hình thức' },
  { value: 'group', label: 'Tour đoàn' },
  { value: 'private', label: 'Tour riêng' },
  { value: 'shared', label: 'Ghép đoàn' },
]

const booleanFilterOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'true', label: 'Có' },
  { value: 'false', label: 'Không' },
]

const tourStatusOptions = [
  { value: 'draft', label: 'Nháp' },
  { value: 'active', label: 'Đang bán' },
  { value: 'inactive', label: 'Tạm dừng' },
  { value: 'archived', label: 'Lưu trữ' },
]

const scheduleStatusOptions = [
  { value: 'draft', label: 'Nháp' },
  { value: 'open', label: 'Mở bán' },
  { value: 'closed', label: 'Đóng bán' },
  { value: 'full', label: 'Hết chỗ' },
  { value: 'departed', label: 'Đã khởi hành' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
]

function createEmptyTourForm(): TourFormState {
  return {
    id: null,
    code: '',
    name: '',
    slug: '',
    destinationId: '',
    basePrice: '',
    currency: 'VND',
    durationDays: '1',
    durationNights: '0',
    transportType: '',
    tripMode: 'group',
    shortDescription: '',
    description: '',
    highlights: '',
    inclusions: '',
    exclusions: '',
    notes: '',
    isFeatured: false,
    status: 'draft',
  }
}

function createEmptyScheduleForm(tourId: number | null): ScheduleFormState {
  return {
    id: null,
    tourId,
    scheduleCode: '',
    departureAt: '',
    returnAt: '',
    bookingOpenAt: '',
    bookingCloseAt: '',
    meetingAt: '',
    meetingPointName: '',
    meetingAddress: '',
    capacityTotal: '20',
    minGuestsToOperate: '1',
    adultPrice: '',
    childPrice: '0',
    infantPrice: '0',
    seniorPrice: '0',
    singleRoomSurcharge: '0',
    transportDetail: '',
    note: '',
    status: 'draft',
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

function formatMoney(value: number | string | undefined, currency = 'VND') {
  const amount = Number(value)
  if (!Number.isFinite(amount)) {
    return '-'
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function labelFor(options: Array<{ value: string; label: string }>, value: string | undefined) {
  return options.find((option) => option.value.toLowerCase() === value?.toLowerCase())?.label ?? value ?? '-'
}

function toTourForm(tour: BackendTour): TourFormState {
  return {
    id: tour.id,
    code: tour.code ?? '',
    name: tour.name ?? '',
    slug: tour.slug ?? '',
    destinationId: tour.destinationId?.toString() ?? '',
    basePrice: tour.basePrice?.toString() ?? '',
    currency: tour.currency ?? 'VND',
    durationDays: tour.durationDays?.toString() ?? '1',
    durationNights: tour.durationNights?.toString() ?? '0',
    transportType: tour.transportType ?? '',
    tripMode: tour.tripMode ?? 'group',
    shortDescription: tour.shortDescription ?? '',
    description: tour.description ?? '',
    highlights: tour.highlights ?? '',
    inclusions: tour.inclusions ?? '',
    exclusions: tour.exclusions ?? '',
    notes: tour.notes ?? '',
    isFeatured: Boolean(tour.isFeatured),
    status: tour.status ?? 'draft',
  }
}

function toScheduleForm(schedule: BackendTourSchedule): ScheduleFormState {
  return {
    id: schedule.id,
    tourId: schedule.tourId ?? null,
    scheduleCode: schedule.scheduleCode ?? '',
    departureAt: schedule.departureAt?.slice(0, 16) ?? '',
    returnAt: schedule.returnAt?.slice(0, 16) ?? '',
    bookingOpenAt: schedule.bookingOpenAt?.slice(0, 16) ?? '',
    bookingCloseAt: schedule.bookingCloseAt?.slice(0, 16) ?? '',
    meetingAt: schedule.meetingAt?.slice(0, 16) ?? '',
    meetingPointName: schedule.meetingPointName ?? '',
    meetingAddress: schedule.meetingAddress ?? '',
    capacityTotal: schedule.capacityTotal?.toString() ?? '20',
    minGuestsToOperate: schedule.minGuestsToOperate?.toString() ?? '1',
    adultPrice: schedule.adultPrice?.toString() ?? '',
    childPrice: schedule.childPrice?.toString() ?? '0',
    infantPrice: schedule.infantPrice?.toString() ?? '0',
    seniorPrice: schedule.seniorPrice?.toString() ?? '0',
    singleRoomSurcharge: schedule.singleRoomSurcharge?.toString() ?? '0',
    transportDetail: schedule.transportDetail ?? '',
    note: schedule.note ?? '',
    status: schedule.status ?? 'draft',
  }
}

function buildTourPayload(form: TourFormState) {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    slug: form.slug.trim(),
    destinationId: Number(form.destinationId),
    basePrice: toOptionalNumber(form.basePrice) ?? 0,
    currency: form.currency.trim() || 'VND',
    durationDays: Number(form.durationDays) || 1,
    durationNights: Number(form.durationNights) || 0,
    transportType: form.transportType.trim() || undefined,
    tripMode: form.tripMode.trim() || undefined,
    shortDescription: form.shortDescription.trim() || undefined,
    description: form.description.trim() || undefined,
    highlights: form.highlights.trim() || undefined,
    inclusions: form.inclusions.trim() || undefined,
    exclusions: form.exclusions.trim() || undefined,
    notes: form.notes.trim() || undefined,
    isFeatured: form.isFeatured,
    status: form.status,
  }
}

function buildSchedulePayload(form: ScheduleFormState) {
  return {
    scheduleCode: form.scheduleCode.trim() || undefined,
    departureAt: `${form.departureAt}:00`,
    returnAt: `${form.returnAt}:00`,
    bookingOpenAt: form.bookingOpenAt ? `${form.bookingOpenAt}:00` : undefined,
    bookingCloseAt: form.bookingCloseAt ? `${form.bookingCloseAt}:00` : undefined,
    meetingAt: form.meetingAt ? `${form.meetingAt}:00` : undefined,
    meetingPointName: form.meetingPointName.trim() || undefined,
    meetingAddress: form.meetingAddress.trim() || undefined,
    capacityTotal: Number(form.capacityTotal) || 1,
    minGuestsToOperate: Number(form.minGuestsToOperate) || 1,
    adultPrice: toOptionalNumber(form.adultPrice) ?? 0,
    childPrice: toOptionalNumber(form.childPrice) ?? 0,
    infantPrice: toOptionalNumber(form.infantPrice) ?? 0,
    seniorPrice: toOptionalNumber(form.seniorPrice) ?? 0,
    singleRoomSurcharge: toOptionalNumber(form.singleRoomSurcharge) ?? 0,
    transportDetail: form.transportDetail.trim() || undefined,
    note: form.note.trim() || undefined,
    status: form.status,
    pickupPoints: [],
    guideAssignments: [],
  }
}

function ManagementTourPage({ mode }: ManagementTourPageProps) {
  const { accessContext } = useOutletContext<ManagementOutletContext>()
  const pageConfig = getManagementNavItem(mode)
  const [query, setQuery] = useState<TourQueryState>({
    keyword: '',
    tripMode: '',
    featuredOnly: '',
    destinationId: '',
  })
  const [tours, setTours] = useState<BackendTour[]>([])
  const [selectedTour, setSelectedTour] = useState<BackendTour | null>(null)
  const [schedules, setSchedules] = useState<BackendTourSchedule[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<BackendTourSchedule | null>(null)
  const [tourForm, setTourForm] = useState<TourFormState>(() => createEmptyTourForm())
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormState>(() => createEmptyScheduleForm(null))
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [saving, setSaving] = useState(false)
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
  const canCreateTour = accessContext ? canUsePermission(accessContext, 'tour.create') : false
  const canUpdateTour = accessContext ? canUsePermission(accessContext, 'tour.update') : false
  const canDeleteTour = accessContext ? canUsePermission(accessContext, 'tour.delete') : false
  const canViewSchedule = accessContext ? canUsePermission(accessContext, 'schedule.view') : false
  const canCreateSchedule = accessContext ? canUsePermission(accessContext, 'schedule.create') : false
  const canUpdateSchedule = accessContext ? canUsePermission(accessContext, 'schedule.update') : false
  const canCloseSchedule = accessContext ? canUsePermission(accessContext, 'schedule.close') : false

  const updateQuery = (patch: Partial<TourQueryState>) => {
    setQuery((current) => ({ ...current, ...patch }))
  }

  const loadTours = async (nextPage = page) => {
    if (!hasPageAccess) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const tourPage = await tourApi.getAdminTours({
        page: nextPage,
        size: 12,
        keyword: query.keyword.trim() || undefined,
        tripMode: query.tripMode || undefined,
        featuredOnly: toBooleanFilter(query.featuredOnly),
        destinationId: query.destinationId ? Number(query.destinationId) : undefined,
        sortBy: 'createdAt',
        sortDir: 'desc',
      })

      const nextTours = tourPage.content ?? []
      setTours(nextTours)
      setPage(tourPage.page)
      setTotalPages(Math.max(tourPage.totalPages, 1))
      setTotalElements(tourPage.totalElements)

      if (nextTours.length > 0 && !selectedTour) {
        void selectTour(nextTours[0])
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải dữ liệu tour.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasPageAccess) {
      void loadTours(0)
    }
  }, [hasPageAccess])

  const selectTour = async (tour: BackendTour) => {
    setSelectedTour(tour)
    setTourForm(toTourForm(tour))
    setSelectedSchedule(null)
    setScheduleForm(createEmptyScheduleForm(tour.id))

    if (!canViewSchedule) {
      setSchedules([])
      return
    }

    setScheduleLoading(true)
    try {
      const nextSchedules = await tourApi.getAdminSchedules(tour.id)
      setSchedules(nextSchedules)
      if (nextSchedules.length > 0) {
        setSelectedSchedule(nextSchedules[0])
        setScheduleForm(toScheduleForm(nextSchedules[0]))
      } else {
        setScheduleForm(createEmptyScheduleForm(tour.id))
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải lịch khởi hành.')
    } finally {
      setScheduleLoading(false)
    }
  }

  const saveTour = async () => {
    if ((tourForm.id && !canUpdateTour) || (!tourForm.id && !canCreateTour)) {
      setMessage('Bạn chưa có quyền lưu tour.')
      return
    }

    setSaving(true)
    setMessage('')
    try {
      const payload = buildTourPayload(tourForm)
      const saved = tourForm.id
        ? await tourApi.updateAdminTour(tourForm.id, payload)
        : await tourApi.createAdminTour(payload)

      setTours((current) => {
        const exists = current.some((tour) => tour.id === saved.id)
        return exists
          ? current.map((tour) => (tour.id === saved.id ? saved : tour))
          : [saved, ...current]
      })
      setSelectedTour(saved)
      setTourForm(toTourForm(saved))
      if (!tourForm.id) {
        setTotalElements((current) => current + 1)
      }
      setMessage(tourForm.id ? 'Đã cập nhật tour.' : 'Đã tạo tour mới.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu tour.')
    } finally {
      setSaving(false)
    }
  }

  const deleteTour = async (tour: BackendTour) => {
    if (!canDeleteTour) {
      setMessage('Bạn chưa có quyền xóa tour.')
      return
    }

    setSaving(true)
    setMessage('')
    try {
      await tourApi.deleteAdminTour(tour.id)
      setTours((current) => current.filter((item) => item.id !== tour.id))
      if (selectedTour?.id === tour.id) {
        setSelectedTour(null)
        setSchedules([])
        setSelectedSchedule(null)
        setTourForm(createEmptyTourForm())
        setScheduleForm(createEmptyScheduleForm(null))
      }
      setTotalElements((current) => Math.max(current - 1, 0))
      setMessage('Đã xóa tour.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể xóa tour.')
    } finally {
      setSaving(false)
    }
  }

  const saveSchedule = async () => {
    const activeTourId = scheduleForm.tourId ?? selectedTour?.id ?? null
    if (!activeTourId) {
      setMessage('Vui lòng chọn tour trước khi lưu lịch khởi hành.')
      return
    }

    if ((scheduleForm.id && !canUpdateSchedule) || (!scheduleForm.id && !canCreateSchedule)) {
      setMessage('Bạn chưa có quyền lưu lịch khởi hành.')
      return
    }

    setSaving(true)
    setMessage('')
    try {
      const payload = buildSchedulePayload(scheduleForm)
      const saved = scheduleForm.id
        ? await tourApi.updateAdminSchedule(activeTourId, scheduleForm.id, payload)
        : await tourApi.createAdminSchedule(activeTourId, payload)

      setSchedules((current) => {
        const exists = current.some((schedule) => schedule.id === saved.id)
        return exists
          ? current.map((schedule) => (schedule.id === saved.id ? saved : schedule))
          : [saved, ...current]
      })
      setSelectedSchedule(saved)
      setScheduleForm(toScheduleForm(saved))
      setMessage(scheduleForm.id ? 'Đã cập nhật lịch khởi hành.' : 'Đã tạo lịch khởi hành mới.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu lịch khởi hành.')
    } finally {
      setSaving(false)
    }
  }

  const updateScheduleStatus = async (schedule: BackendTourSchedule, status: string) => {
    if (!selectedTour || !canCloseSchedule) {
      setMessage('Bạn chưa có quyền đổi trạng thái lịch khởi hành.')
      return
    }

    setSaving(true)
    setMessage('')
    try {
      const saved = await tourApi.updateAdminScheduleStatus(selectedTour.id, schedule.id, status)
      setSchedules((current) =>
        current.map((item) => (item.id === saved.id ? saved : item)),
      )
      setSelectedSchedule(saved)
      setScheduleForm(toScheduleForm(saved))
      setMessage('Đã cập nhật trạng thái lịch khởi hành.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái lịch.')
    } finally {
      setSaving(false)
    }
  }

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
          <h2>Bạn không có quyền truy cập khu vực này</h2>
          <p>Trang chỉ hiển thị với tài khoản có quyền tour hoặc schedule phù hợp.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="mgmt-page">
      <section className="mgmt-crud-shell">
        <header className="mgmt-crud-head">
          <div>
            <p className="mgmt-kicker">{mode === 'tours' ? 'TOUR' : 'LỊCH KHỞI HÀNH'}</p>
            <h2>
              {mode === 'tours'
                ? 'Quản lý tour và cấu hình bán'
                : 'Quản lý lịch khởi hành theo tour'}
            </h2>
            <p>
              Danh sách tour hiện lấy từ `GET /tours` do backend chưa có `GET /admin/tours`.
              Các thao tác tạo, sửa, xóa và quản lý lịch vẫn dùng admin endpoint.
            </p>
          </div>

          <div className="mgmt-crud-summary">
            <span>
              <TicketPercent aria-hidden="true" />
              {tours.length} tour trên trang
            </span>
            <span>
              <CalendarDays aria-hidden="true" />
              {schedules.length} lịch của tour đang chọn
            </span>
            <span>
              <Clock3 aria-hidden="true" />
              {totalElements} tổng tour
            </span>
          </div>
        </header>

        <div className="mgmt-tour-toolbar">
          <label className="mgmt-crud-search">
            <Search aria-hidden="true" />
            <input
              value={query.keyword}
              onChange={(event) => updateQuery({ keyword: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void loadTours(0)
                }
              }}
              placeholder="Tìm theo tên hoặc mã tour"
            />
          </label>
          <select value={query.tripMode} onChange={(event) => updateQuery({ tripMode: event.target.value })}>
            {tripModeOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select value={query.featuredOnly} onChange={(event) => updateQuery({ featuredOnly: event.target.value })}>
            {booleanFilterOptions.map((option) => (
              <option value={option.value} key={option.value}>
                Nổi bật: {option.label}
              </option>
            ))}
          </select>
          <input
            value={query.destinationId}
            onChange={(event) => updateQuery({ destinationId: event.target.value })}
            placeholder="Lọc theo destinationId"
            aria-label="Lọc theo destinationId"
          />
          <button type="button" onClick={() => void loadTours(0)} disabled={loading}>
            <RefreshCcw aria-hidden="true" />
            Tải lại
          </button>
          {canCreateTour && mode === 'tours' && (
            <button type="button" onClick={() => {
              setSelectedTour(null)
              setTourForm(createEmptyTourForm())
            }}>
              <Plus aria-hidden="true" />
              Tạo tour
            </button>
          )}
          {canCreateSchedule && mode === 'schedules' && (
            <button type="button" onClick={() => setScheduleForm(createEmptyScheduleForm(selectedTour?.id ?? null))}>
              <Plus aria-hidden="true" />
              Tạo lịch
            </button>
          )}
        </div>

        <div className="mgmt-tour-layout">
          <article className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>Danh sách tour</h3>
              <p>Trang {page + 1}/{totalPages}. Chọn một tour để xem hoặc quản lý lịch.</p>
            </div>

            {loading ? (
              <p className="mgmt-crud-empty">Đang tải tour...</p>
            ) : tours.length > 0 ? (
              <div className="mgmt-tour-list">
                {tours.map((tour) => (
                  <button
                    type="button"
                    key={tour.id}
                    className={selectedTour?.id === tour.id ? 'active' : ''}
                    onClick={() => void selectTour(tour)}
                  >
                    <div>
                      <strong>{tour.name}</strong>
                      <small>{tour.code || '-'} · {tour.transportType || tour.tripMode || '-'}</small>
                    </div>
                    <span>{formatMoney(tour.basePrice, tour.currency || 'VND')}</span>
                    <em>{labelFor(tourStatusOptions, tour.status)}</em>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mgmt-crud-empty">Không có tour phù hợp.</p>
            )}

            <div className="mgmt-crud-pagination">
              <button
                type="button"
                onClick={() => void loadTours(Math.max(page - 1, 0))}
                disabled={loading || page <= 0}
              >
                Trước
              </button>
              <span>{page + 1}/{totalPages}</span>
              <button
                type="button"
                onClick={() => void loadTours(Math.min(page + 1, totalPages - 1))}
                disabled={loading || page >= totalPages - 1}
              >
                Sau
              </button>
            </div>
          </article>

          <aside className="mgmt-crud-panel">
            {mode === 'tours' ? (
              <>
                <div className="mgmt-section-title">
                  <h3>{tourForm.id ? 'Cập nhật tour' : 'Tạo tour'}</h3>
                  <p>Form lõi cho bán tour. Itinerary, media và checklist sẽ tách ra giai đoạn sau.</p>
                </div>

                <div className="mgmt-tour-form">
                  <label><span>Mã tour</span><input value={tourForm.code} onChange={(event) => setTourForm((current) => ({ ...current, code: event.target.value }))} /></label>
                  <label><span>Tên tour</span><input value={tourForm.name} onChange={(event) => setTourForm((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label><span>Slug</span><input value={tourForm.slug} onChange={(event) => setTourForm((current) => ({ ...current, slug: event.target.value }))} /></label>
                  <label>
                    <span>Điểm đến</span>
                    <input value={tourForm.destinationId} onChange={(event) => setTourForm((current) => ({ ...current, destinationId: event.target.value }))} />
                  </label>
                  <label><span>Giá cơ bản</span><input value={tourForm.basePrice} onChange={(event) => setTourForm((current) => ({ ...current, basePrice: event.target.value }))} /></label>
                  <label><span>Tiền tệ</span><input value={tourForm.currency} onChange={(event) => setTourForm((current) => ({ ...current, currency: event.target.value }))} /></label>
                  <label><span>Số ngày</span><input value={tourForm.durationDays} onChange={(event) => setTourForm((current) => ({ ...current, durationDays: event.target.value }))} /></label>
                  <label><span>Số đêm</span><input value={tourForm.durationNights} onChange={(event) => setTourForm((current) => ({ ...current, durationNights: event.target.value }))} /></label>
                  <label><span>Phương tiện</span><input value={tourForm.transportType} onChange={(event) => setTourForm((current) => ({ ...current, transportType: event.target.value }))} /></label>
                  <label>
                    <span>Hình thức</span>
                    <select value={tourForm.tripMode} onChange={(event) => setTourForm((current) => ({ ...current, tripMode: event.target.value }))}>
                      {tripModeOptions.slice(1).map((option) => (
                        <option value={option.value} key={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="mgmt-tour-wide"><span>Mô tả ngắn</span><textarea value={tourForm.shortDescription} onChange={(event) => setTourForm((current) => ({ ...current, shortDescription: event.target.value }))} /></label>
                  <label className="mgmt-tour-wide"><span>Mô tả chi tiết</span><textarea value={tourForm.description} onChange={(event) => setTourForm((current) => ({ ...current, description: event.target.value }))} /></label>
                  <label className="mgmt-tour-wide"><span>Điểm nổi bật</span><textarea value={tourForm.highlights} onChange={(event) => setTourForm((current) => ({ ...current, highlights: event.target.value }))} /></label>
                  <label className="mgmt-tour-wide"><span>Bao gồm</span><textarea value={tourForm.inclusions} onChange={(event) => setTourForm((current) => ({ ...current, inclusions: event.target.value }))} /></label>
                  <label className="mgmt-tour-wide"><span>Không bao gồm</span><textarea value={tourForm.exclusions} onChange={(event) => setTourForm((current) => ({ ...current, exclusions: event.target.value }))} /></label>
                  <label className="mgmt-tour-wide"><span>Ghi chú</span><textarea value={tourForm.notes} onChange={(event) => setTourForm((current) => ({ ...current, notes: event.target.value }))} /></label>
                  <p className="mgmt-tour-note mgmt-tour-wide">
                    Backend hiện yêu cầu `destinationId` dạng số nhưng chưa có API admin trả danh sách ID điểm đến nội bộ.
                    Tạm thời nhập trực tiếp `destinationId` để tạo hoặc sửa tour.
                  </p>
                  <div className="mgmt-tour-checks mgmt-tour-wide">
                    <label><input type="checkbox" checked={tourForm.isFeatured} onChange={(event) => setTourForm((current) => ({ ...current, isFeatured: event.target.checked }))} />Nổi bật</label>
                    <label>
                      <span>Trạng thái</span>
                      <select value={tourForm.status} onChange={(event) => setTourForm((current) => ({ ...current, status: event.target.value }))}>
                        {tourStatusOptions.map((option) => (
                          <option value={option.value} key={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="mgmt-crud-actions mgmt-tour-wide">
                    <button type="button" onClick={() => void saveTour()} disabled={saving || (tourForm.id ? !canUpdateTour : !canCreateTour)}>
                      <Save aria-hidden="true" />
                      {saving ? 'Đang lưu...' : 'Lưu tour'}
                    </button>
                    {selectedTour && (
                      <button type="button" onClick={() => void deleteTour(selectedTour)} disabled={saving || !canDeleteTour}>
                        <Trash2 aria-hidden="true" />
                        Xóa tour
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mgmt-section-title">
                  <h3>Lịch khởi hành của tour</h3>
                  <p>Chọn tour bên trái để xem và cấu hình lịch khởi hành.</p>
                </div>

                {selectedTour && (
                  <div className="mgmt-tour-current">
                    <strong>{selectedTour.name}</strong>
                    <small>{selectedTour.code || '-'} · {formatMoney(selectedTour.basePrice, selectedTour.currency || 'VND')}</small>
                  </div>
                )}

                {scheduleLoading ? (
                  <p className="mgmt-crud-empty">Đang tải lịch khởi hành...</p>
                ) : (
                  <div className="mgmt-schedule-list">
                    {schedules.map((schedule) => (
                      <button
                        type="button"
                        key={schedule.id}
                        className={selectedSchedule?.id === schedule.id ? 'active' : ''}
                        onClick={() => {
                          setSelectedSchedule(schedule)
                          setScheduleForm(toScheduleForm(schedule))
                        }}
                      >
                        <div>
                          <strong>{schedule.scheduleCode || `Lịch #${schedule.id}`}</strong>
                          <small>{formatDate(schedule.departureAt)} → {formatDate(schedule.returnAt)}</small>
                        </div>
                        <span>{schedule.remainingSeats ?? 0}/{schedule.capacityTotal ?? 0}</span>
                        <em>{labelFor(scheduleStatusOptions, schedule.status)}</em>
                        <div className="mgmt-inline-actions">
                          <button type="button" onClick={(event) => {
                            event.stopPropagation()
                            setSelectedSchedule(schedule)
                            setScheduleForm(toScheduleForm(schedule))
                          }}>
                            <Eye aria-hidden="true" />
                            Xem
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              void updateScheduleStatus(schedule, schedule.status?.toLowerCase() === 'open' ? 'closed' : 'open')
                            }}
                            disabled={saving || !canCloseSchedule}
                          >
                            <CheckCircle2 aria-hidden="true" />
                            Đổi trạng thái
                          </button>
                        </div>
                      </button>
                    ))}
                    {selectedTour && schedules.length === 0 && (
                      <p className="mgmt-crud-empty">Tour này chưa có lịch khởi hành.</p>
                    )}
                  </div>
                )}

                <div className="mgmt-tour-form">
                  <label><span>Mã lịch</span><input value={scheduleForm.scheduleCode} onChange={(event) => setScheduleForm((current) => ({ ...current, scheduleCode: event.target.value }))} /></label>
                  <label><span>Khởi hành</span><input type="datetime-local" value={scheduleForm.departureAt} onChange={(event) => setScheduleForm((current) => ({ ...current, departureAt: event.target.value }))} /></label>
                  <label><span>Kết thúc</span><input type="datetime-local" value={scheduleForm.returnAt} onChange={(event) => setScheduleForm((current) => ({ ...current, returnAt: event.target.value }))} /></label>
                  <label><span>Mở bán</span><input type="datetime-local" value={scheduleForm.bookingOpenAt} onChange={(event) => setScheduleForm((current) => ({ ...current, bookingOpenAt: event.target.value }))} /></label>
                  <label><span>Đóng bán</span><input type="datetime-local" value={scheduleForm.bookingCloseAt} onChange={(event) => setScheduleForm((current) => ({ ...current, bookingCloseAt: event.target.value }))} /></label>
                  <label><span>Giờ tập trung</span><input type="datetime-local" value={scheduleForm.meetingAt} onChange={(event) => setScheduleForm((current) => ({ ...current, meetingAt: event.target.value }))} /></label>
                  <label><span>Điểm tập trung</span><input value={scheduleForm.meetingPointName} onChange={(event) => setScheduleForm((current) => ({ ...current, meetingPointName: event.target.value }))} /></label>
                  <label><span>Địa chỉ tập trung</span><input value={scheduleForm.meetingAddress} onChange={(event) => setScheduleForm((current) => ({ ...current, meetingAddress: event.target.value }))} /></label>
                  <label><span>Sức chứa</span><input value={scheduleForm.capacityTotal} onChange={(event) => setScheduleForm((current) => ({ ...current, capacityTotal: event.target.value }))} /></label>
                  <label><span>Khách tối thiểu</span><input value={scheduleForm.minGuestsToOperate} onChange={(event) => setScheduleForm((current) => ({ ...current, minGuestsToOperate: event.target.value }))} /></label>
                  <label><span>Giá người lớn</span><input value={scheduleForm.adultPrice} onChange={(event) => setScheduleForm((current) => ({ ...current, adultPrice: event.target.value }))} /></label>
                  <label><span>Giá trẻ em</span><input value={scheduleForm.childPrice} onChange={(event) => setScheduleForm((current) => ({ ...current, childPrice: event.target.value }))} /></label>
                  <label><span>Giá em bé</span><input value={scheduleForm.infantPrice} onChange={(event) => setScheduleForm((current) => ({ ...current, infantPrice: event.target.value }))} /></label>
                  <label><span>Giá người cao tuổi</span><input value={scheduleForm.seniorPrice} onChange={(event) => setScheduleForm((current) => ({ ...current, seniorPrice: event.target.value }))} /></label>
                  <label><span>Phụ thu phòng đơn</span><input value={scheduleForm.singleRoomSurcharge} onChange={(event) => setScheduleForm((current) => ({ ...current, singleRoomSurcharge: event.target.value }))} /></label>
                  <label><span>Trạng thái</span><select value={scheduleForm.status} onChange={(event) => setScheduleForm((current) => ({ ...current, status: event.target.value }))}>{scheduleStatusOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
                  <label className="mgmt-tour-wide"><span>Chi tiết phương tiện</span><textarea value={scheduleForm.transportDetail} onChange={(event) => setScheduleForm((current) => ({ ...current, transportDetail: event.target.value }))} /></label>
                  <label className="mgmt-tour-wide"><span>Ghi chú</span><textarea value={scheduleForm.note} onChange={(event) => setScheduleForm((current) => ({ ...current, note: event.target.value }))} /></label>
                  <div className="mgmt-crud-actions mgmt-tour-wide">
                    <button type="button" onClick={() => void saveSchedule()} disabled={saving || (scheduleForm.id ? !canUpdateSchedule : !canCreateSchedule)}>
                      <Save aria-hidden="true" />
                      {saving ? 'Đang lưu...' : 'Lưu lịch'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>

        {message && <p className="mgmt-crud-message">{message}</p>}
      </section>
    </div>
  )
}

export default ManagementTourPage
