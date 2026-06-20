import { apiRequest } from '@/services/apiClient';
import type { PageResponse } from '@/types/api';

export interface AuditLog {
  id: number;
  actorUserId?: string;
  actorUsername?: string;
  actionName: string;
  entityName?: string;
  entityId?: string;
  oldData?: string;
  newData?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogFilterParams {
  page?: number;
  size?: number;
  actorUserId?: string;
  actionName?: string;
  entityName?: string;
  entityId?: string;
  from?: string;
  to?: string;
}

export async function fetchAuditLogs(params: AuditLogFilterParams = {}) {
  return apiRequest<PageResponse<AuditLog>>('/audit-logs', {
    query: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      actorUserId: params.actorUserId,
      actionName: params.actionName,
      entityName: params.entityName,
      entityId: params.entityId,
      from: params.from,
      to: params.to,
    },
  });
}
