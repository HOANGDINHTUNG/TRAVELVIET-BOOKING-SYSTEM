import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../../lib/utils'

export type FloatingInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className'
> & {
  label: string
  error?: string
  leadingIcon?: ReactNode
  trailing?: ReactNode
  onBlurValidate?: (value: string) => string | undefined
}

export function FloatingInput({
  label,
  error,
  leadingIcon,
  trailing,
  onBlurValidate,
  value,
  defaultValue,
  onChange,
  onBlur,
  disabled,
  id: idProp,
  ...inputProps
}: FloatingInputProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const errorId = `${id}-error`

  const [internalValue, setInternalValue] = useState(
    () => (defaultValue as string | undefined) ?? '',
  )
  const [touched, setTouched] = useState(false)
  const [localError, setLocalError] = useState<string | undefined>()

  const resolvedValue = value !== undefined ? String(value) : internalValue
  const floated = Boolean(resolvedValue) || inputProps.type === 'date'
  const displayError = error ?? (touched ? localError : undefined)

  return (
    <div
      className={cn(
        'auth-float-field',
        leadingIcon && 'auth-float-field--with-icon',
        floated && 'auth-float-field--floated',
        displayError && 'auth-float-field--error',
        disabled && 'auth-float-field--disabled',
      )}
    >
      <div className="auth-float-shell">
        <span className="auth-float-glow" aria-hidden="true" />
        {leadingIcon ? (
          <span className="auth-float-icon">{leadingIcon}</span>
        ) : null}
        <input
          {...inputProps}
          id={id}
          className="auth-float-input"
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
        {trailing ? <span className="auth-float-trailing">{trailing}</span> : null}
      </div>
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
