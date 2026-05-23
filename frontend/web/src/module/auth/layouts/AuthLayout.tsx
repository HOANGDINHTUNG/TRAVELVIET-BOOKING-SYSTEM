import { Outlet } from 'react-router-dom'
import { AuthExperience } from '../components/AuthExperience/AuthExperience'

function AuthLayout() {
  return (
    <>
      <AuthExperience />
      <Outlet />
    </>
  )
}

export default AuthLayout
