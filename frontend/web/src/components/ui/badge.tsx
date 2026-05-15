import * as React from 'react'

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'
  pulse?: boolean
}

const variantClass: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'border-transparent bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
  secondary: 'border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100',
  outline: 'border-slate-200 text-slate-800 dark:border-slate-600 dark:text-slate-100',
  success: 'border-transparent bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100',
  warning: 'border-transparent bg-amber-100 text-amber-950 dark:bg-amber-900/35 dark:text-amber-100',
  destructive: 'border-transparent bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-100',
}

export function Badge({ className = '', variant = 'default', pulse, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight transition-colors ${variantClass[variant]} ${pulse ? 'animate-pulse' : ''} ${className}`.trim()}
      {...props}
    />
  )
}
