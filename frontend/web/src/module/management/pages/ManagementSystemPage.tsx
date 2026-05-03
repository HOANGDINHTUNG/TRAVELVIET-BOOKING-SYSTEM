import { useOutletContext } from 'react-router-dom'
import type { UserAccessContext } from '../../auth/api/authApi'
import PermissionsManagementPage from './system/PermissionsManagementPage'
import RolesManagementPage from './system/RolesManagementPage'
import UsersManagementPage from './system/UsersManagementPage'
import { PageGate, type SystemPageId } from './system/systemShared'

type ManagementSystemPageProps = {
  pageId: SystemPageId
}

type ManagementOutletContext = {
  accessContext: UserAccessContext | null
}

function ManagementSystemPage({ pageId }: ManagementSystemPageProps) {
  const { accessContext } = useOutletContext<ManagementOutletContext>()

  return (
    <PageGate accessContext={accessContext} pageId={pageId}>
      {(checkedAccessContext) => {
        if (pageId === 'users') {
          return <UsersManagementPage accessContext={checkedAccessContext} />
        }

        if (pageId === 'roles') {
          return <RolesManagementPage accessContext={checkedAccessContext} />
        }

        return <PermissionsManagementPage />
      }}
    </PageGate>
  )
}

export default ManagementSystemPage
