import type { CSSProperties, ElementType } from 'react'

import './PageSkeletonBlock.css'

type PageSkeletonBlockProps = {
  className?: string
  as?: ElementType
  style?: CSSProperties
}

export function PageSkeletonBlock({
  className = '',
  as: Tag = 'span',
  style,
}: PageSkeletonBlockProps) {
  return <Tag className={`psb ${className}`.trim()} style={style} aria-hidden />
}
