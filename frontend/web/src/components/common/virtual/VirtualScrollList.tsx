import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, type CSSProperties, type ReactNode } from 'react'

export type VirtualScrollListProps<T> = {
  items: T[]
  estimateSize: number
  overscan?: number
  getItemKey: (item: T, index: number) => string | number
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  style?: CSSProperties
  role?: string
  'aria-label'?: string
}

/**
 * Danh sách ảo hóa dọc — chỉ mount hàng trong viewport + overscan.
 */
export function VirtualScrollList<T>({
  items,
  estimateSize,
  overscan = 5,
  getItemKey,
  renderItem,
  className,
  style,
  role,
  'aria-label': ariaLabel,
}: VirtualScrollListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: (index) => String(getItemKey(items[index]!, index)),
  })

  const virtualRows = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className={className}
      style={{
        overflow: 'auto',
        contain: 'strict',
        ...style,
      }}
      role={role}
      aria-label={ariaLabel}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const item = items[virtualRow.index]!
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
