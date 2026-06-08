import { PageSkeletonBlock } from '@/components/ui/skeletons/PageSkeletonBlock'

import './TourPublicDetailSkeleton.css'

export function TourPublicDetailSkeleton() {
  return (
    <div className="tour-public-shell" aria-busy="true" aria-label="Đang tải chi tiết tour">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <PageSkeletonBlock className="tour-detail-sk-breadcrumb psb" as="div" />
        <div className="tour-detail-sk-layout">
          <div className="tour-detail-sk-main">
            <PageSkeletonBlock className="tour-detail-sk-gallery psb" as="div" />
            <PageSkeletonBlock className="tour-detail-sk-title psb" as="div" />
            <PageSkeletonBlock className="tour-detail-sk-line psb" as="div" />
            <PageSkeletonBlock className="tour-detail-sk-line tour-detail-sk-line--short psb" as="div" />
            <div className="tour-detail-sk-chips">
              {Array.from({ length: 4 }, (_, i) => (
                <PageSkeletonBlock key={i} className="tour-detail-sk-chip psb" as="div" />
              ))}
            </div>
            <PageSkeletonBlock className="tour-detail-sk-section psb" as="div" />
            <PageSkeletonBlock className="tour-detail-sk-section psb" as="div" />
          </div>
          <aside className="tour-detail-sk-aside">
            <PageSkeletonBlock className="tour-detail-sk-booking psb" as="div" />
          </aside>
        </div>
      </div>
    </div>
  )
}
