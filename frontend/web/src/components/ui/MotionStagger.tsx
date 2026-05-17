import { motion, useReducedMotion, type Variants } from 'motion/react'
import {
  createElement,
  type AriaAttributes,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const

const containerVariants = (
  staggerChildren: number,
  delayChildren: number,
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: PREMIUM_EASE,
    },
  },
}

type MotionDomProps = AriaAttributes & {
  className?: string
  style?: CSSProperties
  id?: string
  role?: string
  tabIndex?: number
}

type MotionStaggerProps = MotionDomProps & {
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol'
  staggerChildren?: number
  delayChildren?: number
  amount?: number
  once?: boolean
  children: ReactNode
}

const tagMap = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
} as const

/**
 * Container "stagger on scroll" — chỉ animate khi cuộn vào viewport.
 */
export function MotionStagger({
  as = 'div',
  className,
  style,
  id,
  role,
  tabIndex,
  staggerChildren = 0.08,
  delayChildren = 0,
  amount = 0.15,
  once = true,
  children,
  ...aria
}: MotionStaggerProps) {
  const reduce = useReducedMotion()
  const MotionTag = tagMap[as]
  const dom = { className: cn(className), style, id, role, tabIndex, ...aria }

  if (reduce) {
    return createElement(as as ElementType, dom, children)
  }

  return (
    <MotionTag
      {...dom}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={containerVariants(staggerChildren, delayChildren)}
    >
      {children}
    </MotionTag>
  )
}

type MotionStaggerItemProps = MotionDomProps & {
  as?: 'div' | 'li' | 'article'
  children: ReactNode
}

const itemTagMap = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
} as const

export function MotionStaggerItem({
  as = 'div',
  className,
  style,
  id,
  role,
  tabIndex,
  children,
  ...aria
}: MotionStaggerItemProps) {
  const MotionTag = itemTagMap[as]
  const dom = { className: cn(className), style, id, role, tabIndex, ...aria }

  return (
    <MotionTag {...dom} variants={itemVariants}>
      {children}
    </MotionTag>
  )
}

type RevealOnScrollProps = MotionDomProps & {
  as?: 'div' | 'section' | 'article' | 'header' | 'figure'
  delay?: number
  amount?: number
  axis?: 'x' | 'y'
  distance?: number
  once?: boolean
  children: ReactNode
}

const revealTagMap = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  figure: motion.figure,
} as const

export function RevealOnScroll({
  as = 'div',
  className,
  style,
  id,
  role,
  tabIndex,
  delay = 0,
  amount = 0.2,
  axis = 'y',
  distance = 24,
  once = true,
  children,
  ...aria
}: RevealOnScrollProps) {
  const reduce = useReducedMotion()
  const MotionTag = revealTagMap[as]
  const dom = { className: cn(className), style, id, role, tabIndex, ...aria }

  if (reduce) {
    return createElement(as as ElementType, dom, children)
  }

  const hidden =
    axis === 'y' ? { opacity: 0, y: distance } : { opacity: 0, x: distance }

  return (
    <MotionTag
      {...dom}
      initial={hidden}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.55, delay, ease: PREMIUM_EASE }}
    >
      {children}
    </MotionTag>
  )
}
