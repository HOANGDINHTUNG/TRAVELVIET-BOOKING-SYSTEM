import { BadgePercent, Save } from 'lucide-react'
import type { PromotionCampaign } from '../../../../api/server/Promotion.api'
import type { CampaignFormState } from './promotionShared'
import { statusLabel } from './promotionShared'

type CampaignManagementPaneProps = {
  campaignForm: CampaignFormState
  campaignPage: number
  campaignTotalPages: number
  campaigns: PromotionCampaign[]
  canCreate: boolean
  canUpdate: boolean
  detailLoading: boolean
  loading: boolean
  saving: boolean
  selectedCampaign: PromotionCampaign | null
  onChangeForm: (patch: Partial<CampaignFormState>) => void
  onCreate: () => void
  onPaginate: (page: number) => void
  onSave: () => void
  onSelect: (item: PromotionCampaign) => void
  onToggleStatus: (item: PromotionCampaign) => void
}

function CampaignManagementPane({
  campaignForm,
  campaignPage,
  campaignTotalPages,
  campaigns,
  canCreate,
  canUpdate,
  detailLoading,
  loading,
  saving,
  selectedCampaign,
  onChangeForm,
  onCreate,
  onPaginate,
  onSave,
  onSelect,
  onToggleStatus,
}: CampaignManagementPaneProps) {
  return (
    <div className="mgmt-promo-admin-layout">
      <article className="mgmt-crud-panel">
        <div className="mgmt-section-title">
          <h3>Danh sách campaign</h3>
          <p>Trang {campaignPage + 1}/{campaignTotalPages}.</p>
        </div>

        {loading ? (
          <p className="mgmt-crud-empty">Đang tải dữ liệu khuyến mãi...</p>
        ) : campaigns.length > 0 ? (
          <div className="mgmt-promo-admin-list">
            {campaigns.map((item) => (
              <button
                type="button"
                key={item.id}
                className={selectedCampaign?.id === item.id ? 'active' : ''}
                onClick={() => void onSelect(item)}
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
        )}

        <div className="mgmt-crud-pagination">
          <button type="button" onClick={() => onPaginate(Math.max(campaignPage - 1, 0))} disabled={loading || campaignPage <= 0}>
            Trước
          </button>
          <span>{campaignPage + 1}/{campaignTotalPages}</span>
          <button type="button" onClick={() => onPaginate(Math.min(campaignPage + 1, campaignTotalPages - 1))} disabled={loading || campaignPage >= campaignTotalPages - 1}>
            Sau
          </button>
        </div>
      </article>

      <aside className="mgmt-crud-panel">
        {detailLoading ? (
          <p className="mgmt-crud-empty">Đang tải chi tiết khuyến mãi...</p>
        ) : (
          <>
            <div className="mgmt-section-title">
              <h3>{campaignForm.id ? 'Cập nhật campaign' : 'Tạo campaign'}</h3>
              <p>Quản lý khung thời gian, đối tượng áp dụng và JSON điều kiện/ưu đãi.</p>
            </div>

            <div className="mgmt-promo-admin-form">
              <label><span>Mã campaign</span><input value={campaignForm.code} onChange={(event) => onChangeForm({ code: event.target.value })} /></label>
              <label><span>Tên campaign</span><input value={campaignForm.name} onChange={(event) => onChangeForm({ name: event.target.value })} /></label>
              <label><span>Bắt đầu</span><input type="datetime-local" value={campaignForm.startAt} onChange={(event) => onChangeForm({ startAt: event.target.value })} /></label>
              <label><span>Kết thúc</span><input type="datetime-local" value={campaignForm.endAt} onChange={(event) => onChangeForm({ endAt: event.target.value })} /></label>
              <label><span>Hạng thành viên</span><input value={campaignForm.targetMemberLevel} onChange={(event) => onChangeForm({ targetMemberLevel: event.target.value })} placeholder="bronze, silver..." /></label>
              <label className="mgmt-promo-admin-wide"><span>Mô tả</span><textarea value={campaignForm.description} onChange={(event) => onChangeForm({ description: event.target.value })} /></label>
              <label className="mgmt-promo-admin-wide"><span>Điều kiện áp dụng (JSON)</span><textarea value={campaignForm.conditionsJson} onChange={(event) => onChangeForm({ conditionsJson: event.target.value })} placeholder='{"minBookings": 3}' /></label>
              <label className="mgmt-promo-admin-wide"><span>Cấu hình ưu đãi (JSON)</span><textarea value={campaignForm.rewardJson} onChange={(event) => onChangeForm({ rewardJson: event.target.value })} placeholder='{"type": "discount", "value": 10}' /></label>
              <label className="mgmt-promo-admin-toggle mgmt-promo-admin-wide">
                <input type="checkbox" checked={campaignForm.isActive} onChange={(event) => onChangeForm({ isActive: event.target.checked })} />
                <span>Đang bật</span>
              </label>
              <div className="mgmt-crud-actions mgmt-promo-admin-wide">
                <button type="button" onClick={() => void onSave()} disabled={saving || (campaignForm.id ? !canUpdate : !canCreate)}>
                  <Save aria-hidden="true" />
                  {saving ? 'Đang lưu...' : 'Lưu campaign'}
                </button>
                {selectedCampaign && (
                  <button type="button" onClick={() => void onToggleStatus(selectedCampaign)} disabled={saving || !canUpdate}>
                    <BadgePercent aria-hidden="true" />
                    {selectedCampaign.isActive === false ? 'Bật campaign' : 'Tắt campaign'}
                  </button>
                )}
                {canCreate && (
                  <button type="button" onClick={onCreate}>
                    Tạo campaign mới
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default CampaignManagementPane
