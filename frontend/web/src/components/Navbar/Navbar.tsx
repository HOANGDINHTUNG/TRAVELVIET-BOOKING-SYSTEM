import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Languages,
  LogOut,
  Moon,
  SunMedium,
  UserCircle2,
  UserPlus,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { setLanguage, setTheme } from '../../stores/slices/preferencesSlice'
import './Navbar.css'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

type NavAuthUser = {
  fullName?: string
  displayName?: string
  email?: string
  phone?: string
  status?: string
  memberLevel?: string
  avatarUrl?: string | null
}

const AUTH_STORAGE_KEYS = [
  'travelviet-auth-token',
  'travelviet-refresh-token',
  'travelviet-user',
  'auth-token',
  'token',
] as const

const navItems = [
  { href: '#home', labelKey: 'nav.home' },
  { href: '#destinations', labelKey: 'nav.about' },
  { href: '#packages', labelKey: 'nav.pages' },
  { href: '#guide', labelKey: 'nav.blog' },
  { href: '#contact', labelKey: 'nav.contact' },
]

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawUser = window.localStorage.getItem('travelviet-user')
  const hasToken = Boolean(
    window.localStorage.getItem('travelviet-auth-token') ||
      window.localStorage.getItem('auth-token') ||
      window.localStorage.getItem('token'),
  )

  if (!rawUser) {
    return hasToken ? {} : null
  }

  try {
    return JSON.parse(rawUser) as NavAuthUser
  } catch {
    return hasToken ? {} : null
  }
}

function getUserInitial(user: NavAuthUser | null) {
  const source = user?.displayName || user?.fullName || user?.email || 'U'
  return source.trim().charAt(0).toUpperCase() || 'U'
}

function getAccountLabels(language: string) {
  if (language === 'en') {
    return {
      signedIn: 'Signed in',
      account: 'Account',
      profileDetails: 'Personal details',
      fullName: 'Full name',
      displayName: 'Display name',
      email: 'Email',
      phone: 'Phone',
      status: 'Status',
      memberLevel: 'Member level',
      notUpdated: 'Not updated',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      language: 'Language',
      vietnamese: 'VI',
      english: 'EN',
      logout: 'Sign out',
    }
  }

  return {
    signedIn: 'Đã đăng nhập',
    account: 'Tài khoản',
    profileDetails: 'Thông tin cá nhân',
    fullName: 'Họ tên',
    displayName: 'Tên hiển thị',
    email: 'Email',
    phone: 'Số điện thoại',
    status: 'Trạng thái',
    memberLevel: 'Hạng thành viên',
    notUpdated: 'Chưa cập nhật',
    theme: 'Giao diện',
    light: 'Sáng',
    dark: 'Tối',
    language: 'Ngôn ngữ',
    vietnamese: 'VI',
    english: 'EN',
    logout: 'Đăng xuất',
  }
}

