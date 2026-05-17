import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

const TOUR_CARD_TOOLTIP_CONTENT_CLASS = cn(
  'z-[60] max-w-[min(300px,calc(100vw-32px))] rounded-md border border-[#B8DAF0] bg-[#E8F4FC] px-3 py-2',
  'text-left text-[13px] font-medium leading-snug text-[#1A5F8A]',
  'shadow-[0_4px_14px_rgba(26,95,138,0.14)]',
  '[&_svg]:fill-[#E8F4FC]',
)

type TruncatedTextTooltipProps = {
  text: string
  className?: string
  style?: CSSProperties
  as?: ElementType
  lineClamp?: 1 | 2
  side?: 'top' | 'bottom'
  children?: ReactNode
}

/**
 * Hover tooltip hiển thị đầy đủ nội dung khi text bị cắt (truncate / line-clamp).
 */
export function TruncatedTextTooltip({
  text,
  className,
  style,
  as: Tag = 'span',
  lineClamp,
  side = 'top',
  children,
}: TruncatedTextTooltipProps) {
  const ref = useRef<HTMLElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const horizontal = el.scrollWidth > el.clientWidth + 1
    const vertical = el.scrollHeight > el.clientHeight + 1
    setIsTruncated(horizontal || vertical)
  }, [])

  useEffect(() => {
    measure()
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, text])

  const clampStyle: CSSProperties | undefined =
    lineClamp === 2
      ? {
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          ...style,
        }
      : lineClamp === 1
        ? {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            ...style,
          }
        : style

  const label = children ?? text

  const trigger = (
    <Tag
      ref={ref}
      className={cn(className, lineClamp === 1 && !style?.whiteSpace && 'truncate')}
      style={clampStyle}
    >
      {label}
    </Tag>
  )

  if (!isTruncated) {
    return trigger
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={8}
        className={TOUR_CARD_TOOLTIP_CONTENT_CLASS}
      >
        {text}
      </TooltipContent>
    </Tooltip>
  )
}
