import { useId, useMemo, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../../../lib/utils'
import {
  evaluatePasswordStrength,
  strengthBarColor,
} from '../../utils/passwordStrength'

export type PasswordFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> & {
  label: string
  error?: string
  showStrength?: boolean
  onBlurValidate?: (value: string) => string | undefined
}

export function PasswordField({
  label,
  error,
  showStrength = false,
  onBlurValidate,
  value,
  defaultValue,
  onChange,
  onBlur,
  disabled,
  id: idProp,
  ...inputProps
}: PasswordFieldProps) {
  const { t } = useTranslation('auth')
  const autoId = useId()
  const id = idProp ?? autoId
  const errorId = `${id}-error`

  const [visible, setVisible] = useState(false)
  const [internalValue, setInternalValue] = useState(
    () => (defaultValue as string | undefined) ?? '',
  )
  const [touched, setTouched] = useState(false)
  const [localError, setLocalError] = useState<string | undefined>()

  const resolvedValue = value !== undefined ? String(value) : internalValue
  const floated = Boolean(resolvedValue)
  const displayError = error ?? (touched ? localError : undefined)
  const strength = useMemo(
    () => evaluatePasswordStrength(resolvedValue),
    [resolvedValue],
  )

  const strengthLabel =
    strength.level === 'strong'
      ? t('passwordStrength.strong')
      : strength.level === 'fair'
        ? t('passwordStrength.fair')
        : strength.level === 'weak'
          ? t('passwordStrength.weak')
          : ''

  return (
    <div
      className={cn(
        'auth-float-field auth-password-field',
        floated && 'auth-float-field--floated',
        displayError && 'auth-float-field--error',
        disabled && 'auth-float-field--disabled',
      )}
    >
      <div className="auth-float-shell">
        <span className="auth-float-glow" aria-hidden="true" />
        <input
          {...inputProps}
          id={id}
          className="auth-float-input"
          type={visible ? 'text' : 'password'}
          value={resolvedValue}
          disabled={disabled}
          aria-invalid={displayError ? true : undefined}
          aria-describedby={displayError ? errorId : undefined}
          onChange={(event) => {
            if (value === undefined) setInternalValue(event.target.value)
            onChange?.(event)
            if (displayError) setLocalError(undefined)
          }}
          onBlur={(event) => {
            setTouched(true)
            const message = onBlurValidate?.(event.target.value)
            setLocalError(message)
            onBlur?.(event)
          }}
        />
        <label className="auth-float-label" htmlFor={id}>
          {label}
        </label>
        <button
          type="button"
          className={cn('auth-password-toggle', visible && 'auth-password-toggle--visible')}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          disabled={disabled}
          onClick={() => setVisible((current) => !current)}
        >
          <span className="auth-password-toggle-icon auth-password-toggle-icon--hide">
            <EyeOff aria-hidden="true" />
          </span>
          <span className="auth-password-toggle-icon auth-password-toggle-icon--show">
            <Eye aria-hidden="true" />
          </span>
        </button>
      </div>

      {showStrength && resolvedValue ? (
        <div className="auth-strength" aria-live="polite">
          <div className="auth-strength-head">
            <div className="auth-strength-track">
              <span
                className="auth-strength-fill"
                style={{
                  width: `${strength.percent}%`,
                  backgroundColor: strengthBarColor(strength.level),
                }}
              />
            </div>
            <span className="auth-strength-label">{strengthLabel}</span>
          </div>
          <ul className="auth-strength-checks">
            {(
              [
                ['checkMinLength', strength.checks.minLength],
                ['checkUppercase', strength.checks.uppercase],
                ['checkLowercase', strength.checks.lowercase],
                ['checkDigit', strength.checks.digit],
                ['checkSpecial', strength.checks.special],
              ] as const
            ).map(([key, ok]) => (
              <li
                key={key}
                className={cn('auth-strength-check', ok && 'auth-strength-check--ok')}
              >
                {t(`passwordStrength.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="auth-float-error-slot" aria-live="polite">
        {displayError ? (
          <p id={errorId} className="auth-float-error" role="alert">
            {displayError}
          </p>
        ) : null}
      </div>
    </div>
  )
}
