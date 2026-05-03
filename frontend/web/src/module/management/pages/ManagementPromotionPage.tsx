import { useEffect, useMemo, useState } from 'react'
import {
  BadgePercent,
  Plus,
  RefreshCcw,
  Save,
  Search,
  TicketPercent,
} from 'lucide-react'
import { Navigate, useOutletContext } from 'react-router-dom'
import {
  promotionApi,
  type PromotionCampaign,
  type PromotionCampaignPayload,
  type Voucher,
  type VoucherApplicableScope,
  type VoucherDiscountType,
  type VoucherPayload,
} from '../../../api/server/Promotion.api'
import type { UserAccessContext } from '../../auth/api/authApi'
import {
  canAccessManagementItem,
  getManagementNavItem,
} from '../config/managementNavigation'

type ManagementOutletContext = {
  accessContext: UserAccessContext | null
}

type PromotionTab = 'campaigns' | 'vouchers'

type PromotionQueryState = {
  keyword: string
  isActive: string
  campaignId: string
}

type CampaignFormState = {
  id: number | null
  code: string
  name: string
  description: string
  startAt: string
  endAt: string
  targetMemberLevel: string
  conditionsJson: string
  rewardJson: string
  isActive: boolean
}

type VoucherFormState = {
  id: number | null
  code: string
  campaignId: string
  name: string
  description: string
  discountType: VoucherDiscountType
  discountValue: string
  maxDiscountAmount: string
  minOrderValue: string
  usageLimitTotal: string
  usageLimitPerUser: string
  applicableScope: VoucherApplicableScope
  applicableTourId: string
  applicableDestinationId: string
  applicableMemberLevel: string
  startAt: string
  endAt: string
  isStackable: boolean
  isActive: boolean
}

const activeFilterOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'true', label: 'Đang bật' },
  { value: 'false', label: 'Đang tắt' },
]

const discountTypeOptions: Array<{ value: VoucherDiscountType; label: string }> = [
  { value: 'percentage', label: 'Phần trăm' },
  { value: 'fixed_amount', label: 'Số tiền cố định' },
  { value: 'gift', label: 'Quà tặng' },
  { value: 'cashback', label: 'Hoàn tiền' },
]

const scopeOptions: Array<{ value: VoucherApplicableScope; label: string }> = [
  { value: 'all', label: 'Toàn hệ thống' },
  { value: 'tour', label: 'Theo tour' },
  { value: 'destination', label: 'Theo điểm đến' },
]

function createEmptyCampaignForm(): CampaignFormState {
  return {
    id: null,
    code: '',
    name: '',
    description: '',
    startAt: '',
    endAt: '',
    targetMemberLevel: '',
    conditionsJson: '',
    rewardJson: '',
    isActive: true,
  }
}

