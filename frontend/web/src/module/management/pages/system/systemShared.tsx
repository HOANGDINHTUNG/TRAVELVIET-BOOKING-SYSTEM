import { Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import type {
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  AdminUser,
  Permission,
  Role,
  RolePayload,
} from '../../../../api/server/SystemAdmin.api'
import type {
  ManagementPageId,
} from '../../config/managementNavigation'
import {
  canAccessManagementItem,
  getManagementNavItem,
} from '../../config/managementNavigation'
import type { UserAccessContext } from '../../../auth/api/authApi'

export type SystemPageId = Extract<ManagementPageId, 'users' | 'roles' | 'permissions'>

export type UsersQueryState = {
  keyword: string
  status: string
  roleCode: string
  memberLevel: string
}

export type UserFormState = {
  id: string | null
  fullName: string
  displayName: string
  email: string
  phone: string
  passwordHash: string
  userCategory: string
  status: string
  memberLevel: string
  gender: string
  dateOfBirth: string
  avatarUrl: string
  loyaltyPoints: string
  totalSpent: string
  roleCodes: string[]
}

export type RoleFormState = {
  id: number | null
  code: string
  name: string
  description: string
  roleScope: string
  hierarchyLevel: string
  isSystemRole: boolean
  isActive: boolean
}

export const userStatusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'pending', label: 'Chờ xác minh' },
  { value: 'suspended', label: 'Tạm khóa' },
  { value: 'blocked', label: 'Bị chặn' },
  { value: 'deleted', label: 'Đã xóa' },
]

export const memberLevelOptions = [
  { value: '', label: 'Tất cả hạng thành viên' },
  { value: 'bronze', label: 'Đồng' },
  { value: 'silver', label: 'Bạc' },
  { value: 'gold', label: 'Vàng' },
  { value: 'platinum', label: 'Bạch kim' },
  { value: 'diamond', label: 'Kim cương' },
]

export const userCategoryOptions = [
  { value: 'CUSTOMER', label: 'Khách hàng' },
  { value: 'INTERNAL', label: 'Nội bộ' },
]

export const genderOptions = [
  { value: '', label: 'Không chọn' },
  { value: 'unknown', label: 'Chưa rõ' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
]

export const roleScopeOptions = [
  { value: 'CUSTOMER', label: 'Khách hàng' },
  { value: 'BACKOFFICE', label: 'Backoffice' },
  { value: 'SYSTEM', label: 'Hệ thống' },
]

export const permissionActiveOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang bật' },
  { value: 'inactive', label: 'Đang tắt' },
]

export function createEmptyUserForm(): UserFormState {
  return {
    id: null,
    fullName: '',
    displayName: '',
    email: '',
    phone: '',
    passwordHash: '',
    userCategory: 'CUSTOMER',
    status: 'active',
    memberLevel: 'bronze',
    gender: '',
    dateOfBirth: '',
    avatarUrl: '',
    loyaltyPoints: '',
    totalSpent: '',
    roleCodes: [],
  }
}

export function createEmptyRoleForm(): RoleFormState {
  return {
    id: null,
    code: '',
    name: '',
    description: '',
    roleScope: 'BACKOFFICE',
    hierarchyLevel: '100',
    isSystemRole: false,
    isActive: true,
  }
}

export function canUsePermission(accessContext: UserAccessContext, permission: string) {
  return (
    Boolean(accessContext.isSuperAdmin) ||
    (accessContext.permissions ?? []).includes(permission)
  )
}

export function getUserDisplayName(user: AdminUser) {
  return user.displayName || user.fullName || user.email || user.phone || user.id
}

export function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function isInactiveUser(user: AdminUser) {
  const status = user.status?.toLowerCase()
  return Boolean(
    user.deletedAt ||
      status === 'suspended' ||
      status === 'blocked' ||
      status === 'deleted',
  )
}

