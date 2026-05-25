import { useTranslation } from 'react-i18next'
import { OptimizedImage } from '@/components/common/media/OptimizedImage'
import { FLIGHT_DESTINATION_IMAGES } from '../data/flightMockData'
import './FlightFeaturedDestinations.css'

export function FlightFeaturedDestinations() {
  const { t } = useTranslation('translation', { keyPrefix: 'flightsPage' })
  const destinations = t('featured.destinations', {
    returnObjects: true,
  }) as Array<{ name: string; alt: string }>

  return (
    <section className="flight-featured" aria-labelledby="flight-featured-title">
      <div className="flight-featured__inner">
        <h2 id="flight-featured-title" className="flight-featured__title">
          {t('featured.title')}
        </h2>
        <ul className="flight-featured__grid" aria-label={t('featured.sectionAria')}>
          {destinations.map((dest, index) => (
            <li key={dest.name} className="flight-featured__item">
              <div className="flight-featured__pill">
                <OptimizedImage
                  src={FLIGHT_DESTINATION_IMAGES[index] ?? FLIGHT_DESTINATION_IMAGES[0]}
                  alt={dest.alt}
                  width={200}
                  height={400}
                  cloudinaryWidth={400}
                  priority={index === 0}
                  className="flight-featured__img"
                />
                <span className="flight-featured__caption">{dest.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