function createEmptyVoucherForm(): VoucherFormState {
  return {
    id: null,
    code: '',
    campaignId: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderValue: '',
    usageLimitTotal: '',
    usageLimitPerUser: '',
    applicableScope: 'all',
    applicableTourId: '',
    applicableDestinationId: '',
    applicableMemberLevel: '',
    startAt: '',
    endAt: '',
    isStackable: false,
    isActive: true,
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

  const numeric = Number(trimmed)
  return Number.isFinite(numeric) ? numeric : undefined
}

function toDateTimeField(value: string | undefined) {
  return value?.slice(0, 16) ?? ''
}

function parseJsonField(value: string, fieldName: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    throw new Error(`${fieldName} phải là JSON hợp lệ.`)
  }
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

function formatMoney(value: number | string | undefined) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) {
    return '-'
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

function statusLabel(isActive: boolean | undefined) {
  return isActive === false ? 'Đang tắt' : 'Đang bật'
}

function updateCollection<T extends { id: number }>(items: T[], updated: T) {
  return items.some((item) => item.id === updated.id)
    ? items.map((item) => (item.id === updated.id ? updated : item))
    : [updated, ...items]
}

function toCampaignForm(item: PromotionCampaign): CampaignFormState {
  return {
    id: item.id,
    code: item.code ?? '',
    name: item.name ?? '',
    description: item.description ?? '',
    startAt: toDateTimeField(item.startAt),
    endAt: toDateTimeField(item.endAt),
    targetMemberLevel: item.targetMemberLevel ?? '',
    conditionsJson: item.conditionsJson ? JSON.stringify(item.conditionsJson, null, 2) : '',
    rewardJson: item.rewardJson ? JSON.stringify(item.rewardJson, null, 2) : '',
    isActive: item.isActive !== false,
  }
}

function toVoucherForm(item: Voucher): VoucherFormState {
  return {
    id: item.id,
    code: item.code ?? '',
    campaignId: item.campaignId?.toString() ?? '',
    name: item.name ?? '',
    description: item.description ?? '',
    discountType: item.discountType ?? 'percentage',
    discountValue: item.discountValue?.toString() ?? '',
    maxDiscountAmount: item.maxDiscountAmount?.toString() ?? '',
    minOrderValue: item.minOrderValue?.toString() ?? '',
    usageLimitTotal: item.usageLimitTotal?.toString() ?? '',
    usageLimitPerUser: item.usageLimitPerUser?.toString() ?? '',
    applicableScope: item.applicableScope ?? 'all',
    applicableTourId: item.applicableTourId?.toString() ?? '',
    applicableDestinationId: item.applicableDestinationId?.toString() ?? '',
    applicableMemberLevel: item.applicableMemberLevel ?? '',
    startAt: toDateTimeField(item.startAt),
    endAt: toDateTimeField(item.endAt),
    isStackable: Boolean(item.isStackable),
    isActive: item.isActive !== false,
  }
}

function buildCampaignPayload(form: CampaignFormState): PromotionCampaignPayload {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    startAt: `${form.startAt}:00`,
    endAt: `${form.endAt}:00`,
    targetMemberLevel: form.targetMemberLevel.trim() || undefined,
    conditionsJson: parseJsonField(form.conditionsJson, 'Điều kiện áp dụng'),
    rewardJson: parseJsonField(form.rewardJson, 'Cấu hình ưu đãi'),
    isActive: form.isActive,
  }
}

function buildVoucherPayload(form: VoucherFormState): VoucherPayload {
  return {
    code: form.code.trim(),
    campaignId: toOptionalNumber(form.campaignId),
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    discountType: form.discountType,
    discountValue: toOptionalNumber(form.discountValue) ?? 0,
    maxDiscountAmount: toOptionalNumber(form.maxDiscountAmount),
    minOrderValue: toOptionalNumber(form.minOrderValue) ?? 0,
    usageLimitTotal: toOptionalNumber(form.usageLimitTotal),
    usageLimitPerUser: toOptionalNumber(form.usageLimitPerUser),
    applicableScope: form.applicableScope,
    applicableTourId: toOptionalNumber(form.applicableTourId),
    applicableDestinationId: toOptionalNumber(form.applicableDestinationId),
    applicableMemberLevel: form.applicableMemberLevel.trim() || undefined,
    startAt: `${form.startAt}:00`,
    endAt: `${form.endAt}:00`,
    isStackable: form.isStackable,
    isActive: form.isActive,
  }
}

