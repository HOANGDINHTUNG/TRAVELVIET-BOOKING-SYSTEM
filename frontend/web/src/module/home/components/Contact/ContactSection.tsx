import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Tour } from '../../database/travelData'
import './ContactSection.css'

type ContactSectionProps = {
  tours: Tour[]
  selectedTour: string
  submitted: boolean
  onTourChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ContactSection({
  tours,
  selectedTour,
  submitted,
  onTourChange,
  onSubmit,
}: ContactSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="contact-section" id="contact">
      <div>
        <p className="eyebrow">{t('contact.eyebrow')}</p>
        <h2>{t('contact.title')}</h2>
        <p>{t('contact.copy')}</p>
      </div>

      <form className="contact-form" onSubmit={onSubmit}>
        <label>
          {t('contact.name')}
          <input
            required
            type="text"
            placeholder={t('contact.namePlaceholder')}
          />
        </label>
        <label>
          {t('contact.phone')}
          <input
            required
            type="tel"
            placeholder={t('contact.phonePlaceholder')}
          />
        </label>
        <label>
          {t('contact.tour')}
          <select
            value={selectedTour}
            onChange={(event) => onTourChange(event.target.value)}
          >
            {tours.map((tour) => (
              <option key={tour.id} value={tour.title}>
                {tour.translationKey
                  ? t(`data.tours.${tour.translationKey}.title`)
                  : tour.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('contact.note')}
          <textarea placeholder={t('contact.notePlaceholder')} />
        </label>
        <button type="submit">{t('contact.submit')}</button>
        {submitted && <p className="form-status">{t('contact.status')}</p>}
      </form>
    </section>
  )
}