export function labelFor(
  options: Array<{ value: string; label: string }>,
  value: string | undefined,
) {
  return options.find((option) => option.value === value)?.label ?? value ?? '-'
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

export function toOptionalNumber(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  const numberValue = Number(trimmed)
  return Number.isFinite(numberValue) ? numberValue : undefined
}

export function buildCreateUserPayload(form: UserFormState): AdminCreateUserPayload {
  const loyaltyPoints = toOptionalNumber(form.loyaltyPoints)
  const totalSpent = toOptionalNumber(form.totalSpent)

  return {
    fullName: form.fullName.trim(),
    displayName: form.displayName.trim() || undefined,
    email: form.email.trim() || undefined,
    phone: form.phone.trim() || undefined,
    passwordHash: form.passwordHash,
    userCategory: form.userCategory,
    status: form.status,
    memberLevel: form.memberLevel,
    gender: form.gender || undefined,
    dateOfBirth: form.dateOfBirth || undefined,
    avatarUrl: form.avatarUrl.trim() || undefined,
    loyaltyPoints,
    totalSpent,
    roleCodes: form.roleCodes.length ? form.roleCodes : undefined,
  }
}

export function buildUpdateUserPayload(form: UserFormState): AdminUpdateUserPayload {
  return {
    ...buildCreateUserPayload(form),
    passwordHash: form.passwordHash.trim() || undefined,
    status: form.status,
    memberLevel: form.memberLevel,
  }
}

export function buildRolePayload(form: RoleFormState): RolePayload {
  const hierarchyLevel = Number(form.hierarchyLevel)

  return {
    code: form.code.trim(),
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    roleScope: form.roleScope,
    hierarchyLevel: Number.isFinite(hierarchyLevel) ? hierarchyLevel : 0,
    isSystemRole: form.isSystemRole,
    isActive: form.isActive,
  }
}

export function groupPermissionsByModule(permissions: Permission[]) {
  return permissions.reduce<Record<string, Permission[]>>((groups, permission) => {
    const moduleName = permission.moduleName || 'Khác'
    groups[moduleName] = [...(groups[moduleName] ?? []), permission]
    return groups
  }, {})
}

export function toUserForm(user: AdminUser): UserFormState {
  return {
    id: user.id,
    fullName: user.fullName ?? '',
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    passwordHash: '',
    userCategory: user.userCategory ?? 'CUSTOMER',
    status: user.status ?? 'active',
    memberLevel: user.memberLevel ?? 'bronze',
    gender: user.gender ?? '',
    dateOfBirth: user.dateOfBirth ?? '',
    avatarUrl: user.avatarUrl ?? '',
    loyaltyPoints: user.loyaltyPoints?.toString() ?? '',
    totalSpent: user.totalSpent?.toString() ?? '',
    roleCodes: user.roles ?? (user.role ? [user.role] : []),
  }
}

export function toRoleForm(role: Role): RoleFormState {
  return {
    id: role.id,
    code: role.code ?? '',
    name: role.name ?? '',
    description: role.description ?? '',
    roleScope: role.roleScope ?? 'BACKOFFICE',
    hierarchyLevel: role.hierarchyLevel?.toString() ?? '100',
    isSystemRole: Boolean(role.isSystemRole),
    isActive: role.isActive !== false,
  }
}

export function PageGate({
  accessContext,
  pageId,
  children,
}: {
  accessContext: UserAccessContext | null
  pageId: SystemPageId
  children: (accessContext: UserAccessContext) => ReactElement
}) {
  const page = getManagementNavItem(pageId)

  if (!page) {
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
      page,
      accessContext.permissions ?? [],
      Boolean(accessContext.isSuperAdmin),
    )
  ) {
    return (
      <div className="mgmt-page">
        <section className="mgmt-module-shell">
          <p className="mgmt-kicker">KHÔNG CÓ QUYỀN</p>
          <h2>Bạn không có quyền truy cập trang này</h2>
          <p>Vui lòng dùng tài khoản có quyền phù hợp hoặc liên hệ quản trị viên.</p>
        </section>
      </div>
    )
  }

  return children(accessContext)
}
