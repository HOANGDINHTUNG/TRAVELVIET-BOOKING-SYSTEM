import { Sparkles, Utensils } from 'lucide-react'
import type { DestinationDetail } from '../database/interface/destination'
import type { DestinationDetailCopy } from '../utils/destinationDetailCopy'
import { DestinationEmptyLine } from './DestinationEmptyLine'
import { DestinationSectionTitle } from './DestinationSectionTitle'

type DestinationFoodSpecialtySectionProps = {
  copy: DestinationDetailCopy
  detail: DestinationDetail
}

export function DestinationFoodSpecialtySection({
  copy,
  detail,
}: DestinationFoodSpecialtySectionProps) {
  return (
    <section className="destination-detail-section destination-detail-two-column">
      <div>
        <DestinationSectionTitle kicker={copy.foodKicker} title={copy.foodTitle} />
        {detail.foods.length > 0 ? (
          <div className="destination-detail-list">
            {detail.foods.map((food) => (
              <article key={food.id}>
                <Utensils aria-hidden="true" />
                <div>
                  <strong>{food.foodName}</strong>
                  <p>{food.description || copy.noItemDescription}</p>
                  {food.isFeatured && <span>{copy.featured}</span>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <DestinationEmptyLine label={copy.noFood} />
        )}
      </div>

      <div>
        <DestinationSectionTitle
          kicker={copy.specialtyKicker}
          title={copy.specialtyTitle}
        />
        {detail.specialties.length > 0 ? (
          <div className="destination-detail-list">
            {detail.specialties.map((specialty) => (
              <article key={specialty.id}>
                <Sparkles aria-hidden="true" />
                <div>
                  <strong>{specialty.specialtyName}</strong>
                  <p>{specialty.description || copy.noItemDescription}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <DestinationEmptyLine label={copy.noSpecialty} />
        )}
      </div>
    </section>
  )
}
