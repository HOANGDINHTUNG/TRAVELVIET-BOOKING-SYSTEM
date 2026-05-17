import type {
  PromotionCampaign,
  PromotionCampaignPayload,
  Voucher,
  VoucherApplicableScope,
  VoucherDiscountType,
  VoucherPayload,
} from '../../../../api/server/Promotion.api'
import type { UserAccessContext } from '../../../auth/api/authApi'

export type PromotionTab = 'campaigns' | 'vouchers'

export type PromotionQueryState = {
  keyword: string
  isActive: string
  campaignId: string
}

export type CampaignFormState = {
  id: number | null
  code: string
  name: string
  description: string
  imageUrl: string
  imageAlt: string
  displayTitle: string
  displaySubtitle: string
  badgeText: string
  ctaLabel: string
  ctaUrl: string
  sortOrder: string
  isFeatured: boolean
  startAt: string
  endAt: string
  targetMemberLevel: string
  conditionsJson: string
  rewardJson: string
  isActive: boolean
}

export type VoucherFormState = {
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

export const activeFilterOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'true', label: 'Đang bật' },
  { value: 'false', label: 'Đang tắt' },
]

export const discountTypeOptions: Array<{ value: VoucherDiscountType; label: string }> = [
  { value: 'percentage', label: 'Phần trăm' },
  { value: 'fixed_amount', label: 'Số tiền cố định' },
  { value: 'gift', label: 'Quà tặng' },
  { value: 'cashback', label: 'Hoàn tiền' },
]

export const scopeOptions: Array<{ value: VoucherApplicableScope; label: string }> = [
  { value: 'all', label: 'Toàn hệ thống' },
  { value: 'tour', label: 'Theo tour' },
  { value: 'destination', label: 'Theo điểm đến' },
]

export function createEmptyCampaignForm(): CampaignFormState {
  return {
    id: null,
    code: '',
    name: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    displayTitle: '',
    displaySubtitle: '',
    badgeText: '',
    ctaLabel: '',
    ctaUrl: '',
    sortOrder: '0',
    isFeatured: false,
    startAt: '',
    endAt: '',
    targetMemberLevel: '',
    conditionsJson: '',
    rewardJson: '',
    isActive: true,
  }
}

