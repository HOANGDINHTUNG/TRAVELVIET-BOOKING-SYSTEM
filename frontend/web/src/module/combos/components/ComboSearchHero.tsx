import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftRight,
  Baby,
  BedDouble,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
import { BRAND_LOGO_SRC } from "@/constants/brandAssets";
import {
  buildComboSearchQuery,
  parseComboSearchParams,
} from "../utils/comboSearchParams";
import { FlightAirportAutocomplete } from "@/module/flights/components/FlightAirportAutocomplete";
import { FlightDatePicker } from "@/module/flights/components/FlightDatePicker";
import { HotelDestinationField } from "@/module/hotels/components/HotelDestinationField";
import { HotelStayDatePicker } from "@/module/hotels/components/HotelStayDatePicker";
export type ComboType = "flight-hotel" | "car-hotel";
const COMBO_HERO_IMAGE =
  "https://images.unsplash.com/photo-1571895249887-ef9e10e86593?auto=format&fit=crop&w=1920&q=85";
import "@/module/flights/components/FlightSearchHero.css";
import "@/module/hotels/components/HotelSearchHero.css";
import "./ComboSearchHero.css";

type OccupancyCounts = {
  rooms: number;
  adults: number;
  children: number;
  infants: number;
};

function defaultDepartIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