function ManagementPromotionPage() {
  const { accessContext } = useOutletContext<ManagementOutletContext>()
  const pageConfig = getManagementNavItem('promotions')
  const [activeTab, setActiveTab] = useState<PromotionTab>('campaigns')
  const [query, setQuery] = useState<PromotionQueryState>({
    keyword: '',
    isActive: '',
    campaignId: '',
  })
  const [campaigns, setCampaigns] = useState<PromotionCampaign[]>([])
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<PromotionCampaign | null>(null)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [campaignForm, setCampaignForm] = useState<CampaignFormState>(() => createEmptyCampaignForm())
  const [voucherForm, setVoucherForm] = useState<VoucherFormState>(() => createEmptyVoucherForm())
  const [campaignPage, setCampaignPage] = useState(0)
  const [voucherPage, setVoucherPage] = useState(0)
  const [campaignTotalPages, setCampaignTotalPages] = useState(1)
  const [voucherTotalPages, setVoucherTotalPages] = useState(1)
  const [campaignTotalElements, setCampaignTotalElements] = useState(0)
  const [voucherTotalElements, setVoucherTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
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
  const canCreate = accessContext ? canUsePermission(accessContext, 'voucher.create') : false
  const canUpdate = accessContext ? canUsePermission(accessContext, 'voucher.update') : false

  const summary = useMemo(
    () => ({
      campaigns: campaignTotalElements,
      vouchers: voucherTotalElements,
      activeCampaigns: campaigns.filter((item) => item.isActive !== false).length,
      activeVouchers: vouchers.filter((item) => item.isActive !== false).length,
    }),
    [campaignTotalElements, voucherTotalElements, campaigns, vouchers],
  )

  const loadCampaigns = async (nextPage = campaignPage) => {
    const response = await promotionApi.getCampaigns({
      page: nextPage,
      size: 12,
      keyword: query.keyword.trim() || undefined,
      isActive: toBooleanFilter(query.isActive),
      sortBy: 'createdAt',
      sortDir: 'desc',
    })
    setCampaigns(response.content ?? [])
    setCampaignPage(response.page)
    setCampaignTotalPages(Math.max(response.totalPages, 1))
    setCampaignTotalElements(response.totalElements)
    return response.content ?? []
  }

  const loadVouchers = async (nextPage = voucherPage) => {
    const response = await promotionApi.getVouchers({
      page: nextPage,
      size: 12,
      keyword: query.keyword.trim() || undefined,
      isActive: toBooleanFilter(query.isActive),
      campaignId: toOptionalNumber(query.campaignId),
      sortBy: 'createdAt',
      sortDir: 'desc',
    })
    setVouchers(response.content ?? [])
    setVoucherPage(response.page)
    setVoucherTotalPages(Math.max(response.totalPages, 1))
    setVoucherTotalElements(response.totalElements)
    return response.content ?? []
  }

  const loadAll = async () => {
    if (!hasPageAccess) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const [nextCampaigns, nextVouchers] = await Promise.all([
        loadCampaigns(0),
        loadVouchers(0),
      ])

      if (!selectedCampaign && nextCampaigns[0]) {
        setSelectedCampaign(nextCampaigns[0])
        setCampaignForm(toCampaignForm(nextCampaigns[0]))
      }
      if (!selectedVoucher && nextVouchers[0]) {
        setSelectedVoucher(nextVouchers[0])
        setVoucherForm(toVoucherForm(nextVouchers[0]))
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải dữ liệu khuyến mãi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasPageAccess) {
      void loadAll()
    }
  }, [hasPageAccess])

  const selectCampaign = async (item: PromotionCampaign) => {
    setDetailLoading(true)
    setMessage('')
    try {
      const detail = await promotionApi.getCampaign(item.id)
      setSelectedCampaign(detail)
      setCampaignForm(toCampaignForm(detail))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải chi tiết campaign.')
    } finally {
      setDetailLoading(false)
    }
  }

  const selectVoucher = async (item: Voucher) => {
    setDetailLoading(true)
    setMessage('')
    try {
      const detail = await promotionApi.getVoucher(item.id)
      setSelectedVoucher(detail)
      setVoucherForm(toVoucherForm(detail))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải chi tiết voucher.')
    } finally {
      setDetailLoading(false)
    }
  }

  const saveCampaign = async () => {
    if (!(campaignForm.id ? canUpdate : canCreate)) {
      return
    }

    setSaving(true)
    setMessage('')
    try {
      const payload = buildCampaignPayload(campaignForm)
      const saved = campaignForm.id
        ? await promotionApi.updateCampaign(campaignForm.id, payload)
        : await promotionApi.createCampaign(payload)
      setCampaigns((current) => updateCollection(current, saved))
      setSelectedCampaign(saved)
      setCampaignForm(toCampaignForm(saved))
      setMessage(campaignForm.id ? 'Đã cập nhật campaign.' : 'Đã tạo campaign mới.')
      await loadCampaigns(campaignPage)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu campaign.')
    } finally {
      setSaving(false)
    }
  }

  const saveVoucher = async () => {
    if (!(voucherForm.id ? canUpdate : canCreate)) {
      return
    }

    setSaving(true)
    setMessage('')
    try {
      const payload = buildVoucherPayload(voucherForm)
      const saved = voucherForm.id
        ? await promotionApi.updateVoucher(voucherForm.id, payload)
        : await promotionApi.createVoucher(payload)
      setVouchers((current) => updateCollection(current, saved))
      setSelectedVoucher(saved)
      setVoucherForm(toVoucherForm(saved))
      setMessage(voucherForm.id ? 'Đã cập nhật voucher.' : 'Đã tạo voucher mới.')
      await loadVouchers(voucherPage)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu voucher.')
    } finally {
      setSaving(false)
    }
  }

  const toggleCampaignStatus = async (item: PromotionCampaign) => {
    if (!canUpdate) {
      return
    }

    setSaving(true)
    setMessage('')
    try {
      const updated = await promotionApi.updateCampaignStatus(item.id, {
        isActive: item.isActive === false,
      })
      setCampaigns((current) => updateCollection(current, updated))
      if (selectedCampaign?.id === updated.id) {
        setSelectedCampaign(updated)
        setCampaignForm(toCampaignForm(updated))
      }
      setMessage('Đã cập nhật trạng thái campaign.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái campaign.')
    } finally {
      setSaving(false)
    }
  }

  const toggleVoucherStatus = async (item: Voucher) => {
    if (!canUpdate) {
      return
    }

    setSaving(true)
    setMessage('')
    try {
      const updated = await promotionApi.updateVoucherStatus(item.id, {
        isActive: item.isActive === false,
      })
      setVouchers((current) => updateCollection(current, updated))
      if (selectedVoucher?.id === updated.id) {
        setSelectedVoucher(updated)
        setVoucherForm(toVoucherForm(updated))
      }
      setMessage('Đã cập nhật trạng thái voucher.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái voucher.')
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
          <h2>Bạn không có quyền truy cập khu khuyến mãi</h2>
          <p>Chỉ tài khoản có quyền voucher.view mới được dùng trang này.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="mgmt-page">
      <section className="mgmt-crud-shell">
        <header className="mgmt-crud-head">
          <div>
            <p className="mgmt-kicker">KHUYẾN MÃI</p>
            <h2>Điều phối campaign và voucher bán hàng</h2>
            <p>
              Quản lý hai lớp dữ liệu khuyến mãi: campaign để điều phối chương trình,
              voucher để áp mã theo phạm vi, hạn mức và thời gian hiệu lực.
            </p>
          </div>

          <div className="mgmt-crud-summary">
            <span>
              <BadgePercent aria-hidden="true" />
              {summary.campaigns} campaign
            </span>
            <span>
              <TicketPercent aria-hidden="true" />
              {summary.vouchers} voucher
            </span>
            <span>
              <BadgePercent aria-hidden="true" />
              {summary.activeCampaigns} campaign bật
            </span>
            <span>
              <TicketPercent aria-hidden="true" />
              {summary.activeVouchers} voucher bật
            </span>
          </div>
        </header>

        <div className="mgmt-promo-toolbar mgmt-promo-admin-toolbar">
          <div className="mgmt-promo-tabs" role="tablist" aria-label="Promotion modules">
            <button
              type="button"
              className={activeTab === 'campaigns' ? 'is-active' : ''}
              onClick={() => setActiveTab('campaigns')}
            >
              Campaign
            </button>
            <button
              type="button"
              className={activeTab === 'vouchers' ? 'is-active' : ''}
              onClick={() => setActiveTab('vouchers')}
            >
              Voucher
            </button>
          </div>

          <label className="mgmt-crud-search">
            <Search aria-hidden="true" />
            <input
              value={query.keyword}
              onChange={(event) => setQuery((current) => ({ ...current, keyword: event.target.value }))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void loadAll()
                }
              }}
              placeholder="Tìm theo mã hoặc tên"
            />
          </label>

          <label className="mgmt-promo-inline-filter">
            <span>Trạng thái</span>
            <select
              value={query.isActive}
              onChange={(event) => setQuery((current) => ({ ...current, isActive: event.target.value }))}
            >
              {activeFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {activeTab === 'vouchers' && (
            <label className="mgmt-promo-inline-filter">
              <span>Campaign ID</span>
              <input
                value={query.campaignId}
                onChange={(event) =>
                  setQuery((current) => ({ ...current, campaignId: event.target.value }))
                }
                placeholder="Lọc voucher theo campaign"
              />
            </label>
          )}

          <button type="button" onClick={() => void loadAll()} disabled={loading}>
            <RefreshCcw aria-hidden="true" />
            Tải lại
          </button>
          {canCreate && activeTab === 'campaigns' && (
            <button
              type="button"
              onClick={() => {
                setSelectedCampaign(null)
                setCampaignForm(createEmptyCampaignForm())
              }}
            >
              <Plus aria-hidden="true" />
              Tạo campaign
            </button>
          )}
          {canCreate && activeTab === 'vouchers' && (
            <button
              type="button"
              onClick={() => {
                setSelectedVoucher(null)
                setVoucherForm(createEmptyVoucherForm())
              }}
            >
              <Plus aria-hidden="true" />
              Tạo voucher
            </button>
          )}
        </div>

        <div className="mgmt-promo-admin-layout">
          <article className="mgmt-crud-panel">
            <div className="mgmt-section-title">
              <h3>{activeTab === 'campaigns' ? 'Danh sách campaign' : 'Danh sách voucher'}</h3>
              <p>
                {activeTab === 'campaigns'
                  ? `Trang ${campaignPage + 1}/${campaignTotalPages}.`
                  : `Trang ${voucherPage + 1}/${voucherTotalPages}.`}
              </p>
            </div>

            {loading ? (
              <p className="mgmt-crud-empty">Đang tải dữ liệu khuyến mãi...</p>
            ) : activeTab === 'campaigns' ? (
              campaigns.length > 0 ? (
                <div className="mgmt-promo-admin-list">
                  {campaigns.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={selectedCampaign?.id === item.id ? 'active' : ''}
                      onClick={() => void selectCampaign(item)}
                    >
                      <div>
                        <strong>{item.name || item.code}</strong>
                        <small>{item.code || '-'}</small>
                      </div>
                      <span>{item.targetMemberLevel || 'ALL'}</span>
                      <em>{statusLabel(item.isActive)}</em>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mgmt-crud-empty">Không có campaign phù hợp.</p>
              )
            ) : vouchers.length > 0 ? (
              <div className="mgmt-promo-admin-list">
                {vouchers.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={selectedVoucher?.id === item.id ? 'active' : ''}
                    onClick={() => void selectVoucher(item)}
                  >
                    <div>
                      <strong>{item.name || item.code}</strong>
                      <small>{item.code || '-'} · Campaign {item.campaignId ?? '-'}</small>
                    </div>
                    <span>{item.discountType || '-'}</span>
                    <em>{statusLabel(item.isActive)}</em>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mgmt-crud-empty">Không có voucher phù hợp.</p>
            )}

            <div className="mgmt-crud-pagination">
              <button
                type="button"
                onClick={() =>
                  void (activeTab === 'campaigns'
                    ? loadCampaigns(Math.max(campaignPage - 1, 0))
                    : loadVouchers(Math.max(voucherPage - 1, 0)))
                }
                disabled={loading || (activeTab === 'campaigns' ? campaignPage <= 0 : voucherPage <= 0)}
              >
                Trước
              </button>
              <span>
                {activeTab === 'campaigns'
                  ? `${campaignPage + 1}/${campaignTotalPages}`
                  : `${voucherPage + 1}/${voucherTotalPages}`}
              </span>
              <button
                type="button"
                onClick={() =>
                  void (activeTab === 'campaigns'
                    ? loadCampaigns(Math.min(campaignPage + 1, campaignTotalPages - 1))
                    : loadVouchers(Math.min(voucherPage + 1, voucherTotalPages - 1)))
                }
                disabled={
                  loading ||
                  (activeTab === 'campaigns'
                    ? campaignPage >= campaignTotalPages - 1
                    : voucherPage >= voucherTotalPages - 1)
                }
              >
                Sau
              </button>
            </div>
          </article>

          <aside className="mgmt-crud-panel">
            {detailLoading ? (
              <p className="mgmt-crud-empty">Đang tải chi tiết khuyến mãi...</p>
            ) : activeTab === 'campaigns' ? (
              <>
                <div className="mgmt-section-title">
                  <h3>{campaignForm.id ? 'Cập nhật campaign' : 'Tạo campaign'}</h3>
                  <p>Quản lý khung thời gian, đối tượng áp dụng và JSON điều kiện/ưu đãi.</p>
                </div>

                <div className="mgmt-promo-admin-form">
                  <label><span>Mã campaign</span><input value={campaignForm.code} onChange={(event) => setCampaignForm((current) => ({ ...current, code: event.target.value }))} /></label>
                  <label><span>Tên campaign</span><input value={campaignForm.name} onChange={(event) => setCampaignForm((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label><span>Bắt đầu</span><input type="datetime-local" value={campaignForm.startAt} onChange={(event) => setCampaignForm((current) => ({ ...current, startAt: event.target.value }))} /></label>
                  <label><span>Kết thúc</span><input type="datetime-local" value={campaignForm.endAt} onChange={(event) => setCampaignForm((current) => ({ ...current, endAt: event.target.value }))} /></label>
                  <label><span>Hạng thành viên</span><input value={campaignForm.targetMemberLevel} onChange={(event) => setCampaignForm((current) => ({ ...current, targetMemberLevel: event.target.value }))} placeholder="bronze, silver..." /></label>
                  <label className="mgmt-promo-admin-wide"><span>Mô tả</span><textarea value={campaignForm.description} onChange={(event) => setCampaignForm((current) => ({ ...current, description: event.target.value }))} /></label>
                  <label className="mgmt-promo-admin-wide"><span>Điều kiện áp dụng (JSON)</span><textarea value={campaignForm.conditionsJson} onChange={(event) => setCampaignForm((current) => ({ ...current, conditionsJson: event.target.value }))} placeholder='{"minBookings": 3}' /></label>
                  <label className="mgmt-promo-admin-wide"><span>Cấu hình ưu đãi (JSON)</span><textarea value={campaignForm.rewardJson} onChange={(event) => setCampaignForm((current) => ({ ...current, rewardJson: event.target.value }))} placeholder='{"type": "discount", "value": 10}' /></label>
                  <label className="mgmt-promo-admin-toggle mgmt-promo-admin-wide">
                    <input type="checkbox" checked={campaignForm.isActive} onChange={(event) => setCampaignForm((current) => ({ ...current, isActive: event.target.checked }))} />
                    <span>Đang bật</span>
                  </label>
                  <div className="mgmt-crud-actions mgmt-promo-admin-wide">
                    <button type="button" onClick={() => void saveCampaign()} disabled={saving || (campaignForm.id ? !canUpdate : !canCreate)}>
                      <Save aria-hidden="true" />
                      {saving ? 'Đang lưu...' : 'Lưu campaign'}
                    </button>
                    {selectedCampaign && (
                      <button type="button" onClick={() => void toggleCampaignStatus(selectedCampaign)} disabled={saving || !canUpdate}>
                        <BadgePercent aria-hidden="true" />
                        {selectedCampaign.isActive === false ? 'Bật campaign' : 'Tắt campaign'}
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mgmt-section-title">
                  <h3>{voucherForm.id ? 'Cập nhật voucher' : 'Tạo voucher'}</h3>
                  <p>Thiết lập giá trị giảm, phạm vi áp dụng, hạn mức dùng và khoảng hiệu lực.</p>
                </div>

                <div className="mgmt-promo-admin-form">
                  <label><span>Mã voucher</span><input value={voucherForm.code} onChange={(event) => setVoucherForm((current) => ({ ...current, code: event.target.value }))} /></label>
                  <label><span>Tên voucher</span><input value={voucherForm.name} onChange={(event) => setVoucherForm((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label><span>Campaign ID</span><input value={voucherForm.campaignId} onChange={(event) => setVoucherForm((current) => ({ ...current, campaignId: event.target.value }))} /></label>
                  <label>
                    <span>Loại giảm</span>
                    <select value={voucherForm.discountType} onChange={(event) => setVoucherForm((current) => ({ ...current, discountType: event.target.value as VoucherDiscountType }))}>
                      {discountTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label><span>Giá trị giảm</span><input value={voucherForm.discountValue} onChange={(event) => setVoucherForm((current) => ({ ...current, discountValue: event.target.value }))} /></label>
                  <label><span>Giảm tối đa</span><input value={voucherForm.maxDiscountAmount} onChange={(event) => setVoucherForm((current) => ({ ...current, maxDiscountAmount: event.target.value }))} /></label>
                  <label><span>Đơn tối thiểu</span><input value={voucherForm.minOrderValue} onChange={(event) => setVoucherForm((current) => ({ ...current, minOrderValue: event.target.value }))} /></label>
                  <label><span>Giới hạn tổng</span><input value={voucherForm.usageLimitTotal} onChange={(event) => setVoucherForm((current) => ({ ...current, usageLimitTotal: event.target.value }))} /></label>
                  <label><span>Giới hạn mỗi user</span><input value={voucherForm.usageLimitPerUser} onChange={(event) => setVoucherForm((current) => ({ ...current, usageLimitPerUser: event.target.value }))} /></label>
                  <label>
                    <span>Phạm vi áp dụng</span>
                    <select value={voucherForm.applicableScope} onChange={(event) => setVoucherForm((current) => ({ ...current, applicableScope: event.target.value as VoucherApplicableScope }))}>
                      {scopeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label><span>Tour ID</span><input value={voucherForm.applicableTourId} onChange={(event) => setVoucherForm((current) => ({ ...current, applicableTourId: event.target.value }))} /></label>
                  <label><span>Destination ID</span><input value={voucherForm.applicableDestinationId} onChange={(event) => setVoucherForm((current) => ({ ...current, applicableDestinationId: event.target.value }))} /></label>
                  <label><span>Hạng thành viên</span><input value={voucherForm.applicableMemberLevel} onChange={(event) => setVoucherForm((current) => ({ ...current, applicableMemberLevel: event.target.value }))} /></label>
                  <label><span>Bắt đầu</span><input type="datetime-local" value={voucherForm.startAt} onChange={(event) => setVoucherForm((current) => ({ ...current, startAt: event.target.value }))} /></label>
                  <label><span>Kết thúc</span><input type="datetime-local" value={voucherForm.endAt} onChange={(event) => setVoucherForm((current) => ({ ...current, endAt: event.target.value }))} /></label>
                  <label className="mgmt-promo-admin-wide"><span>Mô tả</span><textarea value={voucherForm.description} onChange={(event) => setVoucherForm((current) => ({ ...current, description: event.target.value }))} /></label>
                  <div className="mgmt-promo-admin-flags mgmt-promo-admin-wide">
                    <label className="mgmt-promo-admin-toggle">
                      <input type="checkbox" checked={voucherForm.isStackable} onChange={(event) => setVoucherForm((current) => ({ ...current, isStackable: event.target.checked }))} />
                      <span>Cho phép stack</span>
                    </label>
                    <label className="mgmt-promo-admin-toggle">
                      <input type="checkbox" checked={voucherForm.isActive} onChange={(event) => setVoucherForm((current) => ({ ...current, isActive: event.target.checked }))} />
                      <span>Đang bật</span>
                    </label>
                  </div>
                  <div className="mgmt-crud-actions mgmt-promo-admin-wide">
                    <button type="button" onClick={() => void saveVoucher()} disabled={saving || (voucherForm.id ? !canUpdate : !canCreate)}>
                      <Save aria-hidden="true" />
                      {saving ? 'Đang lưu...' : 'Lưu voucher'}
                    </button>
                    {selectedVoucher && (
                      <button type="button" onClick={() => void toggleVoucherStatus(selectedVoucher)} disabled={saving || !canUpdate}>
                        <TicketPercent aria-hidden="true" />
                        {selectedVoucher.isActive === false ? 'Bật voucher' : 'Tắt voucher'}
                      </button>
                    )}
                  </div>
                </div>

                {selectedVoucher && (
                  <div className="mgmt-tour-current">
                    <strong>{selectedVoucher.code || selectedVoucher.name}</strong>
                    <small>
                      {formatMoney(selectedVoucher.discountValue)} · hết hạn {formatDate(selectedVoucher.endAt)}
                    </small>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>

        {message && <p className="mgmt-crud-message">{message}</p>}
      </section>
    </div>
  )
}

export default ManagementPromotionPage
