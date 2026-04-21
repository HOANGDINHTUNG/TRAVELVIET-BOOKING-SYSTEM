import { useTranslation } from 'react-i18next'
import { CalendarDays, MapPin } from 'lucide-react'
import { FiArrowUpRight } from 'react-icons/fi'
import type { Tour } from '../../data/travelData'
import './PackagesSection.css'

type PackagesSectionProps = {
  tours: Tour[]
  onSelectTour: (tourTitle: string) => void
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)

export function PackagesSection({ tours, onSelectTour }: PackagesSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="section-shell package-section" id="packages">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">{t('packages.eyebrow')}</p>
          <h2>{t('packages.title')}</h2>
        </div>
        <p>{t('packages.copy')}</p>
      </div>

      <div className="tour-grid">
        {tours.map((tour) => (
          <article className="tour-card" key={tour.id}>
            <div className="tour-image">
              <img
                src={tour.image}
                alt={t(`data.tours.${tour.translationKey}.title`)}
              />
            </div>
            <div className="tour-body">
              <h3>{t(`data.tours.${tour.translationKey}.title`)}</h3>
              <p>{t(`data.tours.${tour.translationKey}.description`)}</p>
              <div className="tour-info-list">
                <span>
                  <CalendarDays size={15} strokeWidth={1.8} />
                  {t(`data.tours.${tour.translationKey}.days`)}
                </span>
                <span>
                  <MapPin size={15} strokeWidth={1.8} />
                  {t(`data.tours.${tour.translationKey}.location`)}
                </span>
              </div>
              <div className="tour-footer">
                <div>
                  <strong>{formatPrice(tour.price)}</strong>
                  <span>{t('packages.perPerson')}</span>
                </div>
                <button type="button" onClick={() => onSelectTour(tour.title)}>
                  {t('packages.choose')}
                  <FiArrowUpRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
