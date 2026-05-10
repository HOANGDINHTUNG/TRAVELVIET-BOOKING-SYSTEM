import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
  MapPinned,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import {
  hasManagerRole,
  selectCurrentUser,
  selectIsAuthenticated,
  useAuthStore,
} from '../../../stores/authStore'
import { useLogin } from '../hooks/useAuthMutation'
import './AuthPage.css'

const REMEMBER_EMAIL_KEY = 'travelviet-remember-email'

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

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('auth')
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const currentUser = useAuthStore(selectCurrentUser)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberEmail, setRememberEmail] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const redirectFrom = readRedirectFrom(location.state)
  const fallbackRedirect = hasManagerRole(currentUser)
    ? '/management/dashboard'
    : '/'
  const targetRedirect = redirectFrom || fallbackRedirect

  const login = useLogin({
    redirectTo: targetRedirect,
    onAuthenticated: () => {
      const trimmedEmail = email.trim()
      if (rememberEmail && trimmedEmail) {
        window.localStorage.setItem(
          REMEMBER_EMAIL_KEY,
          JSON.stringify(trimmedEmail),
        )
      } else {
        window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }
    },
  })

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(targetRedirect, { replace: true })
      return
    }
    try {
      const remembered = window.localStorage.getItem(REMEMBER_EMAIL_KEY)
      if (remembered) {
        setEmail(JSON.parse(remembered) as string)
        setRememberEmail(true)
      }
    } catch {
      window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
    }
  }, [isAuthenticated, currentUser, navigate, targetRedirect])

  const isPending = login.isPending

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isPending) return

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password.trim()) {
      toast.error(
        String(
          t('missingFields', {
            defaultValue:
              'Vui lòng nhập đầy đủ email/SĐT và mật khẩu.',
          }),
        ),
      )
      return
    }

    login.mutate({
      login: trimmedEmail,
      passwordHash: password,
    })
  }

  return (
    <section className="auth-page auth-page-login">
      <div className="auth-topbar">
        <Link className="auth-home-link" to="/" aria-label="Về trang chủ">
          <ArrowLeft aria-hidden="true" />
          TravelViet
        </Link>
        <Link
          className="auth-switch-link"
          to="/register"
          state={{ from: redirectFrom }}
        >
          <UserPlus aria-hidden="true" />
          {String(t('form.createAccount', { defaultValue: 'Đăng ký' })).trim()}
        </Link>
      </div>

      <div className="auth-shell">
        <aside className="auth-visual" aria-hidden="true">
          <span className="auth-visual-icon">
            <MapPinned />
          </span>
          <p className="auth-kicker">TravelViet</p>
          <h2>Chuyến đi Việt Nam bắt đầu từ một tài khoản.</h2>
          <div className="auth-visual-grid">
            <span>Tour nổi bật</span>
            <strong>48+</strong>
            <span>Điểm đến</span>
            <strong>23</strong>
          </div>
          <span className="auth-floating-badge auth-floating-badge-one">
            <Sparkles />
            Lịch trình mềm mại
          </span>
          <span className="auth-floating-badge auth-floating-badge-two">
            <ShieldCheck />
            Bảo mật thông tin
          </span>
        </aside>

        <form className="auth-panel" onSubmit={handleSubmit} noValidate>
          <span className="auth-icon">
            <LogIn aria-hidden="true" />
          </span>
          <div className="auth-heading">
            <p>Chào mừng trở lại</p>
            <h1>
              {String(t('form.submit', { defaultValue: 'Đăng nhập' }))}
            </h1>
          </div>

          <label className="auth-field">
            <span>{String(t('form.loginLabel'))}</span>
            <span className="auth-input-wrap">
              <Mail aria-hidden="true" />
              <input
                type="text"
                name="login"
                placeholder={String(t('form.loginPlaceholder'))}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                disabled={isPending}
              />
            </span>
          </label>
          <label className="auth-field">
            <span>{String(t('form.passwordLabel'))}</span>
            <span className="auth-input-wrap">
              <LockKeyhole aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={String(t('form.passwordPlaceholder'))}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={isPending}
              />
              <button
                className="auth-input-action"
                type="button"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
                disabled={isPending}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </span>
          </label>

          <div className="auth-options">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(event) => setRememberEmail(event.target.checked)}
                disabled={isPending}
              />
              <span>{String(t('form.rememberLabel'))}</span>
            </label>
            <span className="auth-muted-action">
              {String(t('form.forgotPassword'))}
            </span>
          </div>

          <button className="auth-submit" type="submit" disabled={isPending}>
            {isPending
              ? String(t('form.submitting'))
              : String(t('form.submit'))}
          </button>
          <p className="auth-inline-switch">
            {String(t('form.noAccount'))}
            <Link to="/register">{String(t('form.createAccount'))}</Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
