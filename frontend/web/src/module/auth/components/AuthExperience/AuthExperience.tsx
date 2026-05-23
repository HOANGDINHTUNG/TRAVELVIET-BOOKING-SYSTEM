import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, MapPinned, ShieldCheck, Sparkles } from 'lucide-react'
import {
  hasManagerRole,
  selectCurrentUser,
  selectIsAuthenticated,
  useAuthStore,
} from '../../../../stores/authStore'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useAuthTabIndicator } from './useAuthTabIndicator'
import '../../styles/auth-tokens.css'
import './auth-experience.css'

export type AuthMode = 'login' | 'register'

function readRedirectFrom(state: unknown): string {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof (state as { from: unknown }).from === 'string'
  ) {
    return (state as { from: string }).from
  }
  return ''
}

export function AuthExperience() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('auth')
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const currentUser = useAuthStore(selectCurrentUser)

  const routeMode: AuthMode = location.pathname.includes('register')
    ? 'register'
    : 'login'
  const [mode, setMode] = useState<AuthMode>(routeMode)
  const [shake, setShake] = useState(false)
  const tabListRef = useRef<HTMLDivElement>(null)
  const [slideDir, setSlideDir] = useState(0)
  const indicator = useAuthTabIndicator(tabListRef, mode)

  const redirectFrom = readRedirectFrom(location.state)
  const fallbackRedirect = hasManagerRole(currentUser)
    ? '/management/dashboard'
    : '/'
  const targetRedirect = redirectFrom || fallbackRedirect

  useEffect(() => {
    setMode(routeMode)
  }, [routeMode])

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(targetRedirect, { replace: true })
    }
  }, [isAuthenticated, currentUser, navigate, targetRedirect])

  const switchMode = useCallback(
    (next: AuthMode) => {
      if (next === mode) return
      setSlideDir(next === 'register' ? 1 : -1)
      setMode(next)
      const path = next === 'login' ? '/login' : '/register'
      navigate(path, { replace: true, state: { from: redirectFrom } })
    },
    [mode, navigate, redirectFrom],
  )

  const triggerShake = useCallback(() => {
    setShake(true)
    window.setTimeout(() => setShake(false), 520)
  }, [])

  const isLogin = mode === 'login'

  return (
    <section
      className="auth-liquid"
      data-accent="indigo"
      aria-labelledby="auth-panel-title"
    >
      <div className="auth-liquid-bg" aria-hidden="true">
        <span className="auth-orb auth-orb--one" />
        <span className="auth-orb auth-orb--two" />
        <span className="auth-orb auth-orb--three" />
      </div>

      <header className="auth-liquid-topbar">
        <Link className="auth-brand-link" to="/" aria-label="TravelViet home">
          <ArrowLeft aria-hidden="true" />
          <span>TravelViet</span>
        </Link>
      </header>

      <div className="auth-liquid-shell">
        <aside className="auth-liquid-visual" aria-hidden="true">
          <span className="auth-visual-ring">
            <MapPinned />
          </span>
          <p className="auth-visual-kicker">{t('visual.kicker')}</p>
          <h2 className="auth-visual-title">
            {isLogin ? t('visual.loginTitle') : t('visual.registerTitle')}
          </h2>
          <dl className="auth-visual-stats">
            <dt>{isLogin ? t('visual.statTours') : t('visual.statOffers')}</dt>
            <dd>{isLogin ? '48+' : '12'}</dd>
            <dt>
              {isLogin ? t('visual.statDestinations') : t('visual.statSupport')}
            </dt>
            <dd>{isLogin ? '23' : '24/7'}</dd>
          </dl>
          <span className="auth-visual-chip auth-visual-chip--one">
            <Sparkles aria-hidden="true" />
            {isLogin ? t('visual.badgeOneLogin') : t('visual.badgeOneRegister')}
          </span>
          <span className="auth-visual-chip auth-visual-chip--two">
            <ShieldCheck aria-hidden="true" />
            {isLogin ? t('visual.badgeTwoLogin') : t('visual.badgeTwoRegister')}
          </span>
        </aside>

        <div
          className={`auth-liquid-card ${shake ? 'auth-liquid-card--shake' : ''}`}
          data-auth-mode={mode}
        >
          <header className="auth-card-head">
            <h1 id="auth-panel-title" className="auth-card-sr-title">
              {isLogin ? t('tabs.login') : t('tabs.register')}
            </h1>
            <p className="auth-card-eyebrow">
              {isLogin ? t('heading.loginEyebrow') : t('heading.registerEyebrow')}
            </p>
            <p className="auth-card-lead">
              {isLogin ? t('heading.loginLead') : t('heading.registerLead')}
            </p>
          </header>

          <div className="auth-tabs" ref={tabListRef} role="tablist" aria-label="Auth">
            <span
              className="auth-tabs-indicator"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.width > 0 ? 1 : 0,
              }}
              aria-hidden="true"
            />
            <button
              type="button"
              role="tab"
              data-auth-tab="login"
              aria-selected={isLogin}
              className={`auth-tab ${isLogin ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('login')}
            >
              {t('tabs.login')}
            </button>
            <button
              type="button"
              role="tab"
              data-auth-tab="register"
              aria-selected={!isLogin}
              className={`auth-tab ${!isLogin ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('register')}
            >
              {t('tabs.register')}
            </button>
          </div>

          <div className="auth-form-viewport" data-auth-mode={mode}>
            <AnimatePresence mode="wait" initial={false} custom={slideDir}>
              <motion.div
                key={mode}
                className="auth-form-slide"
                custom={slideDir}
                variants={{
                  enter: (dir: number) => ({
                    opacity: 0,
                    x: dir >= 0 ? 20 : -20,
                  }),
                  center: { opacity: 1, x: 0 },
                  exit: (dir: number) => ({
                    opacity: 0,
                    x: dir >= 0 ? -20 : 20,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                {isLogin ? (
                  <LoginForm
                    redirectTo={targetRedirect}
                    onShake={triggerShake}
                  />
                ) : (
                  <RegisterForm
                    redirectTo={targetRedirect}
                    onShake={triggerShake}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="auth-card-footer">
            {isLogin ? (
              <>
                {t('form.noAccount')}{' '}
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => switchMode('register')}
                >
                  {t('form.createAccount')}
                </button>
              </>
            ) : (
              <>
                {t('form.hasAccount')}{' '}
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => switchMode('login')}
                >
                  {t('form.signInLink')}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}

export default AuthExperience
