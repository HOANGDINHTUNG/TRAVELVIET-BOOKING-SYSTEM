import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../../../lib/utils'

type AuthSubmitButtonProps = {
  children: ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function AuthSubmitButton({
  children,
  loading = false,
  disabled = false,
  className,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={cn('auth-cta', loading && 'auth-cta--loading', className)}
      disabled={disabled || loading}
    >
      <span className="auth-cta-shimmer" aria-hidden="true" />
      <span className="auth-cta-content">
        {loading ? <Loader2 className="auth-cta-spinner" aria-hidden="true" /> : null}
        <span className={loading ? 'auth-cta-label auth-cta-label--loading' : 'auth-cta-label'}>
          {children}
        </span>
      </span>
    </button>
  )
}
