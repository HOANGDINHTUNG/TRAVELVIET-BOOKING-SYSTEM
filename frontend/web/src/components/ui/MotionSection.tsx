import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type MotionSectionProps = {
  as?: 'div' | 'section' | 'article'
  className?: string
  children: ReactNode
  /** Stagger-friendly delay (seconds) */
  delay?: number
  id?: string
  role?: string
  'aria-labelledby'?: string
  'aria-label'?: string
}

const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
} as const

/**
 * Subtle enter animation; keeps opacity at 1 for LCP (hero copy stays visible).
 */
export function MotionSection({
  as = 'section',
  className = '',
  children,
  delay = 0,
  id,
  role,
  'aria-labelledby': ariaLabelledby,
  'aria-label': ariaLabel,
}: MotionSectionProps) {
  const reduce = useReducedMotion()
  const MotionTag = motionTags[as]

  return (
    <MotionTag
      id={id}
      role={role}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      className={className}
      initial={reduce ? false : { opacity: 1, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.5,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  )
}
