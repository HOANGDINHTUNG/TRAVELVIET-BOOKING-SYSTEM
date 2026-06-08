import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
} from "lucide-react";

import { Footer } from "@/components/Footer/Footer";
import { formatDurationVi, formatPriceVnd } from "@/utils/formatters";
import { cityLabelForIata, getAirlineMetaById } from "@/utils/flightHelpers";

const FLIGHT_RESULTS_BANNER_PLANE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80";
import {
  useFlightResultsState,
  type FlightSortKey,
} from "../hooks/useFlightResultsState";
import {
  parseFlightSearchParams,
  totalPassengers,
} from "../utils/flightSearchParams";
import {
  FlightFareSelectModal,
  type LegMeta,
} from "../components/FlightFareSelectModal";
import { FlightSearchLoadingSkeleton } from "../components/FlightSearchLoadingSkeleton";
import { FlightSidebarFiltersSkeleton } from "../components/FlightSidebarFiltersSkeleton";
import { useFlightSearchLoading } from "../hooks/useFlightSearchLoading";
import { saveFlightCheckoutSession } from "../lib/flightCheckoutStorage";

import { type FlightResponse } from "@/api/server/Flight.api";
import "./FlightSearchResultsPage.css";

function formatDepartDate(iso: string, locale: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

function FlightPathGraphic({
  directLabel,
  durationLabel,
}: {
  directLabel: string;
  durationLabel: string;
}) {
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
  );
}

type FlightCardProps = {
  offer: FlightResponse;
  fromIata: string;
  toIata: string;
  locale: string;
  badge?: string;
  onSelect: () => void;
  t: (key: string) => string;
};

