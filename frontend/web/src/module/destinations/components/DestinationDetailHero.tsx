import { ArrowLeft, CalendarDays, Compass, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DestinationDetail } from '../database/interface/destination'
import type { DestinationDetailCopy } from '../utils/destinationDetailCopy'
import { getCrowdLabel } from '../utils/destinationDetailFormatters'
import type { DestinationDetailViewModel } from '../utils/destinationDetailViewModel'

type DestinationDetailHeroProps = {
  copy: DestinationDetailCopy
  detail: DestinationDetail
  viewModel: DestinationDetailViewModel
}

export function DestinationDetailHero({
  copy,
  detail,
  viewModel,
}: DestinationDetailHeroProps) {
  const heroLocation =
    viewModel.locationParts || detail.province || copy.facts.vietnam

  return (
    <section className="destination-detail-hero">
      <div className="destination-detail-hero-media" aria-hidden="true">
        {viewModel.heroImage ? <img src={viewModel.heroImage} alt="" /> : <span />}
      </div>

      <div className="destination-detail-hero-inner">
        <Link className="destination-detail-back" to="/">
          <ArrowLeft aria-hidden="true" />
          {copy.backHome}
        </Link>

        <div className="destination-detail-hero-grid">
          <div className="destination-detail-hero-copy">
            <p className="destination-detail-kicker">{copy.heroKicker}</p>
            <h1>{detail.name}</h1>
            <p>{detail.shortDescription || copy.defaultShort}</p>
          </div>

          <aside className="destination-detail-hero-panel">
            <div>
              <MapPin aria-hidden="true" />
              <span>{heroLocation}</span>
            </div>
            <div>
              <CalendarDays aria-hidden="true" />
              <span>{viewModel.bestTime}</span>
            </div>
            <div>
              <Compass aria-hidden="true" />
              <span>{getCrowdLabel(detail.crowdLevelDefault, copy)}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
