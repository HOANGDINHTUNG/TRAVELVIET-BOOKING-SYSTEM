import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Khối skeleton shimmer chuẩn Shadcn — dùng cho mọi trạng thái chờ.
 * Hiệu ứng pulse rất rẻ (chỉ animate `opacity`), an toàn 60fps.
 *
 * Ví dụ:
 *   <Skeleton className="h-48 w-full rounded-xl" />
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted/70', className)}
      {...props}
    />
  )
}

export { Skeleton }
