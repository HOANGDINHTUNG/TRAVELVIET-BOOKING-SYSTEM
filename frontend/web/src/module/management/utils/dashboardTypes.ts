import type { QuickCheckItem } from '../config/managementCatalog'
import type { filterModulesByRole } from '../config/managementCatalog'
import type { ManagerRoleProfile } from '../config/managementRoles'

export type CheckStatus = 'idle' | 'loading' | 'success' | 'error'

export type CheckState = {
  status: CheckStatus
  detail: string
}

export type RoleModules = ReturnType<typeof filterModulesByRole>

export type QuickChecksPanelProps = {
  checks: QuickCheckItem[]
  checkStates: Record<string, CheckState>
  onRunCheck: (item: QuickCheckItem) => void
  onRunAllChecks: () => void
}

export type RoleDashboardProps = QuickChecksPanelProps & {
  modules: RoleModules
  roleProfile: ManagerRoleProfile
  permissionCount: number
  userRoles: string
}