function FlightResultCard({
  offer,
  fromIata,
  toIata,
  locale,
  badge,
  onSelect,
  t,
}: FlightCardProps) {
  // Map backend data to existing airline meta logic if possible
  const airline = getAirlineMetaById(offer.airlineId);
  const durationLabel = formatDurationVi(offer.durationMinutes);
  const stopLabel = t("results.directFlight"); // Default to direct for now

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
            <p className="fr-card__airline-name">{offer.airlineName}</p>
            <div className="fr-card__baggage">
              <span title={t("results.checkedBag")}>
                <Luggage size={14} aria-hidden />
                20kg
              </span>
              <span title={t("results.carryOn")}>
                <Backpack size={13} aria-hidden />
                7kg
              </span>
            </div>
            <div className="fr-card__links">
              <button type="button">{t("results.linkFare")}</button>
              <button type="button">{t("results.linkSchedule")}</button>
              <button type="button">{t("results.linkBaggage")}</button>
            </div>
          </div>
        </div>

        <div className="fr-card__route">
          <div className="fr-card__time-block">
            <strong>
              {new Date(offer.departureTimeLocal).toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </strong>
            <span>{fromIata}</span>
          </div>
          <FlightPathGraphic
            directLabel={stopLabel}
            durationLabel={durationLabel}
          />
          <div className="fr-card__time-block fr-card__time-block--arrive">
            <strong>
              {new Date(offer.arrivalTimeLocal).toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </strong>
            <span>{toIata}</span>
          </div>
        </div>

        <div className="fr-card__price-col">
          <p className="fr-card__price">
            {formatPriceVnd(offer.minPrice, locale)}
            <span> / {t("results.perGuest")}</span>
          </p>
          <button type="button" className="fr-card__select" onClick={onSelect}>
            {t("results.select")}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function FlightSearchResultsPage() {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "flightsPage",
  });
  const locale = i18n.language?.startsWith("en") ? "en" : "vi";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useMemo(
    () => parseFlightSearchParams(searchParams),
    [searchParams],
  );
  const { progress, isLoading: searchLoading } = useFlightSearchLoading(
    searchParams.toString(),
  );

  const isRoundTrip =
    params.tripType === "round-trip" && Boolean(params.returnDate);
  const paxTotal = totalPassengers(params);
  const outboundDateLine = formatDepartDate(params.departDate, locale);
  const inboundDateLine = params.returnDate
    ? formatDepartDate(params.returnDate, locale)
    : "";

  const [activeLeg, setActiveLeg] = useState<"outbound" | "inbound">(
    "outbound",
  );
  const [selectedOutbound, setSelectedOutbound] =
    useState<FlightResponse | null>(null);
  const [selectedInbound, setSelectedInbound] = useState<FlightResponse | null>(
    null,
  );
  const [fareModalOpen, setFareModalOpen] = useState(false);

  const fromIata = activeLeg === "outbound" ? params.fromIata : params.toIata;
  const toIata = activeLeg === "outbound" ? params.toIata : params.fromIata;

  const {
    loading: apiLoading,
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
    filters,
    setBudget,
  } = useFlightResultsState({
    originCode: params.fromIata || undefined,
    destinationCode: params.toIata || undefined,
    departureDate:
      activeLeg === "outbound" ? params.departDate : params.returnDate,
    passengers: paxTotal,
  });

  const isLoading = searchLoading || apiLoading;

  const [openSections, setOpenSections] = useState({
    airlines: true,
    time: true,
    stops: true,
    budget: true,
  });

  const routeTitle = `${cityLabelForIata(params.fromIata, locale)} - ${cityLabelForIata(params.toIata, locale)}`;

  const onSelectFlight = (offer: FlightResponse) => {
    if (activeLeg === "outbound") {
      setSelectedOutbound(offer);
      if (isRoundTrip) {
        setActiveLeg("inbound");
        return;
      }
      setFareModalOpen(true);
      return;
    }
    setSelectedInbound(offer);
    setFareModalOpen(true);
  };

  const sortOptions: { value: FlightSortKey; label: string }[] = [
    { value: "newest", label: t("results.sortNewest") },
    { value: "price-asc", label: t("results.sortPriceAsc") },
    { value: "price-desc", label: t("results.sortPriceDesc") },
    { value: "duration-asc", label: t("results.sortDuration") },
  ];

  // Mock airlines data for filters (can be improved by fetching from BE if available)
  const FLIGHT_AIRLINES_OPTIONS = [
    { id: 1, name: "Vietnam Airlines", brandColor: "#00255c", logoText: "VN" },
    { id: 2, name: "Vietjet Air", brandColor: "#ee1c25", logoText: "VJ" },
    { id: 3, name: "Bamboo Airways", brandColor: "#0065b3", logoText: "QH" },
  ];

  const TIME_SLOTS: Record<string, { label: string; range: string }> = {
    early: { label: "Sáng sớm", range: "00:00 - 06:00" },
    morning: { label: "Buổi sáng", range: "06:00 - 12:00" },
    afternoon: { label: "Buổi chiều", range: "12:00 - 18:00" },
    evening: { label: "Buổi tối", range: "18:00 - 24:00" },
  };

  return (
    <div className="flight-results-page">
      <div className="flight-results-page__inner">
        <nav className="fr-breadcrumb" aria-label={t("results.breadcrumbAria")}>
          <Link to="/">{t("results.breadcrumbHome")}</Link>
          <span aria-hidden>/</span>
          <Link to="/flights">{t("results.breadcrumbFlights")}</Link>
          <span aria-hidden>/</span>
          <span className="fr-breadcrumb__current">{routeTitle}</span>
        </nav>

        <div className="fr-layout">
          <aside className="fr-sidebar" aria-label={t("results.filtersAria")}>
            <div className="fr-itinerary" aria-label="Lịch trình">
              <div className="fr-itinerary__head">
                <span className="fr-itinerary__route">
                  {params.fromIata} → {params.toIata}
                </span>
                <button
                  type="button"
                  className="fr-itinerary__toggle"
                  aria-label="Thu gọn"
                  onClick={() => {}}
                >
                  <ChevronUp size={16} aria-hidden />
                </button>
              </div>
              <div className="fr-itinerary__steps">
                <button
                  type="button"
                  className={`fr-itinerary__step${activeLeg === "outbound" ? " is-active" : ""}${
                    selectedOutbound && activeLeg !== "outbound"
                      ? " is-done"
                      : ""
                  }`}
                  onClick={() => setActiveLeg("outbound")}
                >
                  <span className="fr-itinerary__num">1</span>
                  <span className="fr-itinerary__text">
                    <span className="fr-itinerary__date">
                      {outboundDateLine}
                    </span>
                    <strong>
                      {params.fromIata} → {params.toIata}
                    </strong>
                  </span>
                </button>
                {isRoundTrip ? (
                  <button
                    type="button"
                    className={`fr-itinerary__step${activeLeg === "inbound" ? " is-active" : ""}${
                      selectedOutbound && activeLeg === "inbound"
                        ? " is-await"
                        : ""
                    }${selectedInbound ? " is-done" : ""}`}
                    onClick={() => setActiveLeg("inbound")}
                    disabled={!selectedOutbound}
                  >
                    <span className="fr-itinerary__num">2</span>
                    <span className="fr-itinerary__text">
                      <span className="fr-itinerary__date">
                        {inboundDateLine}
                      </span>
                      <strong>
                        {params.toIata} → {params.fromIata}
                      </strong>
                    </span>
                  </button>
                ) : null}
              </div>
            </div>

            <header className="fr-sidebar__head">
              <span className="fr-sidebar__title">
                <SlidersHorizontal size={16} aria-hidden />
                {t("results.filtersTitle")}
              </span>
              <button
                type="button"
                className="fr-sidebar__reset"
                onClick={resetFilters}
                disabled={isLoading}
              >
                <RotateCcw size={14} aria-hidden />
                {t("results.reset")}
              </button>
            </header>

            {isLoading ? (
              <FlightSidebarFiltersSkeleton />
            ) : (
              <>
                <FilterSection
                  title={t("results.airlines")}
                  open={openSections.airlines}
                  onToggle={() => toggleSection("airlines")}
                >
                  <ul className="fr-check-list">
                    {FLIGHT_AIRLINES_OPTIONS.map((airline) => (
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
                  title={t("results.timeSlots")}
                  open={openSections.time}
                  onToggle={() => toggleSection("time")}
                >
                  <ul className="fr-check-list">
                    {["early", "morning", "afternoon", "evening"].map(
                      (slotId) => (
                        <li key={slotId}>
                          <label className="fr-check fr-check--stack">
                            <input
                              type="checkbox"
                              checked={filters.timeSlots.has(slotId)}
                              onChange={() => toggleTimeSlot(slotId)}
                            />
                            <span>
                              <strong>
                                {TIME_SLOTS[slotId]?.label || slotId}
                              </strong>
                              <small>{TIME_SLOTS[slotId]?.range || ""}</small>
                            </span>
                          </label>
                        </li>
                      ),
                    )}
                  </ul>
                </FilterSection>

                <FilterSection
                  title={t("results.budget")}
                  open={openSections.budget}
                  onToggle={() => toggleSection("budget")}
                >
                  <div className="fr-budget">
                    <input
                      type="range"
                      className="fr-budget__range"
                      min={0}
                      max={50000000}
                      value={filters.budgetMax}
                      onChange={(e) =>
                        setBudget(filters.budgetMin, Number(e.target.value))
                      }
                      aria-label={t("results.budget")}
                    />
                    <div className="fr-budget__labels">
                      <span>{formatPriceVnd(filters.budgetMin, locale)}</span>
                      <span>{formatPriceVnd(filters.budgetMax, locale)}</span>
                    </div>
                  </div>
                </FilterSection>
              </>
            )}
          </aside>

          <main className="fr-main">
            <div className="fr-summary">
              <div className="fr-summary__text">
                <p className="fr-summary__route">
                  <Plane size={18} aria-hidden />({fromIata}) → ({toIata})
                </p>
                <p className="fr-summary__meta">
                  {(activeLeg === "outbound"
                    ? outboundDateLine
                    : inboundDateLine) || outboundDateLine}{" "}
                  | {paxTotal} {t("results.passengers")}
                </p>
              </div>
              <button
                type="button"
                className="fr-summary__change"
                onClick={() => navigate("/flights")}
              >
                <Search size={16} aria-hidden />
                {t("results.changeSearch")}
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

            {isLoading ? (
              <FlightSearchLoadingSkeleton progress={progress} />
            ) : (
              <>
                <div className="fr-quick">
                  <button
                    type="button"
                    className={`fr-quick__card ${quickTab === "lowest" ? "fr-quick__card--active" : ""}`}
                    onClick={() => {
                      setQuickTab("lowest");
                      setSortKey("price-asc");
                    }}
                  >
                    <span className="fr-quick__label">
                      {t("results.lowestPrice")}
                    </span>
                    <span className="fr-quick__value">
                      {lowestOffer
                        ? formatPriceVnd(lowestOffer.minPrice, locale)
                        : "-"}
                    </span>
                    <span className="fr-quick__sub">
                      {lowestOffer
                        ? formatDurationVi(lowestOffer.durationMinutes)
                        : "-"}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`fr-quick__card ${quickTab === "shortest" ? "fr-quick__card--active" : ""}`}
                    onClick={() => {
                      setQuickTab("shortest");
                      setSortKey("duration-asc");
                    }}
                  >
                    <span className="fr-quick__label">
                      {t("results.shortest")}
                    </span>
                    <span className="fr-quick__value">
                      {shortestOffer
                        ? formatDurationVi(shortestOffer.durationMinutes)
                        : "-"}
                    </span>
                    <span className="fr-quick__sub">
                      {shortestOffer
                        ? formatPriceVnd(shortestOffer.minPrice, locale)
                        : "-"}
                    </span>
                  </button>
                  <div className="fr-quick__sort">
                    <label htmlFor="fr-sort">{t("results.sortBy")}</label>
                    <div className="fr-quick__select-wrap">
                      <select
                        id="fr-sort"
                        value={sortKey}
                        onChange={(e) => {
                          setSortKey(e.target.value as FlightSortKey);
                          setQuickTab(null);
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

                <h2 className="fr-section-title">{t("results.bestTitle")}</h2>

                {bestPick ? (
                  <FlightResultCard
                    offer={bestPick}
                    fromIata={fromIata}
                    toIata={toIata}
                    locale={locale}
                    badge={t("results.lowestBadge")}
                    onSelect={() => onSelectFlight(bestPick)}
                    t={t}
                  />
                ) : null}

                <h3 className="fr-subsection-title">
                  {t("results.departTitle")}
                </h3>

                <div className="fr-list">
                  {departList.length === 0 ? (
                    <p className="fr-empty">{t("results.noResults")}</p>
                  ) : (
                    departList.map((offer) => (
                      <FlightResultCard
                        key={offer.id}
                        offer={offer}
                        fromIata={fromIata}
                        toIata={toIata}
                        locale={locale}
                        onSelect={() => onSelectFlight(offer)}
                        t={t}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
      {!isLoading ? <Footer /> : null}

      {(selectedOutbound ?? bestPick) && (
        <FlightFareSelectModal
          open={fareModalOpen}
          onClose={() => setFareModalOpen(false)}
          outbound={
            {
              label: "Bay đi",
              fromIata: params.fromIata,
              toIata: params.toIata,
              dateLabel: outboundDateLine,
              paxLabel: `${paxTotal} hành khách`,
              offer: (selectedOutbound ?? bestPick) as FlightResponse,
            } as LegMeta
          }
          inbound={
            isRoundTrip &&
            params.returnDate &&
            selectedOutbound &&
            selectedInbound
              ? ({
                  label: "Bay về",
                  fromIata: params.toIata,
                  toIata: params.fromIata,
                  dateLabel: inboundDateLine,
                  paxLabel: `${paxTotal} hành khách`,
                  offer: selectedInbound,
                } as LegMeta)
              : undefined
          }
          locale={locale}
          onConfirm={({ outboundFareId, inboundFareId }) => {
            const outOffer = selectedOutbound ?? bestPick;
            if (!outOffer) return;

            // Placeholder for real fare options logic
            const mockFare = {
              id: outboundFareId,
              priceVnd: outOffer.minPrice,
            };

            const inOffer = selectedInbound;
            const inFare = inOffer
              ? { id: inboundFareId, priceVnd: inOffer.minPrice }
              : null;

            const holdMs = 10 * 60 * 1000;
            const now = Date.now();
            const totalAmountVnd =
              (mockFare.priceVnd + (inFare?.priceVnd ?? 0)) *
              Math.max(1, params.adults + params.children + params.infants);

            const session: Record<string, unknown> = {
              v: 1,
              createdAtMs: now,
              holdExpiresAtMs: now + holdMs,
              params,
              paxTotal,
              totalAmountVnd,
              outbound: {
                fromIata: params.fromIata,
                toIata: params.toIata,
                departDateIso: params.departDate,
                offer: outOffer,
                fare: mockFare,
              },
              inbound:
                isRoundTrip && params.returnDate && inOffer && inFare
                  ? {
                      fromIata: params.toIata,
                      toIata: params.fromIata,
                      departDateIso: params.returnDate,
                      offer: inOffer,
                      fare: inFare,
                    }
                  : undefined,
            };

            saveFlightCheckoutSession(
              session as unknown as import("../types/flightCheckout").FlightCheckoutSession,
            );
            setFareModalOpen(false);
            navigate("/flights/checkout");
          }}
        />
      )}
    </div>
  );

  function toggleSection(key: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="fr-filter-section">
      <button
        type="button"
        className="fr-filter-section__head"
        onClick={onToggle}
      >
        <Settings2 size={14} aria-hidden className="fr-filter-section__icon" />
        <span>{title}</span>
        {open ? (
          <ChevronUp size={16} aria-hidden />
        ) : (
          <ChevronDown size={16} aria-hidden />
        )}
      </button>
      {open ? <div className="fr-filter-section__body">{children}</div> : null}
    </section>
  );
}
