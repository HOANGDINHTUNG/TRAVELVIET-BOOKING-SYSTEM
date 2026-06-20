import { apiRequest } from '@/services/apiClient';

export interface SystemPermission {
  id: number;
  code: string;
  name: string;
  moduleName: string;
  actionName: string;
  description?: string;
  isActive: boolean;
}

export interface SystemRole {
  id: number;
  code: string;
  name: string;
  description?: string;
  roleScope: 'SYSTEM' | 'BACKOFFICE' | 'CUSTOMER';
  hierarchyLevel: number;
  isSystemRole: boolean;
  isActive: boolean;
  permissions?: SystemPermission[];
}

export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
  roleScope: 'SYSTEM' | 'BACKOFFICE' | 'CUSTOMER';
  hierarchyLevel: number;
  isSystemRole?: boolean;
  isActive?: boolean;
}

export async function fetchSystemRoles() {
  return apiRequest<SystemRole[]>('/roles');
}

export async function fetchSystemRole(id: number) {
  return apiRequest<SystemRole>(`/roles/${id}`);
}

export async function fetchSystemPermissions() {
  return apiRequest<SystemPermission[]>('/permissions');
}

export async function createSystemRole(request: CreateRoleRequest) {
  return apiRequest<SystemRole>('/roles', {
    method: 'POST',
    body: request,
  });
}

export async function updateSystemRole(id: number, request: CreateRoleRequest) {
  return apiRequest<SystemRole>(`/roles/${id}`, {
    method: 'PUT',
    body: request,
  });
}

export async function replaceRolePermissions(id: number, permissionCodes: string[]) {
  return apiRequest<SystemRole>(`/roles/${id}/permissions`, {
    method: 'PATCH',
    body: { permissionCodes },
  });
}
