import type { PageResponse } from '../../types/api'
import {
  getBackendData,
  patchBackendData,
  postBackendData,
  putBackendData,
} from './serverApiClient'

export type UserStatus = 'active' | 'inactive' | 'blocked' | 'deleted' | string

export type AdminUser = {
  id: string
  email?: string
  phone?: string
  fullName?: string
  displayName?: string
  gender?: string
  dateOfBirth?: string
  avatarUrl?: string
  userCategory?: string
  role?: string
  roles?: string[]
  status?: UserStatus
  memberLevel?: string
  loyaltyPoints?: number
  totalSpent?: number | string
  emailVerifiedAt?: string
  phoneVerifiedAt?: string
  lastLoginAt?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

export type AdminUserQuery = {
  page?: number
  size?: number
  keyword?: string
  status?: UserStatus
  roleCode?: string
  memberLevel?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc' | string
}

export type AdminCreateUserPayload = {
  fullName: string
  email?: string
  phone?: string
  passwordHash: string
  userCategory: string
  roleCodes?: string[]
  status?: UserStatus
  displayName?: string
  gender?: string
  dateOfBirth?: string
  avatarUrl?: string
  memberLevel?: string
  loyaltyPoints?: number
  totalSpent?: number | string
}

export type AdminUpdateUserPayload = Omit<
  AdminCreateUserPayload,
  'passwordHash'
> & {
  passwordHash?: string
  status: UserStatus
  memberLevel: string
  deletedAt?: string
}

export type Permission = {
  id: number
  code?: string
  name?: string
  moduleName?: string
  actionName?: string
  description?: string
  isActive?: boolean
  createdAt?: string
}

export type Role = {
  id: number
  code?: string
  name?: string
  description?: string
  roleScope?: string
  hierarchyLevel?: number
  isSystemRole?: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  permissions?: Permission[]
}

export type RolePayload = {
  code: string
  name: string
  description?: string
  roleScope: string
  hierarchyLevel: number
  isSystemRole?: boolean
  isActive?: boolean
}

export type UpdateRolePermissionsPayload = {
  permissionCodes: string[]
}

export type AuditLog = {
  id: number
  actorUserId?: string
  actionName?: string
  entityName?: string
  entityId?: string
  oldData?: unknown
  newData?: unknown
  ipAddress?: string
  userAgent?: string
  createdAt?: string
}

export type AuditLogQuery = {
  page?: number
  size?: number
  actorUserId?: string
  actionName?: string
  entityName?: string
  entityId?: string
  from?: string
  to?: string
}

export const systemAdminApi = {
  getUsers(params: AdminUserQuery = {}) {
    return getBackendData<PageResponse<AdminUser>>('users', params)
  },

  getUser(id: string) {
    return getBackendData<AdminUser>(`users/${id}`)
  },

  createUser(payload: AdminCreateUserPayload) {
    return postBackendData<AdminUser>('users', payload)
  },

  updateUser(id: string, payload: AdminUpdateUserPayload) {
    return putBackendData<AdminUser>(`users/${id}`, payload)
  },

  deactivateUser(id: string) {
    return patchBackendData<AdminUser>(`users/${id}/deactivate`)
  },

  getRoles() {
    return getBackendData<Role[]>('roles')
  },

  getRole(id: number) {
    return getBackendData<Role>(`roles/${id}`)
  },

  createRole(payload: RolePayload) {
    return postBackendData<Role>('roles', payload)
  },

  updateRole(id: number, payload: RolePayload) {
    return putBackendData<Role>(`roles/${id}`, payload)
  },

  updateRolePermissions(id: number, payload: UpdateRolePermissionsPayload) {
    return patchBackendData<Role>(`roles/${id}/permissions`, payload)
  },

  getPermissions() {
    return getBackendData<Permission[]>('permissions')
  },

  getAuditLogs(params: AuditLogQuery = {}) {
    return getBackendData<PageResponse<AuditLog>>('audit-logs', params)
  },
}
