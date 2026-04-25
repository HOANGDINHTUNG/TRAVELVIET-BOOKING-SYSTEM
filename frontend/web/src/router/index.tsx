import { createElement, lazy, Suspense } from 'react'
import type { ReactElement } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'

const lazyHomePage = lazy(() => import('../module/home/pages/HomePage'))
const lazyAuthLayout = lazy(() => import('../module/auth/feature/layout/AuthLayout'))
const lazyLoginPage = lazy(() => import('../module/auth/pages/LoginPage'))
const lazyRegisterPage = lazy(() => import('../module/auth/pages/RegisterPage'))
const lazyNotFoundPage = lazy(() => import('../components/error/NotFoundPage'))
const lazyRequireManagerAccess = lazy(
  () => import('../module/management/feature/RequireManagerAccess'),
)
const lazyManagementLayout = lazy(
  () => import('../module/management/feature/layout/ManagementLayout'),
)
const lazyManagementHubPage = lazy(
  () => import('../module/management/pages/ManagementHubPage'),
)

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<div className="min-h-screen">Đang tải...</div>}>
    {element}
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: withSuspense(createElement(lazyNotFoundPage)),
    children: [
      { index: true, element: withSuspense(createElement(lazyHomePage)) },
      {
        element: withSuspense(createElement(lazyAuthLayout)),
        children: [
          { path: 'login', element: withSuspense(createElement(lazyLoginPage)) },
          { path: 'register', element: withSuspense(createElement(lazyRegisterPage)) },
        ],
      },
      {
        element: withSuspense(createElement(lazyRequireManagerAccess)),
        children: [
          {
            path: 'management',
            element: withSuspense(createElement(lazyManagementLayout)),
            children: [
              { index: true, element: withSuspense(createElement(lazyManagementHubPage)) },
              {
                path: ':roleCode',
                element: withSuspense(createElement(lazyManagementHubPage)),
              },
            ],
          },
        ],
      },
      { path: '*', element: withSuspense(createElement(lazyNotFoundPage)) },
    ],
  },
])

export default router
