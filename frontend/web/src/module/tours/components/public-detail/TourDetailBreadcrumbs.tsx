import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { TourBreadcrumbTrail } from '../../utils/tourRoutePath'

type TourDetailBreadcrumbsProps = {
  trail: TourBreadcrumbTrail
}

export function TourDetailBreadcrumbs({ trail }: TourDetailBreadcrumbsProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLLIElement>(null)
  const menuId = useId()
  const hasCollapsed = trail.collapsedStops.length > 0

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <nav className="tour-detail-bc" aria-label="Breadcrumb">
      <ol className="tour-detail-bc__list">
        {trail.prefix.map((item) => (
          <li key={item.label} className="tour-detail-bc__item">
            {item.href ? (
              <Link to={item.href}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}

        {hasCollapsed ? (
          <li
            ref={wrapRef}
            className={`tour-detail-bc__item tour-detail-bc__item--ellipsis${open ? ' is-open' : ''}`}
          >
            <button
              type="button"
              className="tour-detail-bc__ellipsis"
              aria-expanded={open}
              aria-controls={menuId}
              aria-haspopup="true"
              aria-label="Xem các điểm trên hành trình"
              onClick={() => setOpen((v) => !v)}
            >
              …
            </button>

            {open ? (
              <div
                id={menuId}
                className="tour-detail-bc__popover"
                role="menu"
                aria-label="Điểm trên hành trình"
              >
                {trail.collapsedStops.map((stop, index) => (
                  <div key={stop.anchorId} className="tour-detail-bc__popover-row">
                    {index > 0 ? (
                      <span className="tour-detail-bc__popover-dash" aria-hidden />
                    ) : null}
                    <a
                      role="menuitem"
                      href={`#${stop.anchorId}`}
                      onClick={() => setOpen(false)}
                    >
                      {stop.label}
                    </a>
                  </div>
                ))}
              </div>
            ) : null}
          </li>
        ) : null}

        {trail.suffix ? (
          <li className="tour-detail-bc__item">
            {trail.suffix.href ? (
              <Link to={trail.suffix.href}>{trail.suffix.label}</Link>
            ) : (
              <span>{trail.suffix.label}</span>
            )}
          </li>
        ) : null}

        <li className="tour-detail-bc__item tour-detail-bc__item--current">
          <span aria-current="page">{trail.currentTitle}</span>
        </li>
      </ol>
    </nav>
  )
}
