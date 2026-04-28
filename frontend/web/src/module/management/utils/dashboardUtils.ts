import type { ManagementEndpoint } from '../config/managementCatalog'
import type { CheckState, CheckStatus, RoleModules } from './dashboardTypes'

export type EndpointWithModule = ManagementEndpoint & {
  moduleTitle: string
}

export function summarizePayload(payload: unknown) {
  if (Array.isArray(payload)) {
    return `${payload.length} records`
  }

  if (!payload || typeof payload !== 'object') {
    return 'No payload'
  }

  const payloadObject = payload as Record<string, unknown>
  if (Array.isArray(payloadObject.content)) {
    const pageSize = payloadObject.content.length
    const total = payloadObject.totalElements

    return typeof total === 'number'
      ? `Page has ${pageSize}/${total} records`
      : `Page has ${pageSize} records`
  }

  return `${Object.keys(payloadObject).length} fields`
}

export function getCheckStatusClass(status: CheckStatus) {
  if (status === 'success') return 'mgmt-check-status success'
  if (status === 'error') return 'mgmt-check-status error'
  if (status === 'loading') return 'mgmt-check-status loading'
  return 'mgmt-check-status'
}

export function getMethodCounts(modules: RoleModules) {
  return modules.reduce<Record<string, number>>((counts, module) => {
    module.endpoints.forEach((endpoint) => {
      counts[endpoint.method] = (counts[endpoint.method] ?? 0) + 1
    })

    return counts
  }, {})
}

export function getEndpointCount(modules: RoleModules) {
  return modules.reduce((total, module) => total + module.endpoints.length, 0)
}

export function createEndpointMap(modules: RoleModules) {
  return new Map(
    modules.flatMap((module) =>
      module.endpoints.map((endpoint) => [
        endpoint.id,
        {
          ...endpoint,
          moduleTitle: module.title,
        },
      ] as const),
    ),
  )
}

export function collectEndpoints(
  endpointIds: readonly string[],
  endpointMap: Map<string, EndpointWithModule>,
) {
  return endpointIds.reduce<EndpointWithModule[]>((list, endpointId) => {
    const endpoint = endpointMap.get(endpointId)
    if (endpoint) {
      list.push(endpoint)
    }
    return list
  }, [])
}

export function getCheckSummary(
  checkIds: string[],
  checkStates: Record<string, CheckState>,
) {
  const summary: Record<CheckStatus, number> = {
    idle: 0,
    loading: 0,
    success: 0,
    error: 0,
  }

  checkIds.forEach((checkId) => {
    const status = checkStates[checkId]?.status ?? 'idle'
    summary[status] += 1
  })

  return summary
}
