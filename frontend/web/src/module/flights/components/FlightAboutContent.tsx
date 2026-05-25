import { useTranslation } from 'react-i18next'
import './FlightAboutContent.css'

export function FlightAboutContent() {
  const { t } = useTranslation('translation', { keyPrefix: 'flightsPage' })

  const advantages = t('about.advantages', { returnObjects: true }) as string[]
  const classes = t('about.classes', { returnObjects: true }) as Array<{
    name: string
    desc: string
  }>

  return (
    <section className="flight-about" aria-labelledby="flight-about-title">
      <div className="flight-about__inner">
        <h2 id="flight-about-title" className="flight-about__title">
          {t('about.title')}
        </h2>
        <p className="flight-about__intro">{t('about.intro')}</p>

        <h3 className="flight-about__subtitle">{t('about.advantagesTitle')}</h3>
        <ul className="flight-about__list">
          {advantages.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="flight-about__subtitle">{t('about.classesTitle')}</h3>
        <ul className="flight-about__list flight-about__list--classes">
          {classes.map((item) => (
            <li key={item.name}>
              <strong>{item.name}:</strong> {item.desc}
            </li>
          ))}
        </ul>

        <h3 className="flight-about__subtitle">{t('about.networkTitle')}</h3>
        <p className="flight-about__network">{t('about.network')}</p>
      </div>
    </section>
  )
}
