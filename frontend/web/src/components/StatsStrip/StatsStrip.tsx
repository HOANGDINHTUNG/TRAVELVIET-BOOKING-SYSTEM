import { useTranslation } from 'react-i18next'
import './StatsStrip.css'

export function StatsStrip() {
  const { t } = useTranslation()

  return (
    <section className="stats-strip" aria-label={t('stats.label')}>
      <div>
        <strong>120+</strong>
        <span>{t('stats.items.0')}</span>
      </div>
      <div>
        <strong>4.8/5</strong>
        <span>{t('stats.items.1')}</span>
      </div>
      <div>
        <strong>24h</strong>
        <span>{t('stats.items.2')}</span>
      </div>
      <div>
        <strong>35</strong>
        <span>{t('stats.items.3')}</span>
      </div>
    </section>
  )
}
