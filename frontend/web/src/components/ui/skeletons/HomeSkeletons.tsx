import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Skeleton thay cho khu vực Banner hero (full viewport height).
 * Mục tiêu: giữ chỗ ngay từ FCP, tránh CLS khi ảnh + GSAP timeline load.
 */
export function HomeBannerSkeleton({ className }: { className?: string }) {
  return (
    <section
      role="status"
      aria-busy="true"
      className={cn(
        'relative h-dvh min-h-svh w-full overflow-hidden bg-neutral-950',
        className,
      )}
    >
      <Skeleton className="absolute inset-0 rounded-none bg-neutral-900/60" />

      <div className="absolute left-5 top-28 max-w-[640px] space-y-4 md:left-12 md:top-1/4 lg:left-16">
        <Skeleton className="h-3 w-32 bg-neutral-700/50" />
        <Skeleton className="h-12 w-72 bg-neutral-700/60 md:h-20 md:w-[28rem] lg:h-24 lg:w-[34rem]" />
        <Skeleton className="h-4 w-48 bg-neutral-700/50 md:h-6 md:w-72" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-3 w-[80%] bg-neutral-700/40" />
          <Skeleton className="h-3 w-[70%] bg-neutral-700/40" />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <Skeleton className="h-10 w-10 rounded-full bg-[#ff6600]/30" />
          <Skeleton className="h-10 w-40 rounded-full bg-neutral-700/50" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 hidden items-center gap-4 md:bottom-6 md:left-6 md:flex">
        <Skeleton className="h-[46px] w-[46px] rounded-full bg-neutral-800/60" />
        <Skeleton className="h-[46px] w-[46px] rounded-full bg-neutral-800/60" />
        <Skeleton className="ml-2 h-[3px] w-60 bg-neutral-700/60" />
        <Skeleton className="h-[50px] w-[50px] rounded-full bg-neutral-800/60" />
      </div>
    </section>
  )
}

/**
 * Skeleton cho 1 thẻ tour ở các grid (TourHotSection, HomeTourRows).
 * Match `aspect-[4/5]` của card thật để không gây dịch layout khi data về.
 */
export function TourCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={cn(
        'relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted/60',
        className,
      )}
    >
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-x-3 bottom-3 space-y-2">
        <Skeleton className="h-3 w-2/3 bg-white/40" />
        <Skeleton className="h-4 w-[85%] bg-white/55" />
      </div>
    </div>
  )
}

/**
 * Skeleton cho 1 thẻ "hot" rộng (TourHotSection card).
 */
export function HotCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={cn(
        'relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-800/60',
        className,
      )}
    >
      <Skeleton className="absolute inset-0 rounded-none bg-neutral-700/40" />
      <div className="absolute inset-x-4 bottom-4 space-y-2">
        <Skeleton className="h-4 w-1/2 bg-white/45" />
        <Skeleton className="h-3 w-2/3 bg-white/35" />
      </div>
    </div>
  )
}

/**
 * Skeleton row "feature highlight" — thay cho HomeServicesRow khi loading.
 */
export function ServiceRowSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={cn(
        'mx-auto grid w-full max-w-[var(--home-content-max)] grid-cols-2 gap-3 px-3 py-5 md:grid-cols-4 md:gap-4 md:px-6',
        className,
      )}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/70 p-3"
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton tổng hợp cho HomePage khi loading lần đầu + chưa có cache.
 * Cấu trúc nên xấp xỉ HomePage thật để hạn chế CLS khi data về.
 */
export function HomePageSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-6">
      <HomeBannerSkeleton />
      <ServiceRowSkeleton />
      <section className="mx-auto w-full max-w-[var(--home-content-max)] space-y-4 px-3 md:px-6">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-[var(--home-content-max)] space-y-4 px-3 pb-10 md:px-6">
        <Skeleton className="h-6 w-56" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <HotCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
