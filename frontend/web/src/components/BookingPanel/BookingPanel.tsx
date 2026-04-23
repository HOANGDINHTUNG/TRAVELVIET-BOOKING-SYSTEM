import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import './BookingPanel.css'

type BookingPanelProps = {
  destination: string
  destinationOptions?: string[]
  travelDate: string
  guests: number
  onDestinationChange: (value: string) => void
  onTravelDateChange: (value: string) => void
  onGuestsChange: (value: number) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function BookingPanel({
  destination,
  destinationOptions = ['Da Nang', 'Phu Quoc', 'Sa Pa'],
  travelDate,
  guests,
  onDestinationChange,
  onTravelDateChange,
  onGuestsChange,
  onSubmit,
}: BookingPanelProps) {
  const { t } = useTranslation()

  return (
    <section className="booking-panel" id="booking">
      <form className="booking-bar" onSubmit={onSubmit}>
        <label>
          {t('booking.destination')}
          <select
            value={destination}
            onChange={(event) => onDestinationChange(event.target.value)}
          >
            <option value="Tat ca">{t('booking.all')}</option>
            {destinationOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('booking.date')}
          <input
            type="date"
            value={travelDate}
            onChange={(event) => onTravelDateChange(event.target.value)}
          />
        </label>
        <label>
          {t('booking.guests')}
          <input
            min="1"
            max="30"
            type="number"
            value={guests}
            onChange={(event) => onGuestsChange(Number(event.target.value))}
          />
        </label>
        <button type="submit">{t('booking.submit')}</button>
      </form>
    </section>
  )
}
