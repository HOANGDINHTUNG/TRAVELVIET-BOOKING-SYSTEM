import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

type FlightDatePickerProps = {
  tripType: 'round-trip' | 'one-way'
  departDate: string
  returnDate: string
  onDepartChange: (iso: string) => void
  onReturnChange: (iso: string) => void
}

const WEEKDAYS_VI = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'] as const
const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

function parseIso(iso: string): Date {
  return new Date(`${iso}T12:00:00`)
}

function toIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplay(iso: string, locale: string): string {
  if (!iso) return ''
  return parseIso(iso).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function monthLabel(d: Date, locale: string): string {
  return d.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function buildMonthGrid(viewMonth: Date): (Date | null)[][] {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day, 12))
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function FlightDatePicker({
  tripType,
  departDate,
  returnDate,
  onDepartChange,
  onReturnChange,
}: FlightDatePickerProps) {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'flightsPage' })
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeField, setActiveField] = useState<'depart' | 'return'>('depart')
  const [viewMonth, setViewMonth] = useState(() => {
    const d = parseIso(departDate)
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const weekdays = i18n.language === 'vi' ? WEEKDAYS_VI : WEEKDAYS_EN
  const monthA = viewMonth
  const monthB = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const pickDate = (d: Date) => {
    const iso = toIso(d)
    if (activeField === 'depart') {
      onDepartChange(iso)
      if (tripType === 'round-trip' && returnDate < iso) {
        const next = new Date(d)
        next.setDate(next.getDate() + 1)
        onReturnChange(toIso(next))
      }
    } else if (tripType === 'round-trip') {
      onReturnChange(iso)
    }
  }

  const renderMonth = (monthDate: Date) => {
    const weeks = buildMonthGrid(monthDate)
    return (
      <div className="flight-cal__month" key={monthDate.toISOString()}>
        <p className="flight-cal__month-title">{monthLabel(monthDate, i18n.language)}</p>
        <div className="flight-cal__weekdays">
          {weekdays.map((wd, i) => (
            <span
              key={wd}
              className={`flight-cal__weekday${i === 6 ? ' is-sun' : ''}`}
            >
              {wd}
            </span>
          ))}
        </div>
        <div className="flight-cal__grid">
          {weeks.map((week, wi) =>
            week.map((cell, di) => {
              if (!cell) {
                return <span key={`${wi}-${di}-e`} className="flight-cal__day is-empty" />
              }
              const isPast = cell < today && !isSameDay(cell, today)
              const isDepart = isSameDay(cell, parseIso(departDate))
              const isReturn =
                tripType === 'round-trip' &&
                returnDate &&
                isSameDay(cell, parseIso(returnDate))
              const isToday = isSameDay(cell, today)
              const isSun = cell.getDay() === 0

              return (
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  disabled={isPast}
                  className={[
                    'flight-cal__day',
                    isPast ? 'is-disabled' : '',
                    isDepart ? 'is-selected' : '',
                    isReturn ? 'is-selected-secondary' : '',
                    isToday ? 'is-today' : '',
                    isSun ? 'is-sun' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => pickDate(cell)}
                >
                  {cell.getDate()}
                </button>
              )
            }),
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flight-date-pill" ref={rootRef}>
      <span className="flight-date-pill__icon" aria-hidden>
        <Calendar size={18} strokeWidth={2} />
      </span>

      <button
        type="button"
        className={`flight-date-pill__segment${activeField === 'depart' && open ? ' is-focus' : ''}`}
        onClick={() => {
          setActiveField('depart')
          setOpen(true)
        }}
      >
        <span className="flight-date-pill__label">{t('search.departLabel')}</span>
        <span className="flight-date-pill__value is-active">
          {formatDisplay(departDate, i18n.language)}
        </span>
      </button>

      <span className="flight-date-pill__divider" aria-hidden />

      <button
        type="button"
        className={`flight-date-pill__segment${activeField === 'return' && open ? ' is-focus' : ''}${
          tripType === 'one-way' ? ' is-muted' : ''
        }`}
        disabled={tripType === 'one-way'}
        onClick={() => {
          if (tripType === 'one-way') return
          setActiveField('return')
          setOpen(true)
        }}
      >
        <span className="flight-date-pill__label">{t('search.returnLabel')}</span>
        <span
          className={
            tripType === 'round-trip' && returnDate
              ? 'flight-date-pill__value is-active'
              : 'flight-date-pill__value is-placeholder'
          }
        >
          {tripType === 'round-trip'
            ? formatDisplay(returnDate, i18n.language)
            : t('search.returnLabel')}
        </span>
      </button>

      {open ? (
        <div className="flight-cal" role="dialog" aria-label={t('search.calendarAria')}>
          <div className="flight-cal__nav">
            <button
              type="button"
              className="flight-cal__nav-btn"
              aria-label={t('search.prevMonth')}
              onClick={() =>
                setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
              }
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flight-cal__months">
              {renderMonth(monthA)}
              {renderMonth(monthB)}
            </div>
            <button
              type="button"
              className="flight-cal__nav-btn"
              aria-label={t('search.nextMonth')}
              onClick={() =>
                setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
              }
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
