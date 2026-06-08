import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  fetchPublicFlights,
  type FlightResponse,
} from "@/api/server/Flight.api";

import "./FlightHotDealsSection.css";

function FlightDealCardSkeleton() {
  return (
    <div
      className="fh-card fh-card--skeleton"
      style={{
        background: "#ffffff",
        border: "1px solid #f3f4f6",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      aria-hidden
    >
      <div
        className="fh-card__top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0.5,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}
        >
          <div
            style={{
              height: 20,
              width: "60%",
              background: "#e5e7eb",
              borderRadius: 4,
            }}
          ></div>
          <div
            style={{
              height: 14,
              width: "90%",
              background: "#e5e7eb",
              borderRadius: 4,
            }}
          ></div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              height: 32,
              width: 32,
              background: "#e5e7eb",
              borderRadius: "50%",
            }}
          ></div>
          <div
            style={{
              height: 12,
              width: 60,
              background: "#e5e7eb",
              borderRadius: 4,
            }}
          ></div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              height: 20,
              width: "60%",
              background: "#e5e7eb",
              borderRadius: 4,
            }}
          ></div>
          <div
            style={{
              height: 14,
              width: "90%",
              background: "#e5e7eb",
              borderRadius: 4,
            }}
          ></div>
        </div>
      </div>
      <div
        className="fh-card__bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0.5,
          borderTop: "1px solid #f3f4f6",
          paddingTop: 12,
        }}
      >
        <div
          style={{
            height: 20,
            width: 100,
            background: "#e5e7eb",
            borderRadius: 4,
          }}
        ></div>
        <div
          style={{
            height: 32,
            width: 80,
            background: "#e5e7eb",
            borderRadius: 6,
          }}
        ></div>
      </div>
    </div>
  );
}

function FlightDealCard({ flight }: { flight: FlightResponse }) {
  const { t } = useTranslation("translation", { keyPrefix: "flightsPage" });

  // Format date
  const dateStr = flight.departureTimeLocal
    ? new Date(flight.departureTimeLocal).toLocaleDateString("vi-VN")
    : "15/06/2026";

  return (
    <div className="fh-card">
      <div className="fh-card__top">
        <div className="fh-card__location">
          <span className="fh-card__location-code">
            {flight.originAirportCode}
          </span>
          <span className="fh-card__location-name">
            {flight.originAirportName}
          </span>
        </div>

        <div className="fh-card__middle">
          {/* Logo mock - replace with actual mapped logos if possible */}
          <img
            src={`https://ui-avatars.com/api/?name=${flight.airlineCode}&background=random&color=fff&rounded=true&font-size=0.4`}
            alt={flight.airlineName}
            className="fh-card__logo"
          />
          <span className="fh-card__date">{dateStr}</span>
        </div>

        <div className="fh-card__location" style={{ textAlign: "right" }}>
          <span className="fh-card__location-code">
            {flight.destinationAirportCode}
          </span>
          <span className="fh-card__location-name">
            {flight.destinationAirportName}
          </span>
        </div>
      </div>

      <div className="fh-card__bottom">
        <div className="fh-card__price">
          {t("dealSections.priceFrom")}{" "}
          <span className="fh-card__price-val">
            {new Intl.NumberFormat("vi-VN").format(flight.minPrice)}₫
          </span>
        </div>

        <button
          className="fh-card__cta"
          onClick={() => toast.info(t("dealSections.viewToast"))}
        >
          {t("dealSections.viewNow")}
        </button>
      </div>
    </div>
  );
}

function FlightCarouselSection({
  title,
  filters,
  flights,
  loading,
}: {
  title: string;
  filters: string[];
  flights: FlightResponse[];
  loading: boolean;
}) {
  const { t } = useTranslation("translation", { keyPrefix: "flightsPage" });
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 350;
      carouselRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const displayFlights = useMemo(() => {
    return flights
      .filter(
        (f) =>
          (f.destinationAirportName &&
            f.destinationAirportName.includes(activeFilter)) ||
          activeFilter === "Tất cả" ||
          true,
      )
      .slice(0, 30); // show a large chunk!
  }, [flights, activeFilter]);

  if (!loading && flights.length === 0) return null;

  return (
    <div className="flight-hot-deals__section">
      <div className="flight-hot-deals__header">
        <h2 className="flight-hot-deals__title">{title}</h2>
        <span className="flight-hot-deals__badge">
          {t("dealSections.oneWayBadge")}
        </span>
      </div>

      <div className="flight-hot-deals__tabs">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`flight-hot-deals__tab ${activeFilter === filter ? "is-active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flight-hot-deals__carousel-wrap">
        <button
          type="button"
          className="flight-hot-deals__btn flight-hot-deals__btn--prev"
          onClick={() => scrollCarousel("left")}
        >
          ←
        </button>

        <div className="flight-hot-deals__grid" ref={carouselRef}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <FlightDealCardSkeleton key={i} />
              ))
            : displayFlights.map((f) => (
                <FlightDealCard key={f.id} flight={f} />
              ))}
        </div>

        <button
          type="button"
          className="flight-hot-deals__btn flight-hot-deals__btn--next"
          onClick={() => scrollCarousel("right")}
        >
          →
        </button>
      </div>
    </div>
  );
}

export function FlightHotDealsSection() {
  const { t } = useTranslation("translation", { keyPrefix: "flightsPage" });
  const [flights, setFlights] = useState<FlightResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublicFlights({ size: 100 })
      .then((res) => {
        if (active) {
          setFlights(res);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const domesticFilters = [
    "Đà Nẵng",
    "Đà Lạt",
    "Hà Nội",
    "TP HCM",
    "Cần Thơ",
    "Nha Trang",
    "Phú Quốc",
  ];
  const intlFilters = [
    "Bangkok",
    "Hayden",
    "Washington",
    "Seoul",
    "Thượng Hải",
    "Singapore",
    "Đài Bắc",
  ];

  // Mock split
  const domesticFlights = flights.slice(0, Math.ceil(flights.length / 2));
  const intlFlights = flights.slice(Math.ceil(flights.length / 2));

  return (
    <section className="flight-hot-deals">
      <div className="flight-hot-deals__inner">
        <FlightCarouselSection
          title={t("dealSections.domesticTitle")}
          filters={domesticFilters}
          flights={domesticFlights}
          loading={loading}
        />
        <FlightCarouselSection
          title={t("dealSections.internationalTitle")}
          filters={intlFilters}
          flights={intlFlights}
          loading={loading}
        />
      </div>
    </section>
  );
}
