import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type StarRatingProps = {
  count: number
  max?: number
  size?: number
  className?: string
  activeColor?: string
  inactiveColor?: string
}

export function StarRating({
  count,
  max = 5,
  size = 13,
  className,
  activeColor = '#ffcc00',
  inactiveColor = '#e5e7eb',
}: StarRatingProps) {
  const safeCount = Math.max(0, Math.min(max, Math.round(count)))

  return (
    <div className={cn('tv-offer-card__stars', className)} aria-label={`${safeCount}/${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          fill={i < safeCount ? activeColor : inactiveColor}
          aria-hidden
        />
      ))}
    </div>
  )
}
