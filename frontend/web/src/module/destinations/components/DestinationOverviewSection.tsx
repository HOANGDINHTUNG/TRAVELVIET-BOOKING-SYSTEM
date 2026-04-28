import { Info } from 'lucide-react'
import type { DestinationDetail } from '../database/interface/destination'
import type { DestinationDetailCopy } from '../utils/destinationDetailCopy'
import type { DestinationDetailViewModel } from '../utils/destinationDetailViewModel'

type DestinationOverviewSectionProps = {
  copy: DestinationDetailCopy
  detail: DestinationDetail
  viewModel: DestinationDetailViewModel
}

export function DestinationOverviewSection({
  copy,
  detail,
  viewModel,
}: DestinationOverviewSectionProps) {
  return (
    <section className="destination-detail-section destination-detail-overview">
      <article className="destination-detail-story">
        <p className="destination-detail-kicker">{copy.overviewKicker}</p>
        <h2>{copy.overviewTitle(detail.name)}</h2>
        {viewModel.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <aside className="destination-detail-facts">
        <div className="destination-detail-facts-head">
          <Info aria-hidden="true" />
          <span>{copy.dossierTitle}</span>
        </div>
        <dl>
          {viewModel.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </section>
  )
}
