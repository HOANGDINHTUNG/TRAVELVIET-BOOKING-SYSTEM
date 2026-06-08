import { useTranslation } from 'react-i18next'
import './ComboAboutContent.css'

export function ComboAboutContent() {
  const { t } = useTranslation('translation', { keyPrefix: 'combosPage' })

  const section1Items = t('about.section1Items', { returnObjects: true }) as string[]
  const section2Items = t('about.section2Items', { returnObjects: true }) as string[]
  const section3Items = t('about.section3Items', { returnObjects: true }) as string[]
  const supportItems = t('about.supportItems', { returnObjects: true }) as string[]

  return (
    <section className="combo-about" aria-labelledby="combo-about-title">
      <div className="combo-about__inner">
        <h2 id="combo-about-title" className="combo-about__title">
          {t('about.title')}
        </h2>
        <p className="combo-about__intro">{t('about.intro')}</p>

        <h3 className="combo-about__subtitle">{t('about.section1Title')}</h3>
        <ul className="combo-about__list">
          {section1Items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="combo-about__subtitle">{t('about.section2Title')}</h3>
        <ul className="combo-about__list">
          {section2Items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="combo-about__subtitle">{t('about.section3Title')}</h3>
        <ul className="combo-about__list">
          {section3Items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="combo-about__subtitle">{t('about.supportTitle')}</h3>
        <ul className="combo-about__list">
          {supportItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="combo-about__closing">{t('about.closing')}</p>
      </div>
    </section>
  )
}
