import {
  CheckCircle2,
  Globe2,
  HeartHandshake,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DestinationDetail } from '../database/interface/destination'
import type { DestinationDetailCopy } from '../utils/destinationDetailCopy'

type DestinationPlannerCtaProps = {
  copy: DestinationDetailCopy
  detail: DestinationDetail
}

export function DestinationPlannerCta({
  copy,
  detail,
}: DestinationPlannerCtaProps) {
  return (
    <section className="destination-detail-section destination-detail-cta">
      <div>
        <p className="destination-detail-kicker">{copy.plannerKicker}</p>
        <h2>{copy.plannerTitle(detail.name)}</h2>
        <p>{copy.plannerCopy}</p>
      </div>
      <Link to="/#contact">
        <HeartHandshake aria-hidden="true" />
        {copy.plannerAction}
      </Link>
      <span aria-hidden="true">
        <Globe2 />
        <CheckCircle2 />
        <Star />
      </span>
    </section>
  )
}
