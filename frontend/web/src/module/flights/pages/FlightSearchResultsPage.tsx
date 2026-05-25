import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Backpack,
  ChevronDown,
  ChevronUp,
  Luggage,
  Plane,
  RotateCcw,
  Search,
  Settings2,
  SlidersHorizontal,
} from 'lucide-react'
import { toast } from 'sonner'
import { Footer } from '@/components/Footer/Footer'
import {
  FLIGHT_AIRLINES,
  FLIGHT_RESULTS_BANNER_PLANE,
  FLIGHT_TIME_SLOTS,
  MOCK_BUDGET_RANGE,
  cityLabelForIata,
  formatDurationVi,
  formatPriceVnd,
  getAirlineMeta,
  getMockOffersForRoute,
  type MockFlightOffer,
} from '../data/flightSearchResultsMock'
import { useFlightResultsState, type FlightSortKey } from '../hooks/useFlightResultsState'
import { parseFlightSearchParams, totalPassengers } from '../utils/flightSearchParams'
import './FlightSearchResultsPage.css'

function formatDepartDate(iso: string, locale: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function FlightPathGraphic({ directLabel, durationLabel }: { directLabel: string; durationLabel: string }) {
  return (
    <div className="fr-path">
      <span className="fr-path__stop">{directLabel}</span>
      <div className="fr-path__line" aria-hidden>
        <span className="fr-path__dash" />
        <Plane size={14} strokeWidth={2} className="fr-path__plane" />
        <span className="fr-path__dash" />
      </div>
      <span className="fr-path__dur">{durationLabel}</span>
    </div>
  )
}

type FlightCardProps = {
  offer: MockFlightOffer
  fromIata: string
  toIata: string
  locale: string
  badge?: string
  onSelect: () => void
  t: (key: string) => string
}

function FlightResultCard({
  offer,
  fromIata,
  toIata,
  locale,
  badge,
  onSelect,
  t,
}: FlightCardProps) {
  const airline = getAirlineMeta(offer.airlineId)
  const durationLabel = formatDurationVi(offer.durationMinutes)
  const stopLabel =
    offer.stopType === 'direct' ? t('results.directFlight') : t('results.oneStop')

  return (
    <article className="fr-card">
      {badge ? <span className="fr-card__badge">{badge}</span> : null}
      <div className="fr-card__grid">
        <div className="fr-card__airline">
          <div
            className="fr-card__logo"
            style={{ backgroundColor: airline.brandColor }}
            aria-hidden
          >
            {airline.logoText}
          </div>
          <div>
            <p className="fr-card__airline-name">{airline.name}</p>
            <div className="fr-card__baggage">
              <span title={t('results.checkedBag')}>
                <Luggage size={14} aria-hidden />
                {offer.checkedBagKg}kg
              </span>
              <span title={t('results.carryOn')}>
                <Backpack size={13} aria-hidden />
                {offer.carryOnKg}kg
              </span>
            </div>
            <div className="fr-card__links">
              <button type="button">{t('results.linkFare')}</button>
              <button type="button">{t('results.linkSchedule')}</button>
              <button type="button">{t('results.linkBaggage')}</button>
            </div>
          </div>
        </div>

        <div className="fr-card__route">
          <div className="fr-card__time-block">
            <strong>{offer.departTime}</strong>
            <span>{fromIata}</span>
          </div>
          <FlightPathGraphic directLabel={stopLabel} durationLabel={durationLabel} />
          <div className="fr-card__time-block fr-card__time-block--arrive">
            <strong>{offer.arriveTime}</strong>
            <span>{toIata}</span>
          </div>
        </div>

        <div className="fr-card__price-col">
          <p className="fr-card__price">
            {formatPriceVnd(offer.priceVnd, locale)}
            <span> / {t('results.perGuest')}</span>
          </p>
          <button type="button" className="fr-card__select" onClick={onSelect}>
            {t('results.select')}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function FlightSearchResultsPage() {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'flightsPage' })
  const locale = i18n.language?.startsWith('en') ? 'en' : 'vi'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const params = useMemo(() => parseFlightSearchParams(searchParams), [searchParams])

  const offers = useMemo(
    () => getMockOffersForRoute(params.fromIata, params.toIata),
    [params.fromIata, params.toIata],
  )

  const {
    sortKey,
    setSortKey,
    quickTab,
    setQuickTab,
    bestPick,
    departList,
    lowestOffer,
    shortestOffer,
    resetFilters,
    toggleAirline,
    toggleTimeSlot,
    toggleStop,
    filters,
    setBudget,
  } = useFlightResultsState(offers)

  const [openSections, setOpenSections] = useState({
    airlines: true,
    time: true,
    stops: true,
    budget: true,
  })

  const routeTitle = `${cityLabelForIata(params.fromIata, locale)} - ${cityLabelForIata(params.toIata, locale)}`
  const paxTotal = totalPassengers(params)
  const dateLine = formatDepartDate(params.departDate, locale)

  const onSelectFlight = () => {
    toast.info(t('results.selectToast'))
  }

  const sortOptions: { value: FlightSortKey; label: string }[] = [
    { value: 'newest', label: t('results.sortNewest') },
    { value: 'price-asc', label: t('results.sortPriceAsc') },
    { value: 'price-desc', label: t('results.sortPriceDesc') },
    { value: 'duration-asc', label: t('results.sortDuration') },
  ]

  return (
    <div className="flight-results-page">
      <div className="flight-results-page__inner">
        <nav className="fr-breadcrumb" aria-label={t('results.breadcrumbAria')}>
          <Link to="/">{t('results.breadcrumbHome')}</Link>
          <span aria-hidden>/</span>
          <Link to="/flights">{t('results.breadcrumbFlights')}</Link>
          <span aria-hidden>/</span>
          <span className="fr-breadcrumb__current">{routeTitle}</span>
        </nav>

        <div className="fr-layout">
          <aside className="fr-sidebar" aria-label={t('results.filtersAria')}>
            <header className="fr-sidebar__head">
              <span className="fr-sidebar__title">
                <SlidersHorizontal size={16} aria-hidden />
                {t('results.filtersTitle')}
              </span>
              <button type="button" className="fr-sidebar__reset" onClick={resetFilters}>
                <RotateCcw size={14} aria-hidden />
                {t('results.reset')}
              </button>
            </header>

            <FilterSection
              title={t('results.airlines')}
              open={openSections.airlines}
              onToggle={() => toggleSection('airlines')}
            >
              <ul className="fr-check-list">
                {FLIGHT_AIRLINES.map((airline) => (
                  <li key={airline.id}>
                    <label className="fr-check">
                      <input
                        type="checkbox"
                        checked={filters.airlines.has(airline.id)}
                        onChange={() => toggleAirline(airline.id)}
                      />
                      <span
                        className="fr-check__logo"
                        style={{ backgroundColor: airline.brandColor }}
                        aria-hidden
                      >
                        {airline.logoText}
                      </span>
                      <span>{airline.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </FilterSection>

            <FilterSection
              title={t('results.timeSlots')}
              open={openSections.time}
              onToggle={() => toggleSection('time')}
            >
              <ul className="fr-check-list">
                {FLIGHT_TIME_SLOTS.map((slot) => (
                  <li key={slot.id}>
                    <label className="fr-check fr-check--stack">
                      <input
                        type="checkbox"
                        checked={filters.timeSlots.has(slot.id)}
                        onChange={() => toggleTimeSlot(slot.id)}
                      />
                      <span>
                        <strong>{t(slot.labelKey)}</strong>
                        <small>{t(slot.rangeKey)}</small>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </FilterSection>

            <FilterSection
              title={t('results.stops')}
              open={openSections.stops}
              onToggle={() => toggleSection('stops')}
            >
              <ul className="fr-check-list">
                <li>
                  <label className="fr-check">
                    <input
                      type="checkbox"
                      checked={filters.stops.has('direct')}
                      onChange={() => toggleStop('direct')}
                    />
                    <span>{t('results.directFlight')}</span>
                  </label>
                </li>
                <li>
                  <label className="fr-check">
                    <input
                      type="checkbox"
                      checked={filters.stops.has('one-stop')}
                      onChange={() => toggleStop('one-stop')}
                    />
                    <span>{t('results.oneStop')}</span>
                  </label>
                </li>
              </ul>
            </FilterSection>

            <FilterSection
              title={t('results.budget')}
              open={openSections.budget}
              onToggle={() => toggleSection('budget')}
            >
              <div className="fr-budget">
                <input
                  type="range"
                  className="fr-budget__range"
                  min={MOCK_BUDGET_RANGE.min}
                  max={MOCK_BUDGET_RANGE.max}
                  value={filters.budgetMax}
                  onChange={(e) =>
                    setBudget(filters.budgetMin, Number(e.target.value))
                  }
                  aria-label={t('results.budget')}
                />
                <div className="fr-budget__labels">
                  <span>{formatPriceVnd(filters.budgetMin, locale)}</span>
                  <span>{formatPriceVnd(filters.budgetMax, locale)}</span>
                </div>
              </div>
            </FilterSection>
          </aside>

          <main className="fr-main">
            <div className="fr-summary">
              <div className="fr-summary__text">
                <p className="fr-summary__route">
                  <Plane size={18} aria-hidden />
                  ({params.fromIata}) → ({params.toIata})
                </p>
                <p className="fr-summary__meta">
                  {dateLine} | {paxTotal} {t('results.passengers')}
                </p>
              </div>
              <button
                type="button"
                className="fr-summary__change"
                onClick={() => navigate('/flights')}
              >
                <Search size={16} aria-hidden />
                {t('results.changeSearch')}
              </button>
              <img
                className="fr-summary__plane"
                src={FLIGHT_RESULTS_BANNER_PLANE}
                alt=""
                width={280}
                height={120}
                loading="lazy"
              />
            </div>

            <div className="fr-quick">
              <button
                type="button"
                className={`fr-quick__card ${quickTab === 'lowest' ? 'fr-quick__card--active' : ''}`}
                onClick={() => {
                  setQuickTab('lowest')
                  setSortKey('price-asc')
                }}
              >
                <span className="fr-quick__label">{t('results.lowestPrice')}</span>
                <span className="fr-quick__value">
                  {formatPriceVnd(lowestOffer.priceVnd, locale)}
                </span>
                <span className="fr-quick__sub">
                  {formatDurationVi(lowestOffer.durationMinutes)}
                </span>
              </button>
              <button
                type="button"
                className={`fr-quick__card ${quickTab === 'shortest' ? 'fr-quick__card--active' : ''}`}
                onClick={() => {
                  setQuickTab('shortest')
                  setSortKey('duration-asc')
                }}
              >
                <span className="fr-quick__label">{t('results.shortest')}</span>
                <span className="fr-quick__value">
                  {formatDurationVi(shortestOffer.durationMinutes)}
                </span>
                <span className="fr-quick__sub">
                  {formatPriceVnd(shortestOffer.priceVnd, locale)}
                </span>
              </button>
              <div className="fr-quick__sort">
                <label htmlFor="fr-sort">{t('results.sortBy')}</label>
                <div className="fr-quick__select-wrap">
                  <select
                    id="fr-sort"
                    value={sortKey}
                    onChange={(e) => {
                      setSortKey(e.target.value as FlightSortKey)
                      setQuickTab(null)
                    }}
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} aria-hidden />
                </div>
              </div>
            </div>

            <h2 className="fr-section-title">{t('results.bestTitle')}</h2>

            {bestPick ? (
              <FlightResultCard
                offer={bestPick}
                fromIata={params.fromIata}
                toIata={params.toIata}
                locale={locale}
                badge={t('results.lowestBadge')}
                onSelect={onSelectFlight}
                t={t}
              />
            ) : null}

            <h3 className="fr-subsection-title">{t('results.departTitle')}</h3>

            <div className="fr-list">
              {departList.length === 0 ? (
                <p className="fr-empty">{t('results.noResults')}</p>
              ) : (
                departList.map((offer) => (
                  <FlightResultCard
                    key={offer.id}
                    offer={offer}
                    fromIata={params.fromIata}
                    toIata={params.toIata}
                    locale={locale}
                    onSelect={onSelectFlight}
                    t={t}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )

  function toggleSection(key: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <section className="fr-filter-section">
      <button type="button" className="fr-filter-section__head" onClick={onToggle}>
        <Settings2 size={14} aria-hidden className="fr-filter-section__icon" />
        <span>{title}</span>
        {open ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
      </button>
      {open ? <div className="fr-filter-section__body">{children}</div> : null}
    </section>
  )
}
