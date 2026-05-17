import { BadgePercent, Save, Trash2 } from 'lucide-react'
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
  canDelete: boolean
  canPublish: boolean
  detailLoading: boolean
  loading: boolean
  saving: boolean
  selectedCampaign: PromotionCampaign | null
  onChangeForm: (patch: Partial<CampaignFormState>) => void
  onCreate: () => void
  onDelete: (item: PromotionCampaign) => void
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
  canDelete,
  canPublish,
  detailLoading,
  loading,
  saving,
  selectedCampaign,
  onChangeForm,
  onCreate,
  onDelete,
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
                  <small>{item.displayTitle || item.code || '-'}</small>
                </div>
                <span>{item.isFeatured ? 'FEATURED' : item.targetMemberLevel || 'ALL'}</span>
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
              <label><span>Tiêu đề hiển thị</span><input value={campaignForm.displayTitle} onChange={(event) => onChangeForm({ displayTitle: event.target.value })} /></label>
              <label><span>Dòng phụ</span><input value={campaignForm.displaySubtitle} onChange={(event) => onChangeForm({ displaySubtitle: event.target.value })} /></label>
              <label><span>Badge</span><input value={campaignForm.badgeText} onChange={(event) => onChangeForm({ badgeText: event.target.value })} placeholder="Ưu đãi hè" /></label>
              <label><span>Thứ tự</span><input type="number" value={campaignForm.sortOrder} onChange={(event) => onChangeForm({ sortOrder: event.target.value })} /></label>
              <label><span>Bắt đầu</span><input type="datetime-local" value={campaignForm.startAt} onChange={(event) => onChangeForm({ startAt: event.target.value })} /></label>
              <label><span>Kết thúc</span><input type="datetime-local" value={campaignForm.endAt} onChange={(event) => onChangeForm({ endAt: event.target.value })} /></label>
              <label><span>Hạng thành viên</span><input value={campaignForm.targetMemberLevel} onChange={(event) => onChangeForm({ targetMemberLevel: event.target.value })} placeholder="bronze, silver..." /></label>
              <label><span>Nút CTA</span><input value={campaignForm.ctaLabel} onChange={(event) => onChangeForm({ ctaLabel: event.target.value })} placeholder="Xem ưu đãi" /></label>
              <label><span>Link CTA</span><input value={campaignForm.ctaUrl} onChange={(event) => onChangeForm({ ctaUrl: event.target.value })} placeholder="/promotions/..." /></label>
              <label className="mgmt-promo-admin-wide"><span>URL ảnh khuyến mãi</span><input value={campaignForm.imageUrl} onChange={(event) => onChangeForm({ imageUrl: event.target.value })} placeholder="https://..." /></label>
              <label className="mgmt-promo-admin-wide"><span>Mô tả ảnh</span><input value={campaignForm.imageAlt} onChange={(event) => onChangeForm({ imageAlt: event.target.value })} /></label>
              {campaignForm.imageUrl && (
                <div className="mgmt-promo-admin-preview mgmt-promo-admin-wide">
                  <img src={campaignForm.imageUrl} alt={campaignForm.imageAlt || campaignForm.displayTitle || campaignForm.name} />
                  <div>
                    <span>{campaignForm.badgeText || 'Promotion'}</span>
                    <strong>{campaignForm.displayTitle || campaignForm.name || 'Campaign preview'}</strong>
                    <p>{campaignForm.displaySubtitle || campaignForm.description || 'No display subtitle'}</p>
                  </div>
                </div>
              )}
              <label className="mgmt-promo-admin-wide"><span>Mô tả</span><textarea value={campaignForm.description} onChange={(event) => onChangeForm({ description: event.target.value })} /></label>
              <label className="mgmt-promo-admin-wide"><span>Điều kiện áp dụng (JSON)</span><textarea value={campaignForm.conditionsJson} onChange={(event) => onChangeForm({ conditionsJson: event.target.value })} placeholder='{"minBookings": 3}' /></label>
              <label className="mgmt-promo-admin-wide"><span>Cấu hình ưu đãi (JSON)</span><textarea value={campaignForm.rewardJson} onChange={(event) => onChangeForm({ rewardJson: event.target.value })} placeholder='{"type": "discount", "value": 10}' /></label>
              <label className="mgmt-promo-admin-toggle mgmt-promo-admin-wide">
                <input type="checkbox" checked={campaignForm.isActive} onChange={(event) => onChangeForm({ isActive: event.target.checked })} />
                <span>Đang bật</span>
              </label>
              <label className="mgmt-promo-admin-toggle mgmt-promo-admin-wide">
                <input type="checkbox" checked={campaignForm.isFeatured} onChange={(event) => onChangeForm({ isFeatured: event.target.checked })} />
                <span>Hiển thị ở khu khuyến mãi nổi bật</span>
              </label>
              <div className="mgmt-crud-actions mgmt-promo-admin-wide">
                <button type="button" onClick={() => void onSave()} disabled={saving || (campaignForm.id ? !canUpdate : !canCreate)}>
                  <Save aria-hidden="true" />
                  {saving ? 'Đang lưu...' : 'Lưu campaign'}
                </button>
                {selectedCampaign && (
                  <button
                    type="button"
                    onClick={() => void onToggleStatus(selectedCampaign)}
                    disabled={saving || !canPublish}
                    title={!canPublish ? 'Bạn không có quyền bật/tắt campaign' : undefined}
                  >
                    <BadgePercent aria-hidden="true" />
                    {selectedCampaign.isActive === false ? 'Bật campaign' : 'Tắt campaign'}
                  </button>
                )}
                {canCreate && (
                  <button type="button" onClick={onCreate}>
                    Tạo campaign mới
                  </button>
                )}
                {selectedCampaign && canDelete && (
                  <button
                    type="button"
                    className="mgmt-crud-danger"
                    onClick={() => onDelete(selectedCampaign)}
                    disabled={saving}
                  >
                    <Trash2 aria-hidden="true" />
                    Xoá campaign
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
