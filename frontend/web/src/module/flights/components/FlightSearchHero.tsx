import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftRight,
  Baby,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import { BRAND_LOGO_SRC } from "@/constants/brandAssets";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";

const FLIGHT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1920";

import {
  buildFlightSearchQuery,
  extractIataFromLabel,
  type FlightSearchParams,
} from "../utils/flightSearchParams";
import { FlightAirportAutocomplete } from "./FlightAirportAutocomplete";
import { FlightDatePicker } from "./FlightDatePicker";
import "./FlightSearchHero.css";

type TripType = "round-trip" | "one-way";

type PassengerCounts = {
  adults: number;
  children: number;
  infants: number;
};

function defaultDepartIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

function defaultReturnIso(departIso: string): string {
  const d = new Date(`${departIso}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function FlightSearchHero() {
  const { t } = useTranslation("translation", { keyPrefix: "flightsPage" });
  const navigate = useNavigate();
  const passengerRef = useRef<HTMLDivElement>(null);

  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState(defaultDepartIso);
  const [returnDate, setReturnDate] = useState(() =>
    defaultReturnIso(defaultDepartIso()),
  );
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 2,
    children: 0,
    infants: 0,
  });
  const [passengerOpen, setPassengerOpen] = useState(false);

  useEffect(() => {
    if (tripType === "one-way") return;
    if (returnDate < departDate) {
      setReturnDate(defaultReturnIso(departDate));
    }
  }, [departDate, returnDate, tripType]);

  useEffect(() => {
    if (!passengerOpen) return undefined;
    const onPointerDown = (e: MouseEvent) => {
      if (!passengerRef.current?.contains(e.target as Node)) {
        setPassengerOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [passengerOpen]);

  const bumpPassenger = (key: keyof PassengerCounts, delta: number) => {
    setPassengers((prev) => {
      const next = Math.max(0, prev[key] + delta);
      if (key === "adults") return { ...prev, adults: Math.max(1, next) };
      if (key === "infants" && next > prev.adults) return prev;
      return { ...prev, [key]: next };
    });
  };

  const swapRoute = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: FlightSearchParams = {
      fromIata: extractIataFromLabel(from, "SGN"),
      toIata: extractIataFromLabel(to, "HAN"),
      departDate,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      tripType,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
    };
    navigate(`/flights/search?${buildFlightSearchQuery(payload)}`);
  };

  const passengerRows = [
    {
      key: "adults" as const,
      label: t("search.adults"),
      hint: t("search.adultsHint"),
      value: passengers.adults,
      min: 1,
      icon: Users,
    },
    {
      key: "children" as const,
      label: t("search.children"),
      hint: t("search.childrenHint"),
      value: passengers.children,
      min: 0,
      icon: User,
    },
    {
      key: "infants" as const,
      label: t("search.infants"),
      hint: t("search.infantsHint"),
      value: passengers.infants,
      min: 0,
      icon: Baby,
    },
  ];

  return (
    <section className="flight-hero" aria-label={t("hero.sectionAria")}>
      <div className="flight-hero__media" aria-hidden>
        <OptimizedImage
          src={FLIGHT_HERO_IMAGE}
          alt=""
          priority
          width={1920}
          height={1080}
          cloudinaryWidth={1920}
          className="flight-hero__bg"
        />
        <div className="flight-hero__shade" />
      </div>

      <div className="flight-hero__top">
        <a href="/" className="flight-hero__brand" aria-label="Travel Viet">
          <img
            src={BRAND_LOGO_SRC}
            alt=""
            width={120}
            height={40}
            className="flight-hero__logo"
          />
          <span className="flight-hero__tagline">{t("hero.brandTagline")}</span>
        </a>
      </div>

      <div className="flight-hero__content">
        <h1 className="flight-hero__title">{t("hero.title")}</h1>

        <form className="flight-search-card" onSubmit={handleSearch}>
          <div className="flight-search-card__top">
            <div
              className="flight-search-card__trip"
              role="radiogroup"
              aria-label={t("search.tripAria")}
            >
              <label className="flight-radio">
                <input
                  type="radio"
                  name="tripType"
                  checked={tripType === "round-trip"}
                  onChange={() => setTripType("round-trip")}
                />
                <span className="flight-radio__dot" aria-hidden />
                <span>{t("search.tripRoundTrip")}</span>
              </label>
              <label className="flight-radio">
                <input
                  type="radio"
                  name="tripType"
                  checked={tripType === "one-way"}
                  onChange={() => setTripType("one-way")}
                />
                <span className="flight-radio__dot" aria-hidden />
                <span>{t("search.tripOneWay")}</span>
              </label>
            </div>

            <div className="flight-passengers" ref={passengerRef}>
              <span className="flight-passengers__label">
                {t("search.passengersLabel")}
              </span>
              <button
                type="button"
                className="flight-passengers__trigger"
                aria-expanded={passengerOpen}
                aria-haspopup="dialog"
                onClick={() => setPassengerOpen((o) => !o)}
              >
                <span className="flight-passengers__counts" aria-hidden>
                  <Users
                    size={15}
                    strokeWidth={2.2}
                    className="flight-passengers__icon-adult"
                  />
                  <span className="flight-passengers__count flight-passengers__count--primary">
                    {passengers.adults}
                  </span>
                  <User
                    size={14}
                    strokeWidth={2.2}
                    className="flight-passengers__icon-muted"
                  />
                  <span className="flight-passengers__count">
                    {passengers.children}
                  </span>
                  <Baby
                    size={14}
                    strokeWidth={2.2}
                    className="flight-passengers__icon-muted"
                  />
                  <span className="flight-passengers__count">
                    {passengers.infants}
                  </span>
                </span>
                {passengerOpen ? (
                  <ChevronUp
                    size={16}
                    aria-hidden
                    className="flight-passengers__chevron"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    aria-hidden
                    className="flight-passengers__chevron"
                  />
                )}
              </button>

              {passengerOpen ? (
                <div
                  className="flight-passengers__panel"
                  role="dialog"
                  aria-label={t("search.passengerPanelAria")}
                >
                  {passengerRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <div key={row.key} className="flight-passengers__row">
                        <div className="flight-passengers__row-text">
                          <Icon size={18} strokeWidth={2} aria-hidden />
                          <div>
                            <p className="flight-passengers__row-label">
                              {row.label}
                            </p>
                            <p className="flight-passengers__row-hint">
                              {row.hint}
                            </p>
                          </div>
                        </div>
                        <div className="flight-passengers__stepper">
                          <button
                            type="button"
                            className="flight-passengers__step"
                            disabled={row.value <= row.min}
                            aria-label={`-${row.label}`}
                            onClick={() => bumpPassenger(row.key, -1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="flight-passengers__num">
                            {row.value}
                          </span>
                          <button
                            type="button"
                            className="flight-passengers__step"
                            aria-label={`+${row.label}`}
                            onClick={() => bumpPassenger(row.key, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flight-search-card__main">
            <div className="flight-search-route-pill">
              <div className="flight-search-route-pill__side">
                <FlightAirportAutocomplete
                  label={t("search.fromLabel")}
                  placeholder={t("search.fromPlaceholder")}
                  value={from}
                  onChange={(v) => setFrom(v)}
                  clearAria={t("search.clearField")}
                  listAria={t("search.airportListAria")}
                  excludeValue={to}
                />
              </div>
              <div className="flight-search-route-pill__swap">
                <button
                  type="button"
                  className="flight-swap-btn"
                  aria-label={t("search.swapRoute")}
                  onClick={swapRoute}
                >
                  <ArrowLeftRight size={14} strokeWidth={2.4} aria-hidden />
                </button>
              </div>
              <div className="flight-search-route-pill__side">
                <FlightAirportAutocomplete
                  label={t("search.toLabel")}
                  placeholder={t("search.toPlaceholder")}
                  value={to}
                  onChange={(v) => setTo(v)}
                  clearAria={t("search.clearField")}
                  listAria={t("search.airportListAria")}
                  excludeValue={from}
                />
              </div>
            </div>

            <FlightDatePicker
              tripType={tripType}
              departDate={departDate}
              returnDate={returnDate}
              onDepartChange={setDepartDate}
              onReturnChange={setReturnDate}
            />

            <button type="submit" className="flight-search-submit">
              <Search size={18} strokeWidth={2.5} aria-hidden />
              {t("search.searchButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
