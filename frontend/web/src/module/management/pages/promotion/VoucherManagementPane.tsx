import { Save, TicketPercent } from 'lucide-react'
import type { Voucher, VoucherApplicableScope, VoucherDiscountType } from '../../../../api/server/Promotion.api'
import {
  discountTypeOptions,
  formatDate,
  formatMoney,
  scopeOptions,
  statusLabel,
  type VoucherFormState,
} from './promotionShared'

type VoucherManagementPaneProps = {
  canCreate: boolean
  canUpdate: boolean
  detailLoading: boolean
  loading: boolean
  saving: boolean
  selectedVoucher: Voucher | null
  voucherForm: VoucherFormState
  voucherPage: number
  voucherTotalPages: number
  vouchers: Voucher[]
  onChangeForm: (patch: Partial<VoucherFormState>) => void
  onCreate: () => void
  onPaginate: (page: number) => void
  onSave: () => void
  onSelect: (item: Voucher) => void
  onToggleStatus: (item: Voucher) => void
}

function VoucherManagementPane({
  canCreate,
  canUpdate,
  detailLoading,
  loading,
  saving,
  selectedVoucher,
  voucherForm,
  voucherPage,
  voucherTotalPages,
  vouchers,
  onChangeForm,
  onCreate,
  onPaginate,
  onSave,
  onSelect,
  onToggleStatus,
}: VoucherManagementPaneProps) {
  return (
    <div className="mgmt-promo-admin-layout">
      <article className="mgmt-crud-panel">
        <div className="mgmt-section-title">
          <h3>Danh sách voucher</h3>
          <p>Trang {voucherPage + 1}/{voucherTotalPages}.</p>
        </div>

        {loading ? (
          <p className="mgmt-crud-empty">Đang tải dữ liệu khuyến mãi...</p>
        ) : vouchers.length > 0 ? (
          <div className="mgmt-promo-admin-list">
            {vouchers.map((item) => (
              <button
                type="button"
                key={item.id}
                className={selectedVoucher?.id === item.id ? 'active' : ''}
                onClick={() => void onSelect(item)}
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
          <button type="button" onClick={() => onPaginate(Math.max(voucherPage - 1, 0))} disabled={loading || voucherPage <= 0}>
            Trước
          </button>
          <span>{voucherPage + 1}/{voucherTotalPages}</span>
          <button type="button" onClick={() => onPaginate(Math.min(voucherPage + 1, voucherTotalPages - 1))} disabled={loading || voucherPage >= voucherTotalPages - 1}>
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
              <h3>{voucherForm.id ? 'Cập nhật voucher' : 'Tạo voucher'}</h3>
              <p>Thiết lập giá trị giảm, phạm vi áp dụng, hạn mức dùng và khoảng hiệu lực.</p>
            </div>

            <div className="mgmt-promo-admin-form">
              <label><span>Mã voucher</span><input value={voucherForm.code} onChange={(event) => onChangeForm({ code: event.target.value })} /></label>
              <label><span>Tên voucher</span><input value={voucherForm.name} onChange={(event) => onChangeForm({ name: event.target.value })} /></label>
              <label><span>Campaign ID</span><input value={voucherForm.campaignId} onChange={(event) => onChangeForm({ campaignId: event.target.value })} /></label>
              <label>
                <span>Loại giảm</span>
                <select value={voucherForm.discountType} onChange={(event) => onChangeForm({ discountType: event.target.value as VoucherDiscountType })}>
                  {discountTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label><span>Giá trị giảm</span><input value={voucherForm.discountValue} onChange={(event) => onChangeForm({ discountValue: event.target.value })} /></label>
              <label><span>Giảm tối đa</span><input value={voucherForm.maxDiscountAmount} onChange={(event) => onChangeForm({ maxDiscountAmount: event.target.value })} /></label>
              <label><span>Đơn tối thiểu</span><input value={voucherForm.minOrderValue} onChange={(event) => onChangeForm({ minOrderValue: event.target.value })} /></label>
              <label><span>Giới hạn tổng</span><input value={voucherForm.usageLimitTotal} onChange={(event) => onChangeForm({ usageLimitTotal: event.target.value })} /></label>
              <label><span>Giới hạn mỗi user</span><input value={voucherForm.usageLimitPerUser} onChange={(event) => onChangeForm({ usageLimitPerUser: event.target.value })} /></label>
              <label>
                <span>Phạm vi áp dụng</span>
                <select value={voucherForm.applicableScope} onChange={(event) => onChangeForm({ applicableScope: event.target.value as VoucherApplicableScope })}>
                  {scopeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label><span>Tour ID</span><input value={voucherForm.applicableTourId} onChange={(event) => onChangeForm({ applicableTourId: event.target.value })} /></label>
              <label><span>Destination ID</span><input value={voucherForm.applicableDestinationId} onChange={(event) => onChangeForm({ applicableDestinationId: event.target.value })} /></label>
              <label><span>Hạng thành viên</span><input value={voucherForm.applicableMemberLevel} onChange={(event) => onChangeForm({ applicableMemberLevel: event.target.value })} /></label>
              <label><span>Bắt đầu</span><input type="datetime-local" value={voucherForm.startAt} onChange={(event) => onChangeForm({ startAt: event.target.value })} /></label>
              <label><span>Kết thúc</span><input type="datetime-local" value={voucherForm.endAt} onChange={(event) => onChangeForm({ endAt: event.target.value })} /></label>
              <label className="mgmt-promo-admin-wide"><span>Mô tả</span><textarea value={voucherForm.description} onChange={(event) => onChangeForm({ description: event.target.value })} /></label>
              <div className="mgmt-promo-admin-flags mgmt-promo-admin-wide">
                <label className="mgmt-promo-admin-toggle">
                  <input type="checkbox" checked={voucherForm.isStackable} onChange={(event) => onChangeForm({ isStackable: event.target.checked })} />
                  <span>Cho phép stack</span>
                </label>
                <label className="mgmt-promo-admin-toggle">
                  <input type="checkbox" checked={voucherForm.isActive} onChange={(event) => onChangeForm({ isActive: event.target.checked })} />
                  <span>Đang bật</span>
                </label>
              </div>
              <div className="mgmt-crud-actions mgmt-promo-admin-wide">
                <button type="button" onClick={() => void onSave()} disabled={saving || (voucherForm.id ? !canUpdate : !canCreate)}>
                  <Save aria-hidden="true" />
                  {saving ? 'Đang lưu...' : 'Lưu voucher'}
                </button>
                {selectedVoucher && (
                  <button type="button" onClick={() => void onToggleStatus(selectedVoucher)} disabled={saving || !canUpdate}>
                    <TicketPercent aria-hidden="true" />
                    {selectedVoucher.isActive === false ? 'Bật voucher' : 'Tắt voucher'}
                  </button>
                )}
                {canCreate && (
                  <button type="button" onClick={onCreate}>
                    Tạo voucher mới
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
  )
}

export default VoucherManagementPane
