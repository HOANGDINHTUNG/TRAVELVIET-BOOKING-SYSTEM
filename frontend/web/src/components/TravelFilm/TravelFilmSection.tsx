import { useTranslation } from 'react-i18next'
import { Camera, Clock3, MapPin, Route } from 'lucide-react'
import './TravelFilmSection.css'

const routeIcons = [
  <Route size={18} strokeWidth={1.9} aria-hidden="true" />,
  <MapPin size={18} strokeWidth={1.9} aria-hidden="true" />,
  <Clock3 size={18} strokeWidth={1.9} aria-hidden="true" />,
]

export function TravelFilmSection() {
  const { t } = useTranslation()

  return (
    <section className="travel-film-section" aria-labelledby="travel-film-title">
      <div className="travel-film-shell">
        <div className="travel-film-copy">
          <p className="eyebrow">{t('travelFilm.eyebrow')}</p>
          <h2 id="travel-film-title">{t('travelFilm.title')}</h2>
          <p>{t('travelFilm.copy')}</p>

          <div className="travel-film-route">
            {[0, 1, 2].map((item) => (
              <article key={item}>
                {routeIcons[item]}
                <div>
                  <span>{t(`travelFilm.route.${item}.label`)}</span>
                  <strong>{t(`travelFilm.route.${item}.value`)}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="travel-video-shell">
          <div className="travel-video-toolbar">
            <span>
              <Camera size={15} strokeWidth={2} aria-hidden="true" />
              {t('travelFilm.videoTitle')}
            </span>
            <small>{t('travelFilm.videoDuration')}</small>
          </div>

          <div className="travel-video-frame">
            <img
              className="travel-preview-image"
              data-speed="0.92"
              data-motion-image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=85"
              alt={t('travelFilm.previewAlt')}
            />
            <div className="travel-video-shade" />
            <span className="travel-preview-badge" data-motion-float>
              {t('travelFilm.previewBadge')}
            </span>
          </div>

          <div className="travel-video-caption">
            <span>{t('travelFilm.panelLabel')}</span>
            <strong>{t('travelFilm.panelTitle')}</strong>
            <p>{t('travelFilm.panelCopy')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
