import { Navigate, useOutletContext } from 'react-router-dom'
import type { UserAccessContext } from '../../auth/api/authApi'
import {
  managementModules,
  type ManagementEndpoint,
  type ManagementModule,
} from '../config/managementCatalog'
import {
  canAccessManagementItem,
  getManagementNavItem,
  type ManagementPageId,
} from '../config/managementNavigation'

type ManagementModulePageProps = {
  pageId: ManagementPageId
}

type ManagementOutletContext = {
  accessContext: UserAccessContext | null
}

type PageModule = ManagementModule & {
  endpoints: ManagementEndpoint[]
}

function buildPageModules(
  pageId: ManagementPageId,
  permissions: string[],
  isSuperAdmin: boolean,
) {
  const page = getManagementNavItem(pageId)
  if (!page) {
    return []
  }

  const endpointIds = new Set(page.endpointIds)
  const moduleIds = new Set(page.moduleIds)

  return managementModules.reduce<PageModule[]>((list, module) => {
    if (!moduleIds.has(module.id)) {
      return list
    }

    const endpoints = module.endpoints.filter((endpoint) => {
      if (!endpointIds.has(endpoint.id)) {
        return false
      }

      return (
        isSuperAdmin ||
        !endpoint.permission ||
        permissions.includes(endpoint.permission)
      )
    })

    if (endpoints.length > 0) {
      list.push({ ...module, endpoints })
    }

    return list
  }, [])
}

function ManagementModulePage({ pageId }: ManagementModulePageProps) {
  const { accessContext } = useOutletContext<ManagementOutletContext>()
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

  const permissions = accessContext.permissions ?? []
  const isSuperAdmin = Boolean(accessContext.isSuperAdmin)

  if (!canAccessManagementItem(page, permissions, isSuperAdmin)) {
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

  const Icon = page.icon
  const modules = buildPageModules(page.id, permissions, isSuperAdmin)
  const endpointCount = modules.reduce((total, module) => total + module.endpoints.length, 0)

  return (
    <div className="mgmt-page">
      <section className="mgmt-module-shell">
        <header className="mgmt-module-header">
          <div className="mgmt-module-heading">
            <span className="mgmt-module-icon">
              <Icon aria-hidden="true" />
            </span>
            <div>
              <p className="mgmt-kicker">TRANG QUẢN LÝ</p>
              <h2>{page.label}</h2>
              <p>{page.description}</p>
            </div>
          </div>

          <div className="mgmt-module-summary">
            <span>{endpointCount} API khả dụng</span>
            <strong>{page.requiredPermissions.length || 'Tổng quan'} quyền yêu cầu</strong>
          </div>
        </header>

        {modules.length > 0 ? (
          <div className="mgmt-module-workgrid">
            {modules.map((module) => (
              <article className="mgmt-module-workcard" key={module.id}>
                <header>
                  <span>{module.endpoints.length} endpoint</span>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </header>

                <div className="mgmt-admin-endpoint-list">
                  {module.endpoints.map((endpoint) => (
                    <div className="mgmt-admin-endpoint-row" key={endpoint.id}>
                      <span className={`mgmt-method-tag method-${endpoint.method.toLowerCase()}`}>
                        {endpoint.method}
                      </span>
                      <code>{endpoint.path}</code>
                      <small>{endpoint.permission ?? endpoint.controller}</small>
                      {endpoint.note && <em>{endpoint.note}</em>}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mgmt-module-empty">
            <strong>Chưa có API danh sách phù hợp để dựng bảng quản lý.</strong>
            <p>
              Trang này đã có vị trí trong sidebar. Giai đoạn sau sẽ bổ sung endpoint
              list/search hoặc form thao tác theo đúng module.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default ManagementModulePage
