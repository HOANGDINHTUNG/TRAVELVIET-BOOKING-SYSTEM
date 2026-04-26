import { Navigation } from 'lucide-react'
import type { DestinationDetail } from '../database/interface/destination'
import type { DestinationDetailCopy } from '../utils/destinationDetailCopy'
import { formatScore } from '../utils/destinationDetailFormatters'
import { DestinationEmptyLine } from './DestinationEmptyLine'
import { DestinationSectionTitle } from './DestinationSectionTitle'

type DestinationActivitiesSectionProps = {
  copy: DestinationDetailCopy
  detail: DestinationDetail
}

export function DestinationActivitiesSection({
  copy,
  detail,
}: DestinationActivitiesSectionProps) {
  return (
    <section className="destination-detail-section">
      <DestinationSectionTitle
        kicker={copy.activityKicker}
        title={copy.activityTitle}
      />

      {detail.activities.length > 0 ? (
        <div className="destination-detail-activity-grid">
          {detail.activities.map((activity) => (
            <article key={activity.id}>
              <div>
                <Navigation aria-hidden="true" />
                <span>{formatScore(activity.activityScore, copy)}</span>
              </div>
              <h3>{activity.activityName}</h3>
              <p>{activity.description || copy.noItemDescription}</p>
            </article>
          ))}
        </div>
      ) : (
        <DestinationEmptyLine label={copy.noActivity} />
      )}
    </section>
  )
}
