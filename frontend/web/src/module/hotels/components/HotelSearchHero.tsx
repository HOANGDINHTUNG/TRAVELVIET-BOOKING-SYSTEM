import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Baby,
  BedDouble,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
import { BRAND_LOGO_SRC } from "@/constants/brandAssets";
import {
  buildHotelSearchQuery,
  parseHotelSearchParams,
} from "../utils/hotelSearchParams";
const HOTEL_HERO_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85";
import { HotelDestinationField } from "./HotelDestinationField";
import { HotelStayDatePicker } from "./HotelStayDatePicker";
import "./HotelSearchHero.css";

type RoomGuestCounts = {
  rooms: number;
  adults: number;
  children: number;
};

function defaultCheckOutIso(checkInIso: string): string {
  const d = new Date(`${checkInIso}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function HotelSearchHero() {
  const { t } = useTranslation("translation", { keyPrefix: "hotelsPage" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomsRef = useRef<HTMLDivElement>(null);

  const initial = useMemo(
    () => parseHotelSearchParams(searchParams),
    [searchParams],
  );

  const [destination, setDestination] = useState(initial.destination);
  const [checkIn, setCheckIn] = useState(initial.checkIn);
  const [checkOut, setCheckOut] = useState(initial.checkOut);
  const [guests, setGuests] = useState<RoomGuestCounts>({
    rooms: initial.rooms,
    adults: initial.adults,
    children: initial.children,
  });
  const [roomsOpen, setRoomsOpen] = useState(false);

  useEffect(() => {
    setDestination(initial.destination);
    setCheckIn(initial.checkIn);
    setCheckOut(initial.checkOut);
    setGuests({
      rooms: initial.rooms,
      adults: initial.adults,
      children: initial.children,
    });
  }, [initial]);

  useEffect(() => {
    if (checkOut <= checkIn) {
      setCheckOut(defaultCheckOutIso(checkIn));
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (!roomsOpen) return undefined;
    const onPointerDown = (e: MouseEvent) => {
      if (!roomsRef.current?.contains(e.target as Node)) setRoomsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [roomsOpen]);

  const bump = (key: keyof RoomGuestCounts, delta: number) => {
    setGuests((prev) => {
      const next = Math.max(0, prev[key] + delta);
      if (key === "rooms") return { ...prev, rooms: Math.max(1, next) };
      if (key === "adults") return { ...prev, adults: Math.max(1, next) };
      return { ...prev, children: next };
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = buildHotelSearchQuery({
      destination: destination.trim() || "Hà Nội",
      checkIn,
      checkOut,
      rooms: guests.rooms,
      adults: guests.adults,
      children: guests.children,
    });
    navigate(`/hotels/search?${query}`);
  };

  const guestRows = [
    {
      key: "rooms" as const,
      label: t("search.rooms"),
      hint: t("search.roomsHint"),
      value: guests.rooms,
      min: 1,
    },
    {
      key: "adults" as const,
      label: t("search.adults"),
      hint: t("search.adultsHint"),
      value: guests.adults,
      min: 1,
    },
    {
      key: "children" as const,
      label: t("search.children"),
      hint: t("search.childrenHint"),
      value: guests.children,
      min: 0,
    },
  ];

  return (
    <section className="hotel-hero" aria-label={t("hero.sectionAria")}>
      <div className="hotel-hero__media" aria-hidden>
        <OptimizedImage
          src={HOTEL_HERO_IMAGE}
          alt=""
          priority
          width={1920}
          height={1080}
          cloudinaryWidth={1920}
          className="hotel-hero__bg"
        />
        <div className="hotel-hero__shade" />
      </div>

      <div className="hotel-hero__top">
        <a href="/" className="hotel-hero__brand" aria-label="Travel Viet">
          <img
            src={BRAND_LOGO_SRC}
            alt=""
            width={120}
            height={40}
            className="hotel-hero__logo"
          />
          <span className="hotel-hero__tagline">{t("hero.brandTagline")}</span>
        </a>
      </div>

      <div className="hotel-hero__content">
        <h1 className="hotel-hero__title">{t("search.cardTitle")}</h1>

        <form className="hotel-search-card" onSubmit={handleSearch}>
          <div className="hotel-search-card__guests" ref={roomsRef}>
            <button
              type="button"
              className="hotel-search-card__guests-trigger"
              aria-expanded={roomsOpen}
              aria-haspopup="dialog"
              onClick={() => setRoomsOpen((o) => !o)}
            >
              <span className="hotel-search-card__guests-label">
                {t("search.roomsGuestsLabel")}
              </span>
              <span className="hotel-search-card__guests-counts" aria-hidden>
                <BedDouble
                  size={16}
                  strokeWidth={2.2}
                  className="hotel-search-card__guests-icon"
                />
                <span className="hotel-search-card__guests-num hotel-search-card__guests-num--primary">
                  {guests.rooms}
                </span>
                <Users
                  size={15}
                  strokeWidth={2.2}
                  className="hotel-search-card__guests-icon-muted"
                />
                <span className="hotel-search-card__guests-num">
                  {guests.adults}
                </span>
                <Baby
                  size={14}
                  strokeWidth={2.2}
                  className="hotel-search-card__guests-icon-muted"
                />
                <span className="hotel-search-card__guests-num">
                  {guests.children}
                </span>
              </span>
              {roomsOpen ? (
                <ChevronUp
                  size={16}
                  aria-hidden
                  className="hotel-search-card__guests-chevron"
                />
              ) : (
                <ChevronDown
                  size={16}
                  aria-hidden
                  className="hotel-search-card__guests-chevron"
                />
              )}
            </button>

            {roomsOpen ? (
              <div
                className="hotel-search-card__guests-panel"
                role="dialog"
                aria-label={t("search.roomsPanelAria")}
              >
                {guestRows.map((row) => (
                  <div key={row.key} className="hotel-search-card__guests-row">
                    <div className="hotel-search-card__guests-row-text">
                      <p className="hotel-search-card__guests-row-label">
                        {row.label}
                      </p>
                      <p className="hotel-search-card__guests-row-hint">
                        {row.hint}
                      </p>
                    </div>
                    <div className="hotel-search-card__guests-stepper">
                      <button
                        type="button"
                        className="hotel-search-card__guests-step"
                        disabled={row.value <= row.min}
                        aria-label={`-${row.label}`}
                        onClick={() => bump(row.key, -1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="hotel-search-card__guests-step-num">
                        {row.value}
                      </span>
                      <button
                        type="button"
                        className="hotel-search-card__guests-step"
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

          <div className="hotel-search-card__fields">
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

            <button type="submit" className="hotel-search-submit">
              <Search size={18} strokeWidth={2.5} aria-hidden />
              {t("search.searchButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
