import { Briefcase, Plane } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getAirlineMeta } from '@/module/flights/data/flightSearchResultsMock'
import type { ComboFlightLeg } from '../data/comboSearchFlightMock'

type ComboSearchFlightBlockProps = {
  legs: ComboFlightLeg[]
}

function FlightPath({ stopLabel, durationLabel }: { stopLabel: string; durationLabel: string }) {
  return (
    <div className="csr-flight-path">
      <span className="csr-flight-path__stop">{stopLabel}</span>
      <div className="csr-flight-path__line" aria-hidden>
        <span className="csr-flight-path__dash" />
        <Plane size={13} strokeWidth={2} className="csr-flight-path__plane" />
        <span className="csr-flight-path__dash" />
      </div>
      <span className="csr-flight-path__dur">{durationLabel}</span>
    </div>
  )
}

export function ComboSearchFlightBlock({ legs }: ComboSearchFlightBlockProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'combosPage' })

  const onChangeFlight = () => {
    toast.info(t('search.comingSoonToast'))
  }

  return (
    <section className="csr-flight" aria-labelledby="csr-flight-title">
      <header className="csr-flight__head">
        <h2 id="csr-flight-title" className="csr-flight__title">
          <span className="csr-section-icon" aria-hidden>
            <Plane size={16} strokeWidth={2.2} />
          </span>
          {t('results.flightSection')}
        </h2>
        <button type="button" className="csr-flight__change" onClick={onChangeFlight}>
          {t('results.changeFlight')}
        </button>
      </header>

      <div className="csr-flight__card">
        <div className="csr-flight__body">
          {legs.map((leg, index) => {
            const airline = getAirlineMeta(leg.airlineId)
            return (
              <div
                key={leg.id}
                className={`csr-flight__row${index < legs.length - 1 ? ' csr-flight__row--bordered' : ''}`}
              >
                <div className="csr-flight__airline">
                  <span
                    className="csr-flight__logo"
                    style={{ backgroundColor: airline.brandColor }}
                    aria-hidden
                  >
                    {airline.logoText}
                  </span>
                  <span className="csr-flight__airline-name">{airline.name}</span>
                </div>

                <div className="csr-flight__time">
                  <span className="csr-flight__clock">
                    <strong>{leg.departTime}</strong> {leg.fromIata}
                  </span>
                </div>

                <FlightPath stopLabel={leg.stopLabel} durationLabel={leg.durationLabel} />

                <div className="csr-flight__time csr-flight__time--arrive">
                  <span className="csr-flight__clock">
                    <strong>{leg.arriveTime}</strong> {leg.toIata}
                  </span>
                </div>

                <div className="csr-flight__amenity">
                  <span className="csr-flight__field-label">{t('results.amenityLabel')}</span>
                  <span className="csr-flight__field-value">
                    <Briefcase size={14} strokeWidth={1.8} aria-hidden />
                    {leg.carryOnKg}kg
                  </span>
                </div>

                <div className="csr-flight__class">
                  <span className="csr-flight__field-label">{t('results.cabinLabel')}</span>
                  <strong className="csr-flight__class-value">{leg.cabinClass}</strong>
                </div>
              </div>
            )
          })}
        </div>

        <footer className="csr-flight__links">
          <button type="button">{t('results.linkFare')}</button>
          <span className="csr-flight__links-sep" aria-hidden>
            |
          </span>
          <button type="button">{t('results.linkSchedule')}</button>
          <span className="csr-flight__links-sep" aria-hidden>
            |
          </span>
          <button type="button">{t('results.linkBaggage')}</button>
        </footer>
      </div>
    </section>
  )
}
