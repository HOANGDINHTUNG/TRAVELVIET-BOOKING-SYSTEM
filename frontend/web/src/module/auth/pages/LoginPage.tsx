import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { loginWithPassword, persistAuthSession } from '../api/authApi'
import './AuthPage.css'

type AlertState =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null

const REMEMBER_EMAIL_KEY = 'travelviet-remember-email'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberEmail, setRememberEmail] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<AlertState>(null)

  useEffect(() => {
    try {
      const remembered = window.localStorage.getItem(REMEMBER_EMAIL_KEY)

      if (remembered) {
        setEmail(JSON.parse(remembered) as string)
        setRememberEmail(true)
      }
    } catch {
      window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAlert(null)

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password.trim()) {
      setAlert({
        type: 'error',
        message: 'Vui lòng nhập đầy đủ email và mật khẩu.',
      })
      return
    }

    setLoading(true)

    try {
      const auth = await loginWithPassword({
        login: trimmedEmail,
        passwordHash: password,
      })

      persistAuthSession(auth)

      if (rememberEmail) {
        window.localStorage.setItem(REMEMBER_EMAIL_KEY, JSON.stringify(trimmedEmail))
      } else {
        window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }

      setAlert({
        type: 'success',
        message: 'Đăng nhập thành công! Đang chuyển hướng...',
      })

      window.setTimeout(() => navigate('/'), 800)
    } catch (error) {
      setAlert({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page auth-page-login">
      <div className="auth-topbar">
        <Link className="auth-home-link" to="/" aria-label="Về trang chủ">
          <ArrowLeft aria-hidden="true" />
          TravelViet
        </Link>
        <Link className="auth-switch-link" to="/register">
          <UserPlus aria-hidden="true" />
          Đăng ký
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

        <form className="auth-panel" onSubmit={handleSubmit}>
          <span className="auth-icon">
            <LogIn aria-hidden="true" />
          </span>
          <div className="auth-heading">
            <p>Chào mừng trở lại</p>
            <h1>Đăng nhập</h1>
          </div>

          {alert && (
            <div className={`auth-alert auth-alert-${alert.type}`} role="status">
              {alert.message}
            </div>
          )}

          <label className="auth-field">
            <span>Email</span>
            <span className="auth-input-wrap">
              <Mail aria-hidden="true" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </span>
          </label>
          <label className="auth-field">
            <span>Mật khẩu</span>
            <span className="auth-input-wrap">
              <LockKeyhole aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <button
                className="auth-input-action"
                type="button"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
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
              />
              <span>Ghi nhớ email</span>
            </label>
            <span className="auth-muted-action">Quên mật khẩu?</span>
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          <p className="auth-inline-switch">
            Chưa có tài khoản?
            <Link to="/register"> Tạo tài khoản</Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
