import { Ticket } from 'lucide-react'
import type { DestinationDetail } from '../database/interface/destination'
import type {
  DestinationDetailCopy,
  DestinationDetailLocale,
} from '../utils/destinationDetailCopy'
import { formatDateTime } from '../utils/destinationDetailFormatters'
import { DestinationEmptyLine } from './DestinationEmptyLine'
import { DestinationSectionTitle } from './DestinationSectionTitle'

type DestinationTipsEventsSectionProps = {
  copy: DestinationDetailCopy
  detail: DestinationDetail
  locale: DestinationDetailLocale
}

export function DestinationTipsEventsSection({
  copy,
  detail,
  locale,
}: DestinationTipsEventsSectionProps) {
  return (
    <section className="destination-detail-section destination-detail-two-column">
      <div>
        <DestinationSectionTitle kicker={copy.tipKicker} title={copy.tipTitle} />
        {detail.tips.length > 0 ? (
          <div className="destination-detail-step-list">
            {detail.tips.map((tip, index) => (
              <article key={tip.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{tip.tipTitle}</strong>
                  <p>{tip.tipContent || copy.noItemDescription}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <DestinationEmptyLine label={copy.noTip} />
        )}
      </div>

      <div>
        <DestinationSectionTitle
          kicker={copy.eventKicker}
          title={copy.eventTitle}
        />
        {detail.events.length > 0 ? (
          <div className="destination-detail-event-list">
            {detail.events.map((event) => (
              <article key={event.id}>
                <div>
                  <Ticket aria-hidden="true" />
                  <span>{event.eventType || copy.event}</span>
                </div>
                <strong>{event.eventName}</strong>
                <p>{event.description || copy.noItemDescription}</p>
                <small>
                  {formatDateTime(event.startsAt, locale, copy)} -{' '}
                  {formatDateTime(event.endsAt, locale, copy)}
                </small>
                <em>{event.isActive === false ? copy.inactive : copy.active}</em>
              </article>
            ))}
          </div>
        ) : (
          <DestinationEmptyLine label={copy.noEvent} />
        )}
      </div>
    </section>
  )
}
