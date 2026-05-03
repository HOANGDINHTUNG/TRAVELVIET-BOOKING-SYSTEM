import {
  Activity,
  ClipboardCheck,
  Database,
  LockKeyhole,
  PlayCircle,
  Route,
  Search,
} from 'lucide-react'
import {
  adminFocusCards,
  adminWorkQueues,
} from '../../config/managementDashboardConfig'
import { EndpointRows, FocusGrid } from '../EndpointCards'
import OperationsControlPanel from '../OperationsControlPanel'
import PromotionCommercePanel from '../PromotionCommercePanel'
import QuickChecksPanel from '../QuickChecksPanel'
import ReviewModerationPanel from '../ReviewModerationPanel'
import ScheduleChatControlPanel from '../ScheduleChatControlPanel'
import SupportOperationsPanel from '../SupportOperationsPanel'
import SystemGovernancePanel from '../SystemGovernancePanel'
import {
  getCheckSummary,
  getEndpointCount,
  getMethodCounts,
} from '../../utils/dashboardUtils'
import type { RoleDashboardProps } from '../../utils/dashboardTypes'

function AdminDashboard({
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
  const checkSummary = getCheckSummary(
    checks.map((check) => check.id),
    checkStates,
  )

  const stats = [
    {
      label: 'Role scope',
      value: roleProfile.summary,
      detail: `${permissionCount} seed permissions`,
      icon: LockKeyhole,
    },
    {
      label: 'Modules',
      value: modules.length.toString(),
      detail: 'Vùng nghiệp vụ admin có quyền điều phối',
      icon: Database,
    },
    {
      label: 'Endpoints',
      value: endpointCount.toString(),
      detail: 'API được map theo controller hiện có',
      icon: Route,
    },
    {
      label: 'Health checks',
      value: checks.length.toString(),
      detail: `${checkSummary.success} pass, ${checkSummary.error} fail`,
      icon: Activity,
    },
  ]

  return (
    <div className="mgmt-page mgmt-admin-page">
      <section className="mgmt-admin-hero">
        <div className="mgmt-admin-hero-copy">
          <p className="mgmt-kicker">ADMIN OPERATIONS CONSOLE</p>
          <h2>Quản trị vận hành theo endpoint thực tế</h2>
          <p>
            Dashboard này gồm các khu vực admin cần dùng mỗi ngày: người dùng,
            điểm đến, tour, lịch khởi hành, booking, support và campaign. Các
            card bên dưới lấy trực tiếp từ catalog API để dễ đối chiếu với backend.
          </p>
          <div className="mgmt-super-actions">
            <button type="button" className="mgmt-primary-btn" onClick={onRunAllChecks}>
              <PlayCircle aria-hidden="true" />
              Run admin checks
            </button>
            <a className="mgmt-secondary-btn" href="#admin-workbench">
              <ClipboardCheck aria-hidden="true" />
              View workbench
            </a>
            <a className="mgmt-secondary-btn" href="#admin-endpoints">
              <Search aria-hidden="true" />
              API map
            </a>
          </div>
        </div>

        <aside className="mgmt-admin-status-panel">
          <span>{roleProfile.domain}</span>
          <strong>{roleProfile.label}</strong>
          <small>Vai trò hiện tại: {userRoles}</small>
          <div className="mgmt-admin-check-strip" aria-label="Admin check summary">
            <span>Idle {checkSummary.idle}</span>
            <span>Run {checkSummary.loading}</span>
            <span>Pass {checkSummary.success}</span>
            <span>Fail {checkSummary.error}</span>
          </div>
        </aside>
      </section>

      <section className="mgmt-admin-stat-grid" aria-label="Admin overview">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <article className="mgmt-admin-stat" key={item.label}>
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          )
        })}
      </section>

      <section className="mgmt-admin-workbench" id="admin-workbench">
        <article className="mgmt-admin-panel">
          <div className="mgmt-section-title">
            <h3>Tác vụ theo role Admin</h3>
            <p>Mỗi nhóm hiện endpoint đang có quyền dùng, không hiện API bị chặn bởi role.</p>
          </div>

          <FocusGrid
            items={adminFocusCards}
            modules={modules}
            cardClassName="mgmt-admin-focus"
            gridClassName="mgmt-admin-focus-grid"
            headClassName="mgmt-admin-focus-head"
          />
        </article>

        <article className="mgmt-admin-panel">
          <div className="mgmt-section-title">
            <h3>Hàng đợi vận hành</h3>
            <p>Cách sắp xếp màn hình chính cho admin khi bắt đầu ca làm.</p>
          </div>

          <div className="mgmt-admin-queue-list">
            {adminWorkQueues.map((item) => {
              const Icon = item.icon
              return (
                <div className="mgmt-admin-queue-item" key={item.title}>
                  <Icon aria-hidden="true" />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mgmt-admin-method-panel">
            <strong>HTTP coverage</strong>
            <div className="mgmt-method-summary" aria-label="Admin method summary">
              {Object.entries(methodCounts).map(([method, count]) => (
                <span className={`mgmt-method-tag method-${method.toLowerCase()}`} key={method}>
                  {method}: {count}
                </span>
              ))}
            </div>
          </div>
        </article>
      </section>

      <SystemGovernancePanel />

      <PromotionCommercePanel />

      <OperationsControlPanel />

      <ReviewModerationPanel />

      <ScheduleChatControlPanel />

      <SupportOperationsPanel />

      <section className="mgmt-section" id="admin-endpoints">
        <div className="mgmt-section-title">
          <h3>Admin API Map</h3>
          <p>Danh sách endpoint nên được dùng để lập các bảng, form và action tiếp theo.</p>
        </div>

        <div className="mgmt-admin-module-board">
          {modules.map((module) => (
            <article className="mgmt-admin-module-card" key={module.id}>
              <header>
                <span>{module.endpoints.length} endpoints</span>
                <h4>{module.title}</h4>
                <p>{module.description}</p>
              </header>

              <EndpointRows module={module} />
            </article>
          ))}
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

export default AdminDashboard
