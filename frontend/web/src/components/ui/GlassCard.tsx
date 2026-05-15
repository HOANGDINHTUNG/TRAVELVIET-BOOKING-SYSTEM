import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import './GlassCard.css'

export type GlassCardVariant =
  | 'default'
  | 'flat'
  | 'glass'
  | 'liquid'
  | 'navbar'
  | 'heroSearch'

export type GlassTag = 'div' | 'nav' | 'section' | 'article'

export type GlassCardProps = {
  as?: GlassTag
  variant?: GlassCardVariant
  className?: string
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLElement>, 'as' | 'className' | 'children'>

function resolveVariant(variant: GlassCardVariant): Exclude<GlassCardVariant, 'default'> {
  return variant === 'default' ? 'glass' : variant
}

export const GlassCard = forwardRef<HTMLElement, GlassCardProps>(
  function GlassCard(
    { as: Tag = 'div', variant = 'glass', className = '', children, ...rest },
    ref,
  ) {
    const resolved = resolveVariant(variant)

    return createElement(
      Tag,
      {
        ref,
        className: ['tv-glass-card', `tv-glass-card--${resolved}`, className]
          .filter(Boolean)
          .join(' '),
        ...rest,
      },
      children,
    )
  },
)
