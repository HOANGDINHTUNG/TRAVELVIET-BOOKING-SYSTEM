import { useEffect, useMemo, useState } from 'react'
import {
  BadgePercent,
  Plus,
  RefreshCcw,
  Search,
  TicketPercent,
} from 'lucide-react'
import { Navigate, useOutletContext } from 'react-router-dom'
import {
  promotionApi,
  type PromotionCampaign,
  type Voucher,
} from '../../../api/server/Promotion.api'
import type { UserAccessContext } from '../../auth/api/authApi'
import {
  canAccessManagementItem,
  getManagementNavItem,
} from '../config/managementNavigation'
import CampaignManagementPane from './promotion/CampaignManagementPane'
import VoucherManagementPane from './promotion/VoucherManagementPane'
import { showError, showSuccess } from '../../../lib/toast'
import {
  activeFilterOptions,
  buildCampaignPayload,
  buildVoucherPayload,
  createEmptyCampaignForm,
  createEmptyVoucherForm,
  resolvePromotionPermissions,
  toBooleanFilter,
  toCampaignForm,
  toOptionalNumber,
  toVoucherForm,
  updateCollection,
  type CampaignFormState,
  type PromotionQueryState,
  type PromotionTab,
  type VoucherFormState,
} from './promotion/promotionShared'

