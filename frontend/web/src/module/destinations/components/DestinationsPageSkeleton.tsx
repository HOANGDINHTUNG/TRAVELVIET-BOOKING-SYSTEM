import { PageSkeletonBlock } from '@/components/ui/skeletons/PageSkeletonBlock'

import './DestinationsPageSkeleton.css'

function DestinationCardSkeleton() {
  return (
    <article className="dest-card dest-card--skeleton" aria-hidden>
      <PageSkeletonBlock className="dest-card__media dest-sk-media" as="div" />
      <div className="dest-card__body">
        <PageSkeletonBlock className="dest-sk-title" as="div" />
        <PageSkeletonBlock className="dest-sk-line" as="div" />
        <PageSkeletonBlock className="dest-sk-line dest-sk-line--short" as="div" />
        <div className="dest-card__actions">
          <PageSkeletonBlock className="dest-sk-btn dest-sk-btn--primary" as="div" />
          <PageSkeletonBlock className="dest-sk-btn" as="div" />
        </div>
      </div>
    </article>
  )
}

export function DestinationsPageMainSkeleton() {
  return (
    <div className="dest-page-main-skeleton" aria-busy="true" aria-label="Đang tải điểm đến">
      <PageSkeletonBlock className="dest-sk-back" as="div" />
      <div className="dest-filter-bar dest-filter-bar--skeleton">
        <div className="dest-filter-group">
          {Array.from({ length: 4 }, (_, i) => (
            <PageSkeletonBlock key={`area-${i}`} className="dest-sk-chip" as="div" />
          ))}
        </div>
        <div className="dest-filter-group">
          {Array.from({ length: 4 }, (_, i) => (
            <PageSkeletonBlock key={`type-${i}`} className="dest-sk-chip" as="div" />
          ))}
        </div>
        <PageSkeletonBlock className="dest-sk-count" as="div" />
      </div>
      <div className="dest-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <DestinationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
