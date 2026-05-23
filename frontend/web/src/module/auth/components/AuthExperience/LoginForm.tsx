import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { FloatingInput } from './FloatingInput'
import { PasswordField } from './PasswordField'
import { AuthSubmitButton } from './AuthSubmitButton'
import { SocialAuthButtons } from './SocialAuthButtons'
import { isNonEmpty } from '../../utils/authValidation'
import { useLogin } from '../../hooks/useAuthMutation'

const REMEMBER_EMAIL_KEY = 'travelviet-remember-email'

type LoginFormProps = {
  redirectTo: string
  dimmed?: boolean
  onShake?: () => void
}

export function LoginForm({ redirectTo, dimmed, onShake }: LoginFormProps) {
  const { t } = useTranslation('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberEmail, setRememberEmail] = useState(false)

  useEffect(() => {
    const { email: remembered, remember } = hydrateRememberedEmail()
    if (remembered) setEmail(remembered)
    if (remember) setRememberEmail(true)
  }, [])
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const login = useLogin({
    redirectTo,
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

  const validate = () => {
    const next: typeof fieldErrors = {}
    if (!isNonEmpty(email)) {
      next.email = String(t('validation.required'))
    }
    if (!isNonEmpty(password)) {
      next.password = String(t('validation.required'))
    }
    setFieldErrors(next)
    if (Object.keys(next).length > 0) {
      onShake?.()
      return false
    }
    return true
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (login.isPending) return
    if (!validate()) {
      toast.error(String(t('missingFields')))
      return
    }
    login.mutate({
      login: email.trim(),
      passwordHash: password,
    })
  }

  const handleForgotPassword = () => {
    toast.message(String(t('forgotPasswordSoon')))
  }

  return (
    <form
      className={`auth-form auth-form--login ${dimmed ? 'auth-form--dimmed' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <FloatingInput
        name="login"
        label={String(t('form.loginLabel'))}
        autoComplete="username"
        disabled={login.isPending}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
        leadingIcon={<Mail aria-hidden="true" />}
        onBlurValidate={(value) =>
          isNonEmpty(value) ? undefined : String(t('validation.required'))
        }
      />

      <PasswordField
        name="password"
        label={String(t('form.passwordLabel'))}
        autoComplete="current-password"
        disabled={login.isPending}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
        onBlurValidate={(value) =>
          isNonEmpty(value) ? undefined : String(t('validation.required'))
        }
      />

      <div className="auth-form-row">
        <label className="auth-remember">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(event) => setRememberEmail(event.target.checked)}
            disabled={login.isPending}
          />
          <span>{t('form.rememberLabel')}</span>
        </label>
        <button
          type="button"
          className="auth-forgot"
          onClick={handleForgotPassword}
          disabled={login.isPending}
        >
          {t('form.forgotPassword')}
        </button>
      </div>

      <AuthSubmitButton loading={login.isPending}>
        {login.isPending ? t('form.submittingLogin') : t('form.submitLogin')}
      </AuthSubmitButton>

      <SocialAuthButtons />
    </form>
  )
}

export function hydrateRememberedEmail(): {
  email: string
  remember: boolean
} {
  try {
    const remembered = window.localStorage.getItem(REMEMBER_EMAIL_KEY)
    if (remembered) {
      return { email: JSON.parse(remembered) as string, remember: true }
    }
  } catch {
    window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
  }
  return { email: '', remember: false }
}