function defaultReturnIso(departIso: string): string {
  const d = new Date(`${departIso}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function ComboSearchHero() {
  const { t } = useTranslation("translation", { keyPrefix: "combosPage" });
  const { t: tFlights } = useTranslation("translation", {
    keyPrefix: "flightsPage",
  });
  const { t: tHotels } = useTranslation("translation", {
    keyPrefix: "hotelsPage",
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const occupancyRef = useRef<HTMLDivElement>(null);

  const initial = useMemo(
    () => parseComboSearchParams(searchParams),
    [searchParams],
  );

  const comboTabs = useMemo(
    () =>
      t("hero.comboTabs", { returnObjects: true }) as Array<{
        id: ComboType;
        label: string;
      }>,
    [t],
  );

  const [comboType, setComboType] = useState<ComboType>(initial.type);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [departDate, setDepartDate] = useState(initial.departDate);
  const [returnDate, setReturnDate] = useState(initial.returnDate);
  const [destination, setDestination] = useState(initial.destination);
  const [checkIn, setCheckIn] = useState(initial.checkIn);
  const [checkOut, setCheckOut] = useState(initial.checkOut);
  const [occupancy, setOccupancy] = useState<OccupancyCounts>({
    rooms: initial.rooms,
    adults: initial.adults,
    children: initial.children,
    infants: initial.infants,
  });

  useEffect(() => {
    setComboType(initial.type);
    setFrom(initial.from);
    setTo(initial.to);
    setDepartDate(initial.departDate);
    setReturnDate(initial.returnDate);
    setDestination(initial.destination);
    setCheckIn(initial.checkIn);
    setCheckOut(initial.checkOut);
    setOccupancy({
      rooms: initial.rooms,
      adults: initial.adults,
      children: initial.children,
      infants: initial.infants,
    });
  }, [initial]);
  const [occupancyOpen, setOccupancyOpen] = useState(false);

  useEffect(() => {
    if (returnDate < departDate) {
      setReturnDate(defaultReturnIso(departDate));
    }
    setCheckIn(departDate);
  }, [departDate, returnDate]);

  useEffect(() => {
    if (checkOut <= checkIn) {
      setCheckOut(defaultReturnIso(checkIn));
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (!occupancyOpen) return undefined;
    const onPointerDown = (e: MouseEvent) => {
      if (!occupancyRef.current?.contains(e.target as Node))
        setOccupancyOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [occupancyOpen]);

  const bump = (key: keyof OccupancyCounts, delta: number) => {
    setOccupancy((prev) => {
      const next = Math.max(0, prev[key] + delta);
      if (key === "rooms") return { ...prev, rooms: Math.max(1, next) };
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
    const query = buildComboSearchQuery({
      type: comboType,
      from: from.trim(),
      to: to.trim(),
      departDate,
      returnDate,
      destination: destination.trim() || "Nha Trang",
      checkIn,
      checkOut,
      rooms: occupancy.rooms,
      adults: occupancy.adults,
      children: occupancy.children,
      infants: occupancy.infants,
    });
    navigate(`/combos/search?${query}`);
  };

  const occupancyRows = [
    {
      key: "rooms" as const,
      label: tHotels("search.rooms"),
      hint: tHotels("search.roomsHint"),
      value: occupancy.rooms,
      min: 1,
    },
    {
      key: "adults" as const,
      label: tHotels("search.adults"),
      hint: tHotels("search.adultsHint"),
      value: occupancy.adults,
      min: 1,
    },
    {
      key: "children" as const,
      label: tHotels("search.children"),
      hint: tHotels("search.childrenHint"),
      value: occupancy.children,
      min: 0,
    },
    {
      key: "infants" as const,
      label: tFlights("search.infants"),
      hint: tFlights("search.infantsHint"),
      value: occupancy.infants,
      min: 0,
    },
  ];

  const heroTitle =
    comboTabs.find((tab) => tab.id === comboType)?.label ?? t("hero.title");

  return (
    <section className="combo-hero" aria-label={t("hero.sectionAria")}>
      <div className="combo-hero__media" aria-hidden>
        <OptimizedImage
          src={COMBO_HERO_IMAGE}
          alt=""
          priority
          width={1920}
          height={1080}
          cloudinaryWidth={1920}
          className="combo-hero__bg"
        />
        <div className="combo-hero__shade" />
      </div>

      <div className="combo-hero__top">
        <a href="/" className="combo-hero__brand" aria-label="Travel Viet">
          <img
            src={BRAND_LOGO_SRC}
            alt=""
            width={120}
            height={40}
            className="combo-hero__logo"
          />
          <span className="combo-hero__tagline">
            {tHotels("hero.brandTagline")}
          </span>
        </a>
      </div>

      <div className="combo-hero__content">
        <h1 className="combo-hero__title">{heroTitle}</h1>

        <form className="combo-search-card" onSubmit={handleSearch}>
          <div
            className="combo-search-card__tabs"
            role="tablist"
            aria-label={t("hero.sectionAria")}
          >
            {comboTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={comboType === tab.id}
                className={`combo-search-card__tab${comboType === tab.id ? " is-active" : ""}`}
                onClick={() => setComboType(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="combo-search-card__occupancy" ref={occupancyRef}>
            <button
              type="button"
              className="combo-search-card__occupancy-trigger"
              aria-expanded={occupancyOpen}
              aria-haspopup="dialog"
              onClick={() => setOccupancyOpen((open) => !open)}
            >
              <span className="combo-search-card__occupancy-label">
                {t("search.roomsGuestsLabel")}
              </span>
              <span className="combo-search-card__occupancy-counts" aria-hidden>
                <BedDouble size={16} strokeWidth={2.2} />
                <span>{occupancy.rooms}</span>
                <Users size={15} strokeWidth={2.2} />
                <span>{occupancy.adults}</span>
                <User size={14} strokeWidth={2.2} />
                <span>{occupancy.children}</span>
                <Baby size={14} strokeWidth={2.2} />
                <span>{occupancy.infants}</span>
              </span>
              {occupancyOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {occupancyOpen ? (
              <div className="combo-search-card__occupancy-panel" role="dialog">
                {occupancyRows.map((row) => (
                  <div
                    key={row.key}
                    className="combo-search-card__occupancy-row"
                  >
                    <div>
                      <p className="combo-search-card__occupancy-row-label">
                        {row.label}
                      </p>
                      <p className="combo-search-card__occupancy-row-hint">
                        {row.hint}
                      </p>
                    </div>
                    <div className="combo-search-card__occupancy-stepper">
                      <button
                        type="button"
                        disabled={row.value <= row.min}
                        aria-label={`-${row.label}`}
                        onClick={() => bump(row.key, -1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{row.value}</span>
                      <button
                        type="button"
                        aria-label={`+${row.label}`}
                        onClick={() => bump(row.key, 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {comboType === "flight-hotel" ? (
            <div className="combo-search-card__flight-row">
              <FlightAirportAutocomplete
                label={t("search.fromLabel")}
                placeholder={tFlights("search.fromPlaceholder")}
                value={from}
                onChange={setFrom}
                clearAria={tFlights("search.clearField")}
                listAria={tFlights("search.airportListAria")}
                excludeValue={to}
              />
              <button
                type="button"
                className="combo-search-card__swap"
                aria-label={t("search.swapAria")}
                onClick={swapRoute}
              >
                <ArrowLeftRight size={18} />
              </button>
              <FlightAirportAutocomplete
                label={t("search.toLabel")}
                placeholder={tFlights("search.toPlaceholder")}
                value={to}
                onChange={setTo}
                clearAria={tFlights("search.clearField")}
                listAria={tFlights("search.airportListAria")}
                excludeValue={from}
              />
              <FlightDatePicker
                tripType="round-trip"
                departDate={departDate}
                returnDate={returnDate}
                onDepartChange={setDepartDate}
                onReturnChange={setReturnDate}
              />
            </div>
          ) : null}

          <div className="combo-search-card__hotel-row">
            <HotelDestinationField
              value={destination}
              onChange={setDestination}
            />
            <HotelStayDatePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
            />
            <button type="submit" className="combo-search-card__submit">
              <Search size={18} strokeWidth={2.5} aria-hidden />
              {t("search.searchButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
