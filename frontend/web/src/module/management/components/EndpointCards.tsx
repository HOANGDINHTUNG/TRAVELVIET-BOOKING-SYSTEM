import type { DashboardFocusItem } from '../config/managementDashboardConfig'
import type { RoleModules } from '../utils/dashboardTypes'
import {
  collectEndpoints,
  createEndpointMap,
  type EndpointWithModule,
} from '../utils/dashboardUtils'

type FocusGridProps = {
  items: readonly DashboardFocusItem[]
  modules: RoleModules
  cardClassName: string
  gridClassName: string
  headClassName: string
}

export function FocusGrid({
  items,
  modules,
  cardClassName,
  gridClassName,
  headClassName,
}: FocusGridProps) {
  const moduleMap = new Map(modules.map((module) => [module.id, module]))
  const endpointMap = createEndpointMap(modules)

  return (
    <div className={gridClassName}>
      {items.map((item) => {
        const Icon = item.icon
        const module = moduleMap.get(item.moduleId)
        const endpoints = collectEndpoints(item.endpointIds, endpointMap)

        return (
          <article className={`${cardClassName} tone-${item.tone}`} key={item.title}>
            <div className={headClassName}>
              <Icon aria-hidden="true" />
              <span>
                <strong>{item.title}</strong>
                <small>{module?.title ?? 'No access'}</small>
              </span>
            </div>
            <p>{item.description}</p>
            <EndpointChips endpoints={endpoints} />
          </article>
        )
      })}
    </div>
  )
}

export function EndpointChips({ endpoints }: { endpoints: EndpointWithModule[] }) {
  return (
    <div className="mgmt-admin-endpoint-chips">
      {endpoints.map((endpoint) => (
        <span
          className={`mgmt-method-tag method-${endpoint.method.toLowerCase()}`}
          key={endpoint.id}
        >
          {endpoint.method}
        </span>
      ))}
      <small>{endpoints.length} API ready</small>
    </div>
  )
}

export function EndpointRows({ module }: { module: RoleModules[number] }) {
  return (
    <div className="mgmt-admin-endpoint-list">
      {module.endpoints.map((endpoint) => (
        <div className="mgmt-admin-endpoint-row" key={endpoint.id}>
          <span className={`mgmt-method-tag method-${endpoint.method.toLowerCase()}`}>
            {endpoint.method}
          </span>
          <code>{endpoint.path}</code>
          <small>{endpoint.permission ?? endpoint.controller}</small>
        </div>
      ))}
    </div>
  )
}
