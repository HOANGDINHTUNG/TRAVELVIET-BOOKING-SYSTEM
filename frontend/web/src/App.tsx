import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { AiChatBox } from './components/ai/AiChatBox'
import { FloatingUtilities } from './components/FloatingUtilities/FloatingUtilities'
import ScrollToTop from './components/common/ux/ScrollToTop'
import SmoothScrollLayout from './components/common/ux/SmoothScrollLayout'
import Header from './components/header/Header'
import { SiteMotion } from './components/Motion/SiteMotion'
import { LoginWelcomeAnimation } from './module/auth/components/LoginWelcome/LoginWelcomeAnimation'
import { useAppSelector } from './hooks/reduxHooks'

function App() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const { theme, language } = useAppSelector((state) => state.preferences)
  const isManagementPage = location.pathname.startsWith('/management')
  const isAuthPublicPage =
    location.pathname === '/login' || location.pathname === '/register'

  useEffect(() => {
    document.documentElement.lang = language
    void i18n.changeLanguage(language)
  }, [i18n, language])

  return (
    <div
      className={`app-shell theme-${theme} ${theme === 'dark' ? 'dark' : ''} lang-${language} min-h-screen`}
    >
      <ScrollToTop />
      {!isManagementPage && !isAuthPublicPage && <Header />}
      {isManagementPage ? (
        <main className="min-h-screen bg-transparent text-[var(--color-text)]">
          <Outlet />
        </main>
      ) : (
        <SmoothScrollLayout ease={0.08}>
          <main className="min-h-screen bg-[var(--color-page)] text-[var(--color-text)]">
            <div
              className={
                isAuthPublicPage
                  ? 'min-h-screen'
                  : 'min-h-[90vh] pt-13 md:pt-19'
              }
            >
              <Outlet />
            </div>
          </main>
        </SmoothScrollLayout>
      )}
      {!isManagementPage && <SiteMotion />}
      {!isManagementPage && (
        <>
          <AiChatBox />
          <FloatingUtilities />
        </>
      )}
      {!isAuthPublicPage ? <LoginWelcomeAnimation /> : null}
    </div>
  )
}

export default App
