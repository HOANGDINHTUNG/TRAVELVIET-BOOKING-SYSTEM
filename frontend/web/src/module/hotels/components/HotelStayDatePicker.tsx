import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

type HotelStayDatePickerProps = {
  checkIn: string
  checkOut: string
  onCheckInChange: (iso: string) => void
  onCheckOutChange: (iso: string) => void
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

function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseIso(checkIn).getTime()
  const b = parseIso(checkOut).getTime()
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24))
  return Math.max(1, diff)
}

export function HotelStayDatePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: HotelStayDatePickerProps) {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'hotelsPage' })
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeField, setActiveField] = useState<'checkIn' | 'checkOut'>('checkIn')
  const [viewMonth, setViewMonth] = useState(() => {
    const d = parseIso(checkIn)
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut])

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
    if (activeField === 'checkIn') {
      onCheckInChange(iso)
      if (checkOut <= iso) {
        const next = new Date(d)
        next.setDate(next.getDate() + 1)
        onCheckOutChange(toIso(next))
      }
    } else {
      onCheckOutChange(iso)
    }
  }

  const renderMonth = (monthDate: Date) => {
    const weeks = buildMonthGrid(monthDate)
    return (
      <div className="hotel-cal__month" key={monthDate.toISOString()}>
        <p className="hotel-cal__month-title">{monthLabel(monthDate, i18n.language)}</p>
        <div className="hotel-cal__weekdays">
          {weekdays.map((wd, i) => (
            <span key={wd} className={`hotel-cal__weekday${i === 6 ? ' is-sun' : ''}`}>
              {wd}
            </span>
          ))}
        </div>
        <div className="hotel-cal__grid">
          {weeks.map((week, wi) =>
            week.map((cell, di) => {
              if (!cell) {
                return <span key={`${wi}-${di}-e`} className="hotel-cal__day is-empty" />
              }
              const isPast = cell < today && !isSameDay(cell, today)
              const isCheckIn = isSameDay(cell, parseIso(checkIn))
              const isCheckOut = checkOut && isSameDay(cell, parseIso(checkOut))
              const isToday = isSameDay(cell, today)
              const isSun = cell.getDay() === 0

              return (
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  disabled={isPast}
                  className={[
                    'hotel-cal__day',
                    isPast ? 'is-disabled' : '',
                    isCheckIn ? 'is-selected' : '',
                    isCheckOut ? 'is-selected-secondary' : '',
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
    <div className="hotel-date-pill" ref={rootRef}>
      <span className="hotel-date-pill__icon" aria-hidden>
        <Calendar size={18} strokeWidth={2} />
      </span>

      <button
        type="button"
        className={`hotel-date-pill__segment${activeField === 'checkIn' && open ? ' is-focus' : ''}`}
        onClick={() => {
          setActiveField('checkIn')
          setOpen(true)
        }}
      >
        <span className="hotel-date-pill__label">{t('search.checkInLabel')}</span>
        <span className="hotel-date-pill__value is-active">
          {formatDisplay(checkIn, i18n.language)}
        </span>
      </button>

      <span className="hotel-date-pill__divider" aria-hidden />

      <button
        type="button"
        className={`hotel-date-pill__segment${activeField === 'checkOut' && open ? ' is-focus' : ''}`}
        onClick={() => {
          setActiveField('checkOut')
          setOpen(true)
        }}
      >
        <span className="hotel-date-pill__label">{t('search.checkOutLabel')}</span>
        <span className="hotel-date-pill__value is-active">
          {formatDisplay(checkOut, i18n.language)}
        </span>
      </button>

      <span className="hotel-date-pill__nights" aria-label={t('search.nightsBadge', { count: nights })}>
        {t('search.nightsBadge', { count: nights })}
      </span>

      {open ? (
        <div className="hotel-cal" role="dialog" aria-label={t('search.calendarAria')}>
          <div className="hotel-cal__nav">
            <button
              type="button"
              className="hotel-cal__nav-btn"
              aria-label={t('search.prevMonth')}
              onClick={() =>
                setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
              }
            >
              <ChevronLeft size={18} />
            </button>
            <div className="hotel-cal__months">
              {renderMonth(monthA)}
              {renderMonth(monthB)}
            </div>
            <button
              type="button"
              className="hotel-cal__nav-btn"
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
