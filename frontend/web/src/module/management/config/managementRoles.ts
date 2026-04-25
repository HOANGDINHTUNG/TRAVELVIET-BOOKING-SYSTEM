import type { AuthUser, ManagerRoleCode } from '../../auth/api/authApi'
import {
  getAuthUserRoleCodes,
  isManagerRoleCode,
  MANAGER_ROLE_CODES,
} from '../../auth/api/authApi'

export type ManagerRoleProfile = {
  code: ManagerRoleCode
  label: string
  domain: 'SYSTEM' | 'BACKOFFICE'
  summary: string
}

export const managerRoleProfiles: Record<ManagerRoleCode, ManagerRoleProfile> = {
  SUPER_ADMIN: {
    code: 'SUPER_ADMIN',
    label: 'Super Admin',
    domain: 'SYSTEM',
    summary: 'Toan quyen he thong',
  },
  ADMIN: {
    code: 'ADMIN',
    label: 'Admin',
    domain: 'BACKOFFICE',
    summary: 'Quan tri van hanh',
  },
  CONTENT_EDITOR: {
    code: 'CONTENT_EDITOR',
    label: 'Content Editor',
    domain: 'BACKOFFICE',
    summary: 'Quan ly destination, tour, media, noi dung',
  },
  FIELD_STAFF: {
    code: 'FIELD_STAFF',
    label: 'Field Staff',
    domain: 'BACKOFFICE',
    summary: 'Nhan su thuc dia, cap nhat du lieu, check-in',
  },
  OPERATOR: {
    code: 'OPERATOR',
    label: 'Operator',
    domain: 'BACKOFFICE',
    summary: 'Dieu phoi lich, booking, refund, support',
  },
}

export const managerRolePermissionSeeds: Record<ManagerRoleCode, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'user.view',
    'user.create',
    'user.update',
    'user.delete',
    'user.block',
    'role.view',
    'role.assign',
    'permission.view',
    'destination.view',
    'destination.create',
    'destination.update',
    'destination.delete',
    'destination.publish',
    'destination.review',
    'tour.view',
    'tour.create',
    'tour.update',
    'tour.delete',
    'tour.publish',
    'schedule.view',
    'schedule.create',
    'schedule.update',
    'schedule.close',
    'guide.assign',
    'booking.view',
    'booking.create',
    'booking.update',
    'booking.cancel',
    'booking.checkin',
    'payment.view',
    'payment.create',
    'payment.update',
    'refund.view',
    'refund.create',
    'refund.approve',
    'refund.reject',
    'refund.process',
    'voucher.view',
    'voucher.create',
    'voucher.update',
    'voucher.delete',
    'support.view',
    'support.reply',
    'support.assign',
    'notification.view',
    'notification.send',
    'review.view',
    'review.reply',
    'review.moderate',
    'review.create',
    'audit.view',
    'report.view',
  ],
  CONTENT_EDITOR: [
    'destination.view',
    'destination.create',
    'destination.update',
    'destination.publish',
    'destination.review',
    'tour.view',
    'tour.create',
    'tour.update',
    'tour.publish',
    'schedule.view',
    'review.view',
    'notification.view',
  ],
  FIELD_STAFF: [
    'destination.view',
    'destination.create',
    'destination.update',
    'destination.review',
    'tour.view',
    'schedule.view',
    'schedule.update',
    'booking.view',
    'booking.checkin',
  ],
  OPERATOR: [
    'user.view',
    'destination.view',
    'destination.review',
    'tour.view',
    'schedule.view',
    'schedule.create',
    'schedule.update',
    'schedule.close',
    'guide.assign',
    'booking.view',
    'booking.create',
    'booking.update',
    'booking.cancel',
    'booking.checkin',
    'payment.view',
    'payment.create',
    'payment.update',
    'refund.view',
    'refund.create',
    'refund.approve',
    'refund.reject',
    'refund.process',
    'review.view',
    'review.reply',
    'review.create',
    'support.view',
    'support.reply',
    'support.assign',
    'notification.view',
    'notification.send',
    'report.view',
  ],
}

export function resolveManagerRolesForUser(user: AuthUser | null): ManagerRoleCode[] {
  const userRoleCodes = getAuthUserRoleCodes(user)
  const managerRoles = userRoleCodes.filter(isManagerRoleCode)

  return MANAGER_ROLE_CODES.filter((roleCode) => managerRoles.includes(roleCode))
}

export function managerRoleHasPermission(roleCode: ManagerRoleCode, permission?: string) {
  if (!permission) {
    return true
  }

  if (roleCode === 'SUPER_ADMIN') {
    return true
  }

  return managerRolePermissionSeeds[roleCode].includes(permission)
}