type ManagementOutletContext = {
  accessContext: UserAccessContext | null
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
  const permissions = useMemo(
    () => resolvePromotionPermissions(accessContext),
    [accessContext],
  )

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
    if (!(campaignForm.id ? permissions.canUpdateCampaign : permissions.canCreateCampaign)) {
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
      const msg = campaignForm.id ? 'Đã cập nhật campaign.' : 'Đã tạo campaign mới.'
      setMessage(msg)
      showSuccess(msg)
      await loadCampaigns(campaignPage)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể lưu campaign.'
      setMessage(msg)
      showError(msg)
    } finally {
      setSaving(false)
    }
  }

  const saveVoucher = async () => {
    if (!(voucherForm.id ? permissions.canUpdateVoucher : permissions.canCreateVoucher)) {
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
      const msg = voucherForm.id ? 'Đã cập nhật voucher.' : 'Đã tạo voucher mới.'
      setMessage(msg)
      showSuccess(msg)
      await loadVouchers(voucherPage)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể lưu voucher.'
      setMessage(msg)
      showError(msg)
    } finally {
      setSaving(false)
    }
  }

  const toggleCampaignStatus = async (item: PromotionCampaign) => {
    if (!permissions.canPublishCampaign) {
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
      showSuccess('Đã cập nhật trạng thái campaign.')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể cập nhật trạng thái campaign.'
      setMessage(msg)
      showError(msg)
    } finally {
      setSaving(false)
    }
  }

  const toggleVoucherStatus = async (item: Voucher) => {
    if (!permissions.canPublishVoucher) {
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
      showSuccess('Đã cập nhật trạng thái voucher.')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể cập nhật trạng thái voucher.'
      setMessage(msg)
      showError(msg)
    } finally {
      setSaving(false)
    }
  }

  const deleteCampaign = async (item: PromotionCampaign) => {
    if (!permissions.canDeleteCampaign) {
      return
    }

    const label = item.name || item.code || `#${item.id}`
    const confirmed = window.confirm(
      `Xoá vĩnh viễn campaign "${label}"?\n\n` +
        'Các voucher đang liên kết sẽ tự rời chiến dịch (campaign_id = null) ' +
        'và không bị xoá theo, giữ nguyên lịch sử phát hành.',
    )
    if (!confirmed) {
      return
    }

    setSaving(true)
    setMessage('')
    try {
      await promotionApi.deleteCampaign(item.id)
      setCampaigns((current) => current.filter((c) => c.id !== item.id))
      if (selectedCampaign?.id === item.id) {
        setSelectedCampaign(null)
        setCampaignForm(createEmptyCampaignForm())
      }
      setMessage('Đã xoá campaign.')
      showSuccess('Đã xoá campaign.')
      await loadCampaigns(campaignPage)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể xoá campaign.'
      setMessage(msg)
      showError(msg)
    } finally {
      setSaving(false)
    }
  }

  const deleteVoucher = async (item: Voucher) => {
    if (!permissions.canDeleteVoucher) {
      return
    }

    if ((item.usedCount ?? 0) > 0) {
      const msg = 'Voucher đã có lượt sử dụng — chỉ có thể tắt để giữ lịch sử booking.'
      setMessage(msg)
      showError(msg)
      return
    }

    const label = item.name || item.code || `#${item.id}`
    const confirmed = window.confirm(`Xoá vĩnh viễn voucher "${label}"?`)
    if (!confirmed) {
      return
    }

    setSaving(true)
    setMessage('')
    try {
      await promotionApi.deleteVoucher(item.id)
      setVouchers((current) => current.filter((v) => v.id !== item.id))
      if (selectedVoucher?.id === item.id) {
        setSelectedVoucher(null)
        setVoucherForm(createEmptyVoucherForm())
      }
      setMessage('Đã xoá voucher.')
      showSuccess('Đã xoá voucher.')
      await loadVouchers(voucherPage)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể xoá voucher.'
      setMessage(msg)
      showError(msg)
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
          <p>
            Cần có quyền <code>promotion.campaign.view</code> hoặc <code>voucher.view</code>.
            Liên hệ quản trị để được gán role <strong>MARKETING_VIEWER</strong> trở lên.
          </p>
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
            <button type="button" className={activeTab === 'campaigns' ? 'is-active' : ''} onClick={() => setActiveTab('campaigns')}>
              Campaign
            </button>
            <button type="button" className={activeTab === 'vouchers' ? 'is-active' : ''} onClick={() => setActiveTab('vouchers')}>
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
            <select value={query.isActive} onChange={(event) => setQuery((current) => ({ ...current, isActive: event.target.value }))}>
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
                onChange={(event) => setQuery((current) => ({ ...current, campaignId: event.target.value }))}
                placeholder="Lọc voucher theo campaign"
              />
            </label>
          )}

          <button type="button" onClick={() => void loadAll()} disabled={loading}>
            <RefreshCcw aria-hidden="true" />
            Tải lại
          </button>

          {permissions.canCreateCampaign && activeTab === 'campaigns' && (
            <button type="button" onClick={() => {
              setSelectedCampaign(null)
              setCampaignForm(createEmptyCampaignForm())
            }}>
              <Plus aria-hidden="true" />
              Tạo campaign
            </button>
          )}

          {permissions.canCreateVoucher && activeTab === 'vouchers' && (
            <button type="button" onClick={() => {
              setSelectedVoucher(null)
              setVoucherForm(createEmptyVoucherForm())
            }}>
              <Plus aria-hidden="true" />
              Tạo voucher
            </button>
          )}
        </div>

        {activeTab === 'campaigns' ? (
          <CampaignManagementPane
            campaignForm={campaignForm}
            campaignPage={campaignPage}
            campaignTotalPages={campaignTotalPages}
            campaigns={campaigns}
            canCreate={permissions.canCreateCampaign}
            canUpdate={permissions.canUpdateCampaign}
            canDelete={permissions.canDeleteCampaign}
            canPublish={permissions.canPublishCampaign}
            detailLoading={detailLoading}
            loading={loading}
            saving={saving}
            selectedCampaign={selectedCampaign}
            onChangeForm={(patch) => setCampaignForm((current) => ({ ...current, ...patch }))}
            onCreate={() => {
              setSelectedCampaign(null)
              setCampaignForm(createEmptyCampaignForm())
            }}
            onDelete={(item) => void deleteCampaign(item)}
            onPaginate={(page) => void loadCampaigns(page)}
            onSave={() => void saveCampaign()}
            onSelect={selectCampaign}
            onToggleStatus={(item) => void toggleCampaignStatus(item)}
          />
        ) : (
          <VoucherManagementPane
            canCreate={permissions.canCreateVoucher}
            canUpdate={permissions.canUpdateVoucher}
            canDelete={permissions.canDeleteVoucher}
            canPublish={permissions.canPublishVoucher}
            detailLoading={detailLoading}
            loading={loading}
            saving={saving}
            selectedVoucher={selectedVoucher}
            voucherForm={voucherForm}
            voucherPage={voucherPage}
            voucherTotalPages={voucherTotalPages}
            vouchers={vouchers}
            onChangeForm={(patch) => setVoucherForm((current) => ({ ...current, ...patch }))}
            onCreate={() => {
              setSelectedVoucher(null)
              setVoucherForm(createEmptyVoucherForm())
            }}
            onDelete={(item) => void deleteVoucher(item)}
            onPaginate={(page) => void loadVouchers(page)}
            onSave={() => void saveVoucher()}
            onSelect={selectVoucher}
            onToggleStatus={(item) => void toggleVoucherStatus(item)}
          />
        )}

        {message && <p className="mgmt-crud-message">{message}</p>}
      </section>
    </div>
  )
}

export default ManagementPromotionPage
