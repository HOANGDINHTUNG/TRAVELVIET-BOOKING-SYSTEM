import type { UserAccessContext } from '@/types/auth';
import { getAuthSession } from '@/services/authStorage';

/** Khớp backend API doc — product/combo gate tạm qua voucher.* */
export const CommercePermissions = {
  view: 'voucher.view',
  create: 'voucher.create',
  update: 'voucher.update',
  toggleProduct: 'voucher.delete',
  toggleVoucher: 'voucher.publish',
  campaignView: 'promotion.campaign.view',
  campaignPublish: 'promotion.campaign.publish',
} as const;

export function canUsePermission(
  permission: string,
  ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null
) {
  const source = ctx ?? getAuthSession();
  if (!source) return false;
  if ('isSuperAdmin' in source && source.isSuperAdmin) return true;
  const permissions =
    'permissions' in source ? source.permissions : getAuthSession()?.permissions ?? [];
  return permissions.includes(permission);
}

export function canViewProducts(ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null) {
  return canUsePermission(CommercePermissions.view, ctx);
}

export function canViewCampaigns(ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null) {
  return (
    canUsePermission(CommercePermissions.campaignView, ctx) ||
    canUsePermission(CommercePermissions.view, ctx)
  );
}

export function canViewVouchers(ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null) {
  return canViewProducts(ctx);
}

export function canViewCombos(ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null) {
  return canViewProducts(ctx);
}

/** Mở desk nếu xem được ít nhất một tab */
export function canViewCommerceDesk(ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null) {
  return canViewProducts(ctx) || canViewCampaigns(ctx);
}

export function canToggleProductStatus(ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null) {
  return canUsePermission(CommercePermissions.toggleProduct, ctx);
}

export function canToggleVoucherStatus(ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null) {
  return canUsePermission(CommercePermissions.toggleVoucher, ctx);
}

export function canToggleCampaignStatus(ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null) {
  return canUsePermission(CommercePermissions.campaignPublish, ctx);
}

export function canToggleComboStatus(ctx?: Pick<UserAccessContext, 'permissions' | 'isSuperAdmin'> | null) {
  return canToggleProductStatus(ctx);
}
