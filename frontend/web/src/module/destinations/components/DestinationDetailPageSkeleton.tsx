import { PageSkeletonBlock } from '@/components/ui/skeletons/PageSkeletonBlock'

import './DestinationsPageSkeleton.css'

export function DestinationDetailPageSkeleton() {
  return (
    <main
      className="dest-detail-sk mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10"
      aria-busy="true"
      aria-label="Đang tải chi tiết điểm đến"
    >
      <PageSkeletonBlock className="dest-detail-sk-hero psb" as="div" />
      <div className="dest-detail-sk-grid">
        <div>
          <PageSkeletonBlock className="dest-detail-sk-panel psb" style={{ height: 120 }} as="div" />
          <PageSkeletonBlock className="dest-detail-sk-panel psb" style={{ height: 240 }} as="div" />
          <PageSkeletonBlock className="dest-detail-sk-panel psb" style={{ height: 200 }} as="div" />
        </div>
        <div>
          <PageSkeletonBlock className="dest-detail-sk-panel psb" style={{ height: 280 }} as="div" />
        </div>
      </div>
    </main>
  )
}
