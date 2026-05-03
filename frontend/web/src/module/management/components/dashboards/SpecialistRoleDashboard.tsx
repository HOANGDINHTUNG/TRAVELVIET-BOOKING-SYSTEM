import {
  ClipboardCheck,
  Database,
  LockKeyhole,
  PlayCircle,
  Route,
  Search,
} from 'lucide-react'
import {
  specialistRoleDashboards,
  type SpecialistRoleCode,
} from '../../config/managementDashboardConfig'
import { EndpointRows, FocusGrid } from '../EndpointCards'
import OperationsControlPanel from '../OperationsControlPanel'
import QuickChecksPanel from '../QuickChecksPanel'
import ReviewModerationPanel from '../ReviewModerationPanel'
import ScheduleChatControlPanel from '../ScheduleChatControlPanel'
import SupportOperationsPanel from '../SupportOperationsPanel'
import { getEndpointCount, getMethodCounts } from '../../utils/dashboardUtils'
import type { RoleDashboardProps } from '../../utils/dashboardTypes'

type SpecialistRoleDashboardProps = RoleDashboardProps & {
  roleCode: SpecialistRoleCode
}

function SpecialistRoleDashboard({
  roleCode,
  modules,
  checks,
  checkStates,
  onRunCheck,
  onRunAllChecks,
  roleProfile,
  permissionCount,
  userRoles,
}: SpecialistRoleDashboardProps) {
  const config = specialistRoleDashboards[roleCode]
  const endpointCount = getEndpointCount(modules)
  const visibleMethods = Object.entries(getMethodCounts(modules))

  const stats = [
    {
      label: 'Role',
      value: roleProfile.label,
      detail: roleProfile.summary,
      icon: LockKeyhole,
    },
    {
      label: 'Modules',
      value: modules.length.toString(),
      detail: 'Khu vực được phép thao tác',
      icon: Database,
    },
    {
      label: 'Endpoints',
      value: endpointCount.toString(),
      detail: `${permissionCount} seed permissions`,
      icon: Route,
    },
    {
      label: 'Quick checks',
      value: checks.length.toString(),
      detail: 'Endpoint GET co the test token nhanh',
      icon: PlayCircle,
    },
  ]

  return (
    <div className={`mgmt-page mgmt-role-page role-${roleCode.toLowerCase().replace('_', '-')}`}>
      <section className="mgmt-role-hero">
        <div className="mgmt-role-hero-copy">
          <p className="mgmt-kicker">{config.kicker}</p>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
          <div className="mgmt-super-actions">
            <button type="button" className="mgmt-primary-btn" onClick={onRunAllChecks}>
              <PlayCircle aria-hidden="true" />
              {config.primaryAction}
            </button>
            <a className="mgmt-secondary-btn" href={`#${roleCode.toLowerCase()}-workbench`}>
              <ClipboardCheck aria-hidden="true" />
              Workbench
            </a>
            <a className="mgmt-secondary-btn" href={`#${roleCode.toLowerCase()}-api`}>
              <Search aria-hidden="true" />
              API list
            </a>
          </div>
        </div>

        <aside className="mgmt-role-side-panel">
          <span>{roleProfile.domain}</span>
          <strong>{roleProfile.code}</strong>
          <small>Vai trò hiện tại: {userRoles}</small>
          <div className="mgmt-role-method-strip">
            {visibleMethods.map(([method, count]) => (
              <span className={`mgmt-method-tag method-${method.toLowerCase()}`} key={method}>
                {method}: {count}
              </span>
            ))}
          </div>
        </aside>
      </section>

      <section className="mgmt-role-stat-grid" aria-label={`${roleProfile.label} overview`}>
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <article className="mgmt-role-stat" key={item.label}>
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          )
        })}
      </section>

      <section className="mgmt-role-workbench" id={`${roleCode.toLowerCase()}-workbench`}>
        <article className="mgmt-role-panel">
          <div className="mgmt-section-title">
            <h3>Không gian làm việc</h3>
            <p>Các card chỉ hiện API mà role này có quyền truy cập.</p>
          </div>

          <FocusGrid
            items={config.focus}
            modules={modules}
            cardClassName="mgmt-role-focus"
            gridClassName="mgmt-role-focus-grid"
            headClassName="mgmt-role-focus-head"
          />
        </article>

        <article className="mgmt-role-panel">
          <div className="mgmt-section-title">
            <h3>Thứ tự làm việc</h3>
            <p>Danh sách thao tác nên đặt lên đầu giao diện cho role này.</p>
          </div>

          <ol className="mgmt-role-routine-list">
            {config.routines.map((routine) => (
              <li key={routine}>{routine}</li>
            ))}
          </ol>
        </article>
      </section>

      {roleCode === 'OPERATOR' && <OperationsControlPanel enableNotification={false} />}

      {roleCode === 'OPERATOR' && <ReviewModerationPanel enableModeration={false} />}

      {(roleCode === 'OPERATOR' || roleCode === 'FIELD_STAFF') && (
        <ScheduleChatControlPanel enableUpdate={roleCode === 'OPERATOR'} />
      )}

      {roleCode === 'OPERATOR' && <SupportOperationsPanel />}

      <section className="mgmt-section" id={`${roleCode.toLowerCase()}-api`}>
        <div className="mgmt-section-title">
          <h3>{roleProfile.label} API Map</h3>
          <p>Endpoint theo module để tiếp tục tách thành bảng, form và nút action riêng.</p>
        </div>

        <div className="mgmt-role-api-grid">
          {modules.map((module) => (
            <article className="mgmt-role-api-card" key={module.id}>
              <header>
                <strong>{module.title}</strong>
                <span>{module.endpoints.length} endpoints</span>
              </header>
              <p>{module.description}</p>
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

export default SpecialistRoleDashboard
