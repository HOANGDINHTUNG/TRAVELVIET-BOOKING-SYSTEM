import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Sparkles, X } from 'lucide-react'
import { hasStoredAuthSession } from '../../module/auth/api/authApi'
import './LoginWelcomeAnimation.css'

const WELCOME_SEEN_KEY = 'travelviet-login-welcome-seen'

function hasAuthSignal() {
  if (typeof window === 'undefined') {
    return false
  }

  return hasStoredAuthSession()
}

export function LoginWelcomeAnimation() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const previousAuthRef = useRef(false)
  const closeTimerRef = useRef<number | null>(null)
  const typingTimerRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current)
      typingTimerRef.current = null
    }
  }, [])

  const closeWelcome = useCallback(() => {
    clearTimers()
    setIsVisible(false)
  }, [clearTimers])

  const showWelcome = useCallback(() => {
    if (window.sessionStorage.getItem(WELCOME_SEEN_KEY)) {
      return
    }

    window.sessionStorage.setItem(WELCOME_SEEN_KEY, 'true')
    clearTimers()
    setTypedText('')
    setIsVisible(true)

    closeTimerRef.current = window.setTimeout(() => {
      setIsVisible(false)
    }, 9200)
  }, [clearTimers])

  useEffect(() => {
    const initialAuth = hasAuthSignal()
    previousAuthRef.current = initialAuth

    if (initialAuth) {
      window.setTimeout(showWelcome, 0)
    }

    const checkAuthState = () => {
      const isAuthed = hasAuthSignal()

      if (isAuthed && !previousAuthRef.current) {
        showWelcome()
      }

      if (!isAuthed) {
        window.sessionStorage.removeItem(WELCOME_SEEN_KEY)
      }

      previousAuthRef.current = isAuthed
    }

    const interval = window.setInterval(checkAuthState, 500)
    window.addEventListener('storage', checkAuthState)
    window.addEventListener('travelviet:login', checkAuthState)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('storage', checkAuthState)
      window.removeEventListener('travelviet:login', checkAuthState)
      clearTimers()
    }
  }, [clearTimers, showWelcome])

  useEffect(() => {
    if (!isVisible) {
      return undefined
    }

    const fullText = t('loginWelcome.typing')
    let index = 0

    typingTimerRef.current = window.setInterval(() => {
      index += 1
      setTypedText(fullText.slice(0, index))

      if (index >= fullText.length && typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current)
        typingTimerRef.current = null
      }
    }, 34)

    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current)
        typingTimerRef.current = null
      }
    }
  }, [isVisible, t])

  if (!isVisible) {
    return null
  }

  return (
    <div className="login-welcome" role="status" aria-live="polite">
      <div className="login-welcome-stage" aria-hidden="true">
        <span className="login-welcome-line line-one" />
        <span className="login-welcome-line line-two" />
        <span className="login-welcome-line line-three" />
      </div>

      <div className="login-welcome-card">
        <button
          className="login-welcome-close"
          type="button"
          onClick={closeWelcome}
          aria-label={t('loginWelcome.close')}
          title={t('loginWelcome.close')}
        >
          <X size={17} strokeWidth={2.3} />
        </button>

        <div className="login-welcome-kicker">
          <Sparkles size={17} strokeWidth={2.1} aria-hidden="true" />
          <span>{t('loginWelcome.kicker')}</span>
        </div>

        <h2>
          <span>{t('loginWelcome.titleTop')}</span>
          {t('loginWelcome.titleMain')}
        </h2>

        <p className="login-welcome-typing">
          {typedText}
          <span aria-hidden="true" />
        </p>

        <div className="login-welcome-tags">
          {[0, 1, 2].map((item) => (
            <span key={item}>{t(`loginWelcome.tags.${item}`)}</span>
          ))}
        </div>

        <div className="login-welcome-confirm">
          <CheckCircle2 size={18} strokeWidth={2.1} aria-hidden="true" />
          <span>{t('loginWelcome.confirm')}</span>
        </div>

        <div className="login-welcome-progress" aria-hidden="true" />
      </div>
    </div>
  )
}