export function Navbar() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { language, theme } = useAppSelector((state) => state.preferences)
  const [isScrolled, setIsScrolled] = useState(false)
  const [authUser, setAuthUser] = useState<NavAuthUser | null>(() => readStoredUser())
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [showProfileDetails, setShowProfileDetails] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const accountRef = useRef<HTMLDivElement | null>(null)
  const scrolledRef = useRef(false)
  const accountLabels = getAccountLabels(language)
  const accountName =
    authUser?.displayName || authUser?.fullName || authUser?.email || accountLabels.account

  useEffect(() => {
    const nav = navRef.current
    if (!nav) {
      return undefined
    }

    gsap.set(nav, {
      clearProps: 'backgroundColor,color',
      backdropFilter: 'blur(0px)',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    })

    const handleScroll = () => {
      const shouldPin = window.scrollY > 48

      if (shouldPin === scrolledRef.current) {
        return
      }

      scrolledRef.current = shouldPin
      setIsScrolled(shouldPin)
      gsap.to(nav, {
        backdropFilter: shouldPin ? 'blur(18px)' : 'blur(0px)',
        boxShadow: shouldPin
          ? '0 18px 48px rgba(0, 0, 0, 0.26)'
          : '0 0 0 rgba(0, 0, 0, 0)',
        paddingTop: shouldPin ? 12 : 0,
        paddingBottom: shouldPin ? 12 : 0,
        duration: 0.38,
        ease: 'power2.out',
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const syncAuthUser = () => {
      const nextUser = readStoredUser()
      setAuthUser(nextUser)

      if (!nextUser) {
        setIsAccountOpen(false)
        setShowProfileDetails(false)
      }
    }

    window.addEventListener('storage', syncAuthUser)
    window.addEventListener('travelviet:login', syncAuthUser)
    window.addEventListener('travelviet:logout', syncAuthUser)

    return () => {
      window.removeEventListener('storage', syncAuthUser)
      window.removeEventListener('travelviet:login', syncAuthUser)
      window.removeEventListener('travelviet:logout', syncAuthUser)
    }
  }, [])

  useEffect(() => {
    if (!isAccountOpen) {
      return undefined
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setIsAccountOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAccountOpen])

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    target: string,
  ) => {
    event.preventDefault()
    ScrollTrigger.refresh()

    gsap.to(window, {
      duration: 1,
      ease: 'power3.inOut',
      scrollTo: {
        y: target,
        offsetY: 96,
      },
    })
  }

  const handleLogout = () => {
    AUTH_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key))
    window.sessionStorage.removeItem('travelviet-login-welcome-seen')
    setAuthUser(null)
    setIsAccountOpen(false)
    setShowProfileDetails(false)
    window.dispatchEvent(new Event('travelviet:logout'))
  }

  const profileDetails = [
    { label: accountLabels.fullName, value: authUser?.fullName },
    { label: accountLabels.displayName, value: authUser?.displayName },
    { label: accountLabels.email, value: authUser?.email },
    { label: accountLabels.phone, value: authUser?.phone },
    { label: accountLabels.status, value: authUser?.status },
    { label: accountLabels.memberLevel, value: authUser?.memberLevel },
  ]

  return (
    <nav
      className={`site-nav ${isScrolled ? 'is-scrolled' : ''}`}
      ref={navRef}
      aria-label="Main navigation"
    >
      <a
        className="brand"
        href="#home"
        aria-label="TravelViet"
        onClick={(event) => handleNavClick(event, '#home')}
      >
        <span className="brand-mark"></span>
        TravelViet
      </a>
      <div className="nav-links">
        {navItems.map((item) => (
          <a
            href={item.href}
            key={item.href}
            onClick={(event) => handleNavClick(event, item.href)}
          >
            {t(item.labelKey)}
          </a>
        ))}
      </div>
      <div className="nav-actions">
        {authUser ? (
          <div className="nav-account" ref={accountRef}>
            <button
              className="nav-auth-link nav-avatar"
              type="button"
              aria-label={accountName}
              aria-expanded={isAccountOpen}
              aria-haspopup="menu"
              title={accountName}
              onClick={() => setIsAccountOpen((current) => !current)}
            >
              {authUser.avatarUrl ? (
                <img src={authUser.avatarUrl} alt="" />
              ) : (
                <span>{getUserInitial(authUser)}</span>
              )}
            </button>

            {isAccountOpen && (
              <div className="account-dropdown" role="menu">
                <div className="account-summary">
                  <div className="account-summary-avatar" aria-hidden="true">
                    {authUser.avatarUrl ? (
                      <img src={authUser.avatarUrl} alt="" />
                    ) : (
                      <span>{getUserInitial(authUser)}</span>
                    )}
                  </div>
                  <div className="account-summary-copy">
                    <span>{accountLabels.signedIn}</span>
                    <strong>{accountName}</strong>
                    <small>{authUser.email || accountLabels.notUpdated}</small>
                  </div>
                </div>

                <button
                  className="account-menu-button"
                  type="button"
                  onClick={() => setShowProfileDetails((current) => !current)}
                >
                  <UserCircle2 aria-hidden="true" />
                  <span>{accountLabels.profileDetails}</span>
                </button>

                {showProfileDetails && (
                  <div className="account-detail-grid">
                    {profileDetails.map((item) => (
                      <div className="account-detail-item" key={item.label}>
                        <span>{item.label}</span>
                        <strong>{item.value || accountLabels.notUpdated}</strong>
                      </div>
                    ))}
                  </div>
                )}

                <div className="account-setting-row">
                  <span className="account-setting-label">
                    <SunMedium aria-hidden="true" />
                    {accountLabels.theme}
                  </span>
                  <div className="account-segmented" role="group" aria-label={accountLabels.theme}>
                    <button
                      className={theme === 'light' ? 'is-active' : ''}
                      type="button"
                      onClick={() => dispatch(setTheme('light'))}
                    >
                      {accountLabels.light}
                    </button>
                    <button
                      className={theme === 'dark' ? 'is-active' : ''}
                      type="button"
                      onClick={() => dispatch(setTheme('dark'))}
                    >
                      <Moon aria-hidden="true" />
                      {accountLabels.dark}
                    </button>
                  </div>
                </div>

                <div className="account-setting-row">
                  <span className="account-setting-label">
                    <Languages aria-hidden="true" />
                    {accountLabels.language}
                  </span>
                  <div className="account-segmented" role="group" aria-label={accountLabels.language}>
                    <button
                      className={language === 'vi' ? 'is-active' : ''}
                      type="button"
                      onClick={() => dispatch(setLanguage('vi'))}
                    >
                      {accountLabels.vietnamese}
                    </button>
                    <button
                      className={language === 'en' ? 'is-active' : ''}
                      type="button"
                      onClick={() => dispatch(setLanguage('en'))}
                    >
                      {accountLabels.english}
                    </button>
                  </div>
                </div>

                <button
                  className="account-menu-button account-logout"
                  type="button"
                  onClick={handleLogout}
                >
                  <LogOut aria-hidden="true" />
                  <span>{accountLabels.logout}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link className="nav-auth-link" to="/login" aria-label="Dang nhap">
              <UserRound aria-hidden="true" />
            </Link>
            <Link className="nav-auth-link" to="/register" aria-label="Dang ky">
              <UserPlus aria-hidden="true" />
            </Link>
            <a
              className="nav-action"
              href="#contact"
              onClick={(event) => handleNavClick(event, '#contact')}
            >
              {t('nav.plan')}
            </a>
          </>
        )}
      </div>
    </nav>
  )
}
