import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPinned,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
} from 'lucide-react'
import {
  getStoredAccessToken,
  getStoredAuthUser,
  persistAuthSession,
  registerWithPassword,
  resolvePostAuthRedirect,
} from '../api/authApi'
import './AuthPage.css'

type AlertState =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null

function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<AlertState>(null)
  const redirectFrom =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof location.state.from === 'string'
      ? location.state.from
      : ''

  useEffect(() => {
    const storedToken = getStoredAccessToken()
    const storedUser = getStoredAuthUser()
    if (storedToken && storedUser) {
      navigate(redirectFrom || resolvePostAuthRedirect(storedUser), { replace: true })
    }
  }, [navigate, redirectFrom])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAlert(null)

    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedFullName || !trimmedEmail || !password.trim()) {
      setAlert({
        type: 'error',
        message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.',
      })
      return
    }

    if (password.length < 8) {
      setAlert({
        type: 'error',
        message: 'Mật khẩu phải có ít nhất 8 ký tự.',
      })
      return
    }

    setLoading(true)

    try {
      const auth = await registerWithPassword({
        fullName: trimmedFullName,
        email: trimmedEmail,
        passwordHash: password,
      })

      persistAuthSession(auth)

      setAlert({
        type: 'success',
        message: 'Đăng ký thành công! Đang chuyển về trang chủ...',
      })

      window.setTimeout(
        () => navigate(redirectFrom || resolvePostAuthRedirect(auth.user)),
        900,
      )
    } catch (error) {
      setAlert({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page auth-page-register">
      <div className="auth-topbar">
        <Link className="auth-home-link" to="/" aria-label="Về trang chủ">
          <ArrowLeft aria-hidden="true" />
          TravelViet
        </Link>
        <Link className="auth-switch-link" to="/login" state={{ from: redirectFrom }}>
          <UserRound aria-hidden="true" />
          Đăng nhập
        </Link>
      </div>

      <div className="auth-shell">
        <aside className="auth-visual" aria-hidden="true">
          <span className="auth-visual-icon">
            <MapPinned />
          </span>
          <p className="auth-kicker">TravelViet</p>
          <h2>Lập kế hoạch nhanh hơn với hồ sơ du lịch của bạn.</h2>
          <div className="auth-visual-grid">
            <span>Ưu đãi thành viên</span>
            <strong>12</strong>
            <span>Hỗ trợ</span>
            <strong>24/7</strong>
          </div>
          <span className="auth-floating-badge auth-floating-badge-one">
            <Sparkles />
            Gợi ý thông minh
          </span>
          <span className="auth-floating-badge auth-floating-badge-two">
            <ShieldCheck />
            Lưu đặt tour an toàn
          </span>
        </aside>

        <form className="auth-panel" onSubmit={handleSubmit}>
          <span className="auth-icon">
            <UserPlus aria-hidden="true" />
          </span>
          <div className="auth-heading">
            <p>Bắt đầu hành trình</p>
            <h1>Đăng ký</h1>
          </div>

          {alert && (
            <div className={`auth-alert auth-alert-${alert.type}`} role="status">
              {alert.message}
            </div>
          )}

          <label className="auth-field">
            <span>Họ tên</span>
            <span className="auth-input-wrap">
              <UserRound aria-hidden="true" />
              <input
                type="text"
                name="fullName"
                placeholder="Nhập họ tên"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
              />
            </span>
          </label>
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
                placeholder="Tạo mật khẩu"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
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

          <p className="auth-hint">
            Tối thiểu 8 ký tự. Nên dùng chữ hoa, chữ thường, số hoặc ký tự đặc
            biệt để bảo mật hơn.
          </p>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>
          <p className="auth-inline-switch">
            Đã có tài khoản?
            <Link to="/login"> Đăng nhập</Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default RegisterPage
