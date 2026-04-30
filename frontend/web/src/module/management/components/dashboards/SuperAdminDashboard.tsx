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
      detail: 'Vung nghiep vu dang quan ly',
      icon: Database,
    },
    {
      label: 'Endpoints',
      value: endpointCount.toString(),
      detail: `${protectedEndpointCount} endpoint co permission`,
      icon: Route,
    },
    {
      label: 'Checks',
      value: checks.length.toString(),
      detail: 'Bai test nhanh cho token hien tai',
      icon: ClipboardCheck,
    },
  ]

  return (
    <div className="mgmt-page mgmt-super-page">
      <section className="mgmt-super-hero">
        <div className="mgmt-super-hero-copy">
          <p className="mgmt-kicker">SUPER ADMIN COMMAND CENTER</p>
          <h2>Quan tri toan he thong TravelViet</h2>
          <p>
            Man hinh nay gom cac vung can thao tac thuong xuyen: tai khoan,
            phan quyen, module nghiep vu, audit va kiem tra API. Cac thong tin
            duoc sap xep de nhin nhanh trang thai truoc khi di vao chi tiet.
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
          <small>Current user roles: {userRoles}</small>
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
            <h3>Tac vu uu tien</h3>
            <p>Nhung nhom thao tac superadmin can nhin thay dau tien.</p>
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
            <h3>Luon kiem soat</h3>
            <p>Quy trinh doc tu tren xuong de khong bo sot vung quan trong.</p>
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
          <p>Toan bo khu vuc backend ma Super Admin co the quan sat va dieu phoi.</p>
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
          <h3>Rui ro can theo doi</h3>
          <p>Nhung khu vuc nen duoc uu tien khi mo dashboard moi ngay.</p>
        </div>

        <div className="mgmt-risk-grid">
          <article>
            <AlertTriangle aria-hidden="true" />
            <strong>Role thay doi bat thuong</strong>
            <p>Kiem tra audit log sau moi lan cap role, khoa tai khoan, hoac sua permission.</p>
          </article>
          <article>
            <Activity aria-hidden="true" />
            <strong>Endpoint loi lien tuc</strong>
            <p>Chay quick checks de tach loi token, loi policy va loi service.</p>
          </article>
          <article>
            <ShieldCheck aria-hidden="true" />
            <strong>Quyen nhay cam</strong>
            <p>Tap trung vao user.*, role.*, permission.*, refund.* va audit.view.</p>
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
