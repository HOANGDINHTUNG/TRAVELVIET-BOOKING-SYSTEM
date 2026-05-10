import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { Destination, Tour } from '../../database/interface/publicTravel'
import './TourHotSection.css'

type HotCard = {
  key: string
  label: string
  image: string | null
  href: string
}

/** Ảnh mặc định gợi ý theo từng chủ đề (khi API chưa có ảnh) */
const FALLBACK_BY_LABEL: Record<string, string> = {
  'Đông Tây Bắc':
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
  'Tâm Linh':
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  'Hà Giang':
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
  'Biển Đảo':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'Hàn Quốc':
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80',
}

const DEFAULT_ORDER = [
  'Đông Tây Bắc',
  'Tâm Linh',
  'Hà Giang',
  'Biển Đảo',
  'Hàn Quốc',
] as const

type TourHotSectionProps = {
  destinations: Destination[]
  tours: Tour[]
  loading?: boolean
}

function buildCards(destinations: Destination[], tours: Tour[]): HotCard[] {
  const fromDest = destinations
    .filter((d) => d.name && (d.image || FALLBACK_BY_LABEL[d.name]))
    .slice(0, 5)
    .map((d, i) => ({
      key: `d-${d.uuid ?? i}`,
      label: d.name,
      image: d.image || FALLBACK_BY_LABEL[d.name] || null,
      href: d.uuid ? `/destinations/${d.uuid}` : '/tours',
    }))

  if (fromDest.length >= 5) {
    return fromDest
  }

  const fromTours = tours
    .filter((t) => t.title && t.image)
    .slice(0, 5 - fromDest.length)
    .map((t, i) => ({
      key: `t-${t.id ?? i}`,
      label: t.title,
      image: t.image,
      href: t.id != null ? `/tours/${t.id}` : '/tours',
    }))

  const merged: HotCard[] = [...fromDest, ...fromTours]

  while (merged.length < 5) {
    const idx = merged.length
    const label = DEFAULT_ORDER[idx]
    merged.push({
      key: `default-${idx}`,
      label,
      image: FALLBACK_BY_LABEL[label] ?? null,
      href: '/tours',
    })
  }

  return merged.slice(0, 5)
}

export function TourHotSection({
  destinations,
  tours,
  loading = false,
}: TourHotSectionProps) {
  const cards = useMemo(
    () => buildCards(destinations, tours),
    [destinations, tours],
  )

  return (
    <section className="tour-hot-section" aria-labelledby="tour-hot-heading">
      <div className="tour-hot-inner">
        <h2 id="tour-hot-heading" className="tour-hot-title">
          TOUR HOT
        </h2>
        <div className="tour-hot-grid">
          {cards.map((card) => {
            const showImg = Boolean(card.image)
            const skeleton = loading && !showImg

            return (
              <Link
                key={card.key}
                to={card.href}
                className={`tour-hot-card${skeleton ? ' tour-hot-card-skeleton' : ''}`}
              >
                {showImg ? (
                  <img src={card.image!} alt="" loading="lazy" />
                ) : (
                  <span className="tour-hot-card-placeholder" aria-hidden />
                )}
                <span className="tour-hot-card-label">{card.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
