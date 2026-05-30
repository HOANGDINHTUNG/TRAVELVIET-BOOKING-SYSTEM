import { useTranslation } from 'react-i18next'
import './HotelAboutContent.css'

export function HotelAboutContent() {
  const { t } = useTranslation('translation', { keyPrefix: 'hotelsPage' })

  const whyItems = t('about.whyItems', { returnObjects: true }) as Array<{
    title: string
    desc: string
  }>
  const standards = t('about.standards', { returnObjects: true }) as string[]

  return (
    <section className="hotel-about" aria-labelledby="hotel-about-title">
      <div className="hotel-about__inner">
        <h2 id="hotel-about-title" className="hotel-about__title">
          {t('about.title')}
        </h2>
        <p className="hotel-about__intro">{t('about.intro')}</p>

        <h3 className="hotel-about__subtitle">{t('about.whyTitle')}</h3>
        <ul className="hotel-about__list hotel-about__list--why">
          {whyItems.map((item) => (
            <li key={item.title}>
              <strong>{item.title}:</strong> {item.desc}
            </li>
          ))}
        </ul>

        <h3 className="hotel-about__subtitle">{t('about.standardsTitle')}</h3>
        <ul className="hotel-about__list">
          {standards.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="hotel-about__closing">{t('about.closing')}</p>
      </div>
    </section>
  )
}
