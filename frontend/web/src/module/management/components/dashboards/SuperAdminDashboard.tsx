import {
  Activity,
  AlertTriangle,
  ClipboardCheck,
  Database,
  LockKeyhole,
  PlayCircle,
  Route,
  Search,
  ShieldCheck,
} from 'lucide-react'
import {
  superAdminCommands,
  superAdminLanes,
} from '../../config/managementDashboardConfig'
import QuickChecksPanel from '../QuickChecksPanel'
import PromotionCommercePanel from '../PromotionCommercePanel'
import ReviewModerationPanel from '../ReviewModerationPanel'
import ScheduleChatControlPanel from '../ScheduleChatControlPanel'
import SystemGovernancePanel from '../SystemGovernancePanel'
import { getEndpointCount, getMethodCounts } from '../../utils/dashboardUtils'
import type { RoleDashboardProps } from '../../utils/dashboardTypes'

function SuperAdminDashboard({
  modules,
  checks,
  checkStates,
  onRunCheck,
  onRunAllChecks,
  roleProfile,
  permissionCount,
  userRoles,
}: RoleDashboardProps) {
  const endpointCount = getEndpointCount(modules)
  const methodCounts = getMethodCounts(modules)
  const protectedEndpointCount = modules.reduce(
    (total, module) =>
      total + module.endpoints.filter((endpoint) => endpoint.permission).length,
    0,
  )

  const stats = [
    {
      label: 'Scope',
      value: 'Full system',
      detail: roleProfile.summary,
      icon: LockKeyhole,
    },
    {
      label: 'Modules',
      value: modules.length.toString(),
      detail: 'Vùng nghiệp vụ đang quản lý',
      icon: Database,
    },
    {
      label: 'Endpoints',
      value: endpointCount.toString(),
      detail: `${protectedEndpointCount} endpoint có permission`,
      icon: Route,
    },
    {
      label: 'Checks',
      value: checks.length.toString(),
      detail: 'Bài test nhanh cho token hiện tại',
      icon: ClipboardCheck,
    },
  ]

  return (
    <div className="mgmt-page mgmt-super-page">
      <section className="mgmt-super-hero">
        <div className="mgmt-super-hero-copy">
          <p className="mgmt-kicker">SUPER ADMIN COMMAND CENTER</p>
          <h2>Quản trị toàn hệ thống TravelViet</h2>
          <p>
            Màn hình này gồm các vùng cần thao tác thường xuyên: tài khoản,
            phân quyền, module nghiệp vụ, audit và kiểm tra API. Các thông tin
            được sắp xếp để nhìn nhanh trạng thái trước khi đi vào chi tiết.
          </p>
          <div className="mgmt-super-actions">
            <button type="button" className="mgmt-primary-btn" onClick={onRunAllChecks}>
              <PlayCircle aria-hidden="true" />
              Run security checks
            </button>
            <a className="mgmt-secondary-btn" href="#superadmin-modules">
              <Search aria-hidden="true" />
              View modules
            </a>
          </div>
        </div>

        <aside className="mgmt-super-profile">
          <span>{roleProfile.domain}</span>
          <strong>{permissionCount === 1 ? 'Full permissions' : `${permissionCount} seed permissions`}</strong>
          <small>Vai trò hiện tại: {userRoles}</small>
        </aside>
      </section>

      <section className="mgmt-super-stat-grid" aria-label="Super admin overview">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <article className="mgmt-super-stat" key={item.label}>
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          )
        })}
      </section>

      <section className="mgmt-super-workspace">
        <article className="mgmt-super-panel">
          <div className="mgmt-section-title">
            <h3>Tác vụ ưu tiên</h3>
            <p>Những nhóm thao tác Super Admin cần nhìn thấy đầu tiên.</p>
          </div>

          <div className="mgmt-command-list">
            {superAdminCommands.map((item) => {
              const Icon = item.icon
              return (
                <button className={`mgmt-command-item tone-${item.tone}`} key={item.title} type="button">
                  <Icon aria-hidden="true" />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                </button>
              )
            })}
          </div>
        </article>

        <article className="mgmt-super-panel">
          <div className="mgmt-section-title">
            <h3>Luôn kiểm soát</h3>
            <p>Quy trình đọc từ trên xuống để không bỏ sót vùng quan trọng.</p>
          </div>

          <div className="mgmt-governance-lanes">
            {superAdminLanes.map((lane) => (
              <div className="mgmt-governance-lane" key={lane.title}>
                <strong>{lane.title}</strong>
                {lane.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </article>
      </section>

      <SystemGovernancePanel />

      <PromotionCommercePanel />

      <ReviewModerationPanel />

      <ScheduleChatControlPanel />

      <section className="mgmt-section" id="superadmin-modules">
        <div className="mgmt-section-title">
          <h3>Module coverage</h3>
          <p>Toàn bộ khu vực backend mà Super Admin có thể quan sát và điều phối.</p>
        </div>

        <div className="mgmt-module-table">
          {modules.map((module) => {
            const moduleMethods = getMethodCounts([module])

            return (
              <article className="mgmt-module-row" key={module.id}>
                <div>
                  <strong>{module.title}</strong>
                  <p>{module.description}</p>
                </div>
                <div className="mgmt-module-methods">
                  {Object.entries(moduleMethods).map(([method, count]) => (
                    <span className={`mgmt-method-tag method-${method.toLowerCase()}`} key={method}>
                      {method} {count}
                    </span>
                  ))}
                </div>
                <small>{module.endpoints.length} endpoints</small>
              </article>
            )
          })}
        </div>

        <div className="mgmt-method-summary" aria-label="Endpoint method summary">
          {Object.entries(methodCounts).map(([method, count]) => (
            <span className={`mgmt-method-tag method-${method.toLowerCase()}`} key={method}>
              {method}: {count}
            </span>
          ))}
        </div>
      </section>

      <section className="mgmt-section">
        <div className="mgmt-section-title">
          <h3>Rủi ro cần theo dõi</h3>
          <p>Những khu vực nên được ưu tiên khi mở dashboard mỗi ngày.</p>
        </div>

        <div className="mgmt-risk-grid">
          <article>
            <AlertTriangle aria-hidden="true" />
            <strong>Role thay đổi bất thường</strong>
            <p>Kiểm tra audit log sau mỗi lần cấp role, khóa tài khoản hoặc sửa permission.</p>
          </article>
          <article>
            <Activity aria-hidden="true" />
            <strong>Endpoint lỗi liên tục</strong>
            <p>Chạy quick checks để tách lỗi token, lỗi policy và lỗi service.</p>
          </article>
          <article>
            <ShieldCheck aria-hidden="true" />
            <strong>Quyền nhạy cảm</strong>
            <p>Tập trung vào user.*, role.*, permission.*, refund.* và audit.view.</p>
          </article>
        </div>
      </section>

      <QuickChecksPanel
        checks={checks}
        checkStates={checkStates}
        onRunCheck={onRunCheck}
        onRunAllChecks={onRunAllChecks}
      />
    </div>
  )
}

export default SuperAdminDashboard
