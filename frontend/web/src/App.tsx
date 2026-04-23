import { lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { FloatingUtilities } from './components/FloatingUtilities/FloatingUtilities'
import { useAppSelector } from './hooks/redux'

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

  useEffect(() => {
    document.documentElement.lang = language
    void i18n.changeLanguage(language)
  }, [i18n, language])

  return (
    <main
      className={`app-shell theme-${theme} lang-${language} min-h-screen`}
    >
      {isHomePage && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}
      {isHomePage ? (
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <Outlet />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
      <Suspense fallback={null}>
        <SiteMotion />
      </Suspense>
      <FloatingUtilities />
    </main>
  )
}

export default App
