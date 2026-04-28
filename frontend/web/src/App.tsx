import { lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { FloatingUtilities } from './components/FloatingUtilities/FloatingUtilities'
import { useAppSelector } from './hooks/reduxHooks'
import SmoothScrollLayout from './components/common/ux/SmoothScrollLayout'
import ScrollToTop from './components/common/ux/ScrollToTop'

const Navbar = lazy(() =>
  import('./components/Navbar/Navbar').then((module) => ({
    default: module.Navbar,
  })),
)
const SiteMotion = lazy(() =>
  import('./components/Motion/SiteMotion').then((module) => ({
    default: module.SiteMotion,
  })),
)

function App() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const { theme, language } = useAppSelector((state) => state.preferences)
  const isHomePage = location.pathname === '/'
  const isManagementPage = location.pathname.startsWith('/management')

  useEffect(() => {
    document.documentElement.lang = language
    void i18n.changeLanguage(language)
  }, [i18n, language])

  return (
    <div className={`app-shell theme-${theme} lang-${language} min-h-screen`}>
      <ScrollToTop />
      {isHomePage && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}
      {isHomePage ? (
        <main className="min-h-screen">
          <div id="smooth-wrapper">
            <div id="smooth-content">
              <Outlet />
            </div>
          </div>
        </main>
      ) : isManagementPage ? (
        <main className="min-h-screen">
          <Outlet />
        </main>
      ) : (
        <SmoothScrollLayout ease={0.08}>
          <main className="min-h-screen">
            <Outlet />
          </main>
        </SmoothScrollLayout>
      )}
      {isHomePage && (
        <Suspense fallback={null}>
          <SiteMotion />
        </Suspense>
      )}
      {!isManagementPage && <FloatingUtilities />}
    </div>
  )
}

export default App
