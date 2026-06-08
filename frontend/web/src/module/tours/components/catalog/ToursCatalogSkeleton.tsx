import type { ElementType } from 'react'

import './ToursCatalogSkeleton.css'

type SkProps = {
  className?: string
  as?: ElementType
}

function Sk({ className = '', as: Tag = 'span' }: SkProps) {
  return <Tag className={`tours-vt-sk ${className}`.trim()} aria-hidden />
}

function ToursCatalogSearchSkeleton() {
  return (
    <div className="tours-vt-search-overlap" aria-hidden>
      <div className="tours-vt-search-form tours-vt-search-form--skeleton">
        <Sk className="tours-vt-sk--kicker" />
        <div className="tours-vt-search-form__grid">
          <div className="tours-vt-search-cell tours-vt-search-cell--wide">
            <Sk className="tours-vt-sk--cell-label" />
            <Sk className="tours-vt-sk--cell-value" />
          </div>
          {Array.from({ length: 4 }, (_, i) => (
            <div className="tours-vt-search-cell" key={i}>
              <Sk className="tours-vt-sk--cell-label" />
              <Sk className="tours-vt-sk--cell-value" />
            </div>
          ))}
          <Sk className="tours-vt-sk--submit" as="div" />
        </div>
      </div>
    </div>
  )
}

function ToursCatalogSidebarSkeleton() {
  return (
    <aside className="tours-vt-sidebar tours-vt-sidebar--skeleton" aria-hidden>
      <div className="tours-vt-sidebar-head">
        <Sk className="tours-vt-sk--sidebar-title" />
        <Sk className="tours-vt-sk--sidebar-reset" />
      </div>
      <Sk className="tours-vt-sk--esg-row" />
      <div className="tours-vt-filter-block">
        <Sk className="tours-vt-sk--block-title" />
        {Array.from({ length: 5 }, (_, i) => (
          <Sk className="tours-vt-sk--check-row" key={`line-${i}`} />
        ))}
      </div>
      <div className="tours-vt-filter-block">
        <Sk className="tours-vt-sk--block-title" />
        {Array.from({ length: 2 }, (_, i) => (
          <Sk className="tours-vt-sk--check-row" key={`transport-${i}`} />
        ))}
      </div>
      <div className="tours-vt-filter-block">
        <Sk className="tours-vt-sk--block-title" />
        <Sk className="tours-vt-sk--range" />
        <Sk className="tours-vt-sk--check-row" />
      </div>
    </aside>
  )
}

function ToursCatalogCardSkeleton() {
  return (
    <article className="tours-catalog-card tours-catalog-card--skeleton">
      <div className="tours-catalog-card__media">
        <Sk className="tours-catalog-card__tag-slot" />
        <Sk className="tours-catalog-card__esg-slot" />
      </div>
      <div className="tours-catalog-card__foot-anchor">
        <div className="tours-catalog-card__foot-anchor-inner">
          <div className="tours-catalog-card__panel">
            <Sk className="tours-vt-sk--card-title" />
            <Sk className="tours-vt-sk--card-line" />
            <Sk className="tours-vt-sk--card-line tours-vt-sk--card-line-mid" />
            <Sk className="tours-vt-sk--card-line" />
            <div className="tours-vt-sk--card-badges">
              <Sk className="tours-vt-sk--card-badge" />
              <Sk className="tours-vt-sk--card-badge" />
              <Sk className="tours-vt-sk--card-badge" />
            </div>
            <div className="tours-catalog-card__foot">
              <div>
                <Sk className="tours-vt-sk--card-price-label" />
                <Sk className="tours-vt-sk--card-price" />
              </div>
              <Sk className="tours-vt-sk--card-cta" />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

type ToursCatalogSkeletonProps = {
  view?: 'grid' | 'list'
  cardCount?: number
}

export function ToursCatalogSkeleton({
  view = 'grid',
  cardCount = 6,
}: ToursCatalogSkeletonProps) {
  const gridClass = view === 'list' ? 'is-list' : 'is-grid'

  return (
    <main
      className="tours-vt-page tours-catalog-page is-skeleton-loading"
      aria-busy="true"
      aria-label="Đang tải danh sách tour"
    >
      <header className="tours-vt-hero -mt-13 md:-mt-19" aria-hidden>
        <div className="tours-vt-hero-inner">
          <Sk className="tours-vt-sk--hero-title" as="div" />
          <Sk className="tours-vt-sk--hero-lead" as="div" />
          <Sk className="tours-vt-sk--hero-lead-short" as="div" />
        </div>
      </header>

      <ToursCatalogSearchSkeleton />

      <div className="tours-vt-body">
        <ToursCatalogSidebarSkeleton />

        <section aria-hidden>
          <div className="tours-vt-main-toolbar tours-vt-main-toolbar--skeleton">
            <Sk className="tours-vt-sk--results" />
            <div className="tours-vt-toolbar-actions">
              <Sk className="tours-vt-sk--sort" />
              <div className="tours-vt-view-toggle">
                <Sk className="tours-vt-sk--toggle" />
                <Sk className="tours-vt-sk--toggle" />
              </div>
            </div>
          </div>

          <div className={`tours-vt-grid catalog-grid ${gridClass}`}>
            {Array.from({ length: cardCount }, (_, i) => (
              <ToursCatalogCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
