import { lazy, Suspense } from 'react'
import type { ReactElement } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'

const HomePage = lazy(() => import('../module/home/pages/HomePage'))
const AuthLayout = lazy(() => import('../module/auth/feature/layout/AuthLayout'))
const LoginPage = lazy(() => import('../module/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('../module/auth/pages/RegisterPage'))
const NotFoundPage = lazy(() => import('../components/error/NotFoundPage'))

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<div className="min-h-screen">Đang tải...</div>}>
    {element}
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: withSuspense(<NotFoundPage />),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      {
        element: withSuspense(<AuthLayout />),
        children: [
          { path: 'login', element: withSuspense(<LoginPage />) },
          { path: 'register', element: withSuspense(<RegisterPage />) },
        ],
      },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
])

export default router