export function createEmptyVoucherForm(): VoucherFormState {
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

export function canUsePermission(accessContext: UserAccessContext, permission: string) {
  return (
    Boolean(accessContext.isSuperAdmin) ||
    (accessContext.permissions ?? []).includes(permission)
  )
}

function hasAnyPermission(
  accessContext: UserAccessContext,
  permissions: string[],
) {
  if (accessContext.isSuperAdmin) {
    return true
  }

  const owned = accessContext.permissions ?? []
  return permissions.some((permission) => owned.includes(permission))
}

/**
 * Tổng hợp quyền của user trong khu khuyến mãi.
 * Tách riêng campaign vs voucher để dễ phân bổ trách nhiệm theo role
 * (MARKETING_MANAGER / MARKETING_OPERATOR / MARKETING_VIEWER) thay vì
 * dồn hết về ADMIN.
 *
 * Backward-compat: nếu tài khoản cũ chỉ còn `voucher.*` (chưa kịp migrate role),
 * vẫn được suy ra quyền tương ứng cho khu campaign.
 */
export type PromotionPermissions = {
  canViewCampaign: boolean
  canCreateCampaign: boolean
  canUpdateCampaign: boolean
  canDeleteCampaign: boolean
  canPublishCampaign: boolean

  canViewVoucher: boolean
  canCreateVoucher: boolean
  canUpdateVoucher: boolean
  canDeleteVoucher: boolean
  canPublishVoucher: boolean
}

export function resolvePromotionPermissions(
  accessContext: UserAccessContext | null,
): PromotionPermissions {
  if (!accessContext) {
    return {
      canViewCampaign: false,
      canCreateCampaign: false,
      canUpdateCampaign: false,
      canDeleteCampaign: false,
      canPublishCampaign: false,
      canViewVoucher: false,
      canCreateVoucher: false,
      canUpdateVoucher: false,
      canDeleteVoucher: false,
      canPublishVoucher: false,
    }
  }

  return {
    canViewCampaign: hasAnyPermission(accessContext, [
      'promotion.campaign.view',
      'voucher.view',
    ]),
    canCreateCampaign: hasAnyPermission(accessContext, [
      'promotion.campaign.create',
      'voucher.create',
    ]),
    canUpdateCampaign: hasAnyPermission(accessContext, [
      'promotion.campaign.update',
      'voucher.update',
    ]),
    canDeleteCampaign: hasAnyPermission(accessContext, [
      'promotion.campaign.delete',
    ]),
    canPublishCampaign: hasAnyPermission(accessContext, [
      'promotion.campaign.publish',
      'voucher.delete',
    ]),

    canViewVoucher: canUsePermission(accessContext, 'voucher.view'),
    canCreateVoucher: canUsePermission(accessContext, 'voucher.create'),
    canUpdateVoucher: canUsePermission(accessContext, 'voucher.update'),
    canDeleteVoucher: canUsePermission(accessContext, 'voucher.delete'),
    canPublishVoucher: hasAnyPermission(accessContext, [
      'voucher.publish',
      'voucher.delete',
    ]),
  }
}

export function toBooleanFilter(value: string) {
  if (!value) {
    return undefined
  }

  return value === 'true'
}

export function toOptionalNumber(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  const numeric = Number(trimmed)
  return Number.isFinite(numeric) ? numeric : undefined
}

export function toDateTimeField(value: string | undefined) {
  return value?.slice(0, 16) ?? ''
}

export function parseJsonField(value: string, fieldName: string) {
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

export function formatDate(value: string | undefined) {
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

export function formatMoney(value: number | string | undefined) {
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

export function statusLabel(isActive: boolean | undefined) {
  return isActive === false ? 'Đang tắt' : 'Đang bật'
}

export function updateCollection<T extends { id: number }>(items: T[], updated: T) {
  return items.some((item) => item.id === updated.id)
    ? items.map((item) => (item.id === updated.id ? updated : item))
    : [updated, ...items]
}

export function toCampaignForm(item: PromotionCampaign): CampaignFormState {
  return {
    id: item.id,
    code: item.code ?? '',
    name: item.name ?? '',
    description: item.description ?? '',
    imageUrl: item.imageUrl ?? '',
    imageAlt: item.imageAlt ?? '',
    displayTitle: item.displayTitle ?? '',
    displaySubtitle: item.displaySubtitle ?? '',
    badgeText: item.badgeText ?? '',
    ctaLabel: item.ctaLabel ?? '',
    ctaUrl: item.ctaUrl ?? '',
    sortOrder: item.sortOrder?.toString() ?? '0',
    isFeatured: Boolean(item.isFeatured),
    startAt: toDateTimeField(item.startAt),
    endAt: toDateTimeField(item.endAt),
    targetMemberLevel: item.targetMemberLevel ?? '',
    conditionsJson: item.conditionsJson ? JSON.stringify(item.conditionsJson, null, 2) : '',
    rewardJson: item.rewardJson ? JSON.stringify(item.rewardJson, null, 2) : '',
    isActive: item.isActive !== false,
  }
}

export function toVoucherForm(item: Voucher): VoucherFormState {
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

export function buildCampaignPayload(form: CampaignFormState): PromotionCampaignPayload {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    imageUrl: form.imageUrl.trim() || undefined,
    imageAlt: form.imageAlt.trim() || undefined,
    displayTitle: form.displayTitle.trim() || undefined,
    displaySubtitle: form.displaySubtitle.trim() || undefined,
    badgeText: form.badgeText.trim() || undefined,
    ctaLabel: form.ctaLabel.trim() || undefined,
    ctaUrl: form.ctaUrl.trim() || undefined,
    sortOrder: toOptionalNumber(form.sortOrder) ?? 0,
    isFeatured: form.isFeatured,
    startAt: `${form.startAt}:00`,
    endAt: `${form.endAt}:00`,
    targetMemberLevel: form.targetMemberLevel.trim() || undefined,
    conditionsJson: parseJsonField(form.conditionsJson, 'Điều kiện áp dụng'),
    rewardJson: parseJsonField(form.rewardJson, 'Cấu hình ưu đãi'),
    isActive: form.isActive,
  }
}

export function buildVoucherPayload(form: VoucherFormState): VoucherPayload {
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
