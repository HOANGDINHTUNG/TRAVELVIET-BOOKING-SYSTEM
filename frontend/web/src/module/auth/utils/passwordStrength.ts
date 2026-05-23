export type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'strong'

export type PasswordChecks = {
  minLength: boolean
  uppercase: boolean
  lowercase: boolean
  digit: boolean
  special: boolean
}

export type PasswordStrengthResult = {
  level: PasswordStrengthLevel
  score: number
  percent: number
  checks: PasswordChecks
}

const SPECIAL = /[^A-Za-z0-9]/

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const checks: PasswordChecks = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: SPECIAL.test(password),
  }

  if (!password) {
    return { level: 'empty', score: 0, percent: 0, checks }
  }

  const score = Object.values(checks).filter(Boolean).length
  const percent = Math.min(100, Math.round((score / 5) * 100))

  let level: PasswordStrengthLevel = 'weak'
  if (score >= 5) level = 'strong'
  else if (score >= 3) level = 'fair'

  return { level, score, percent, checks }
}

export function strengthBarColor(level: PasswordStrengthLevel): string {
  switch (level) {
    case 'strong':
      return 'var(--auth-success)'
    case 'fair':
      return '#eab308'
    case 'weak':
      return 'var(--auth-error)'
    default:
      return 'transparent'
  }
}
