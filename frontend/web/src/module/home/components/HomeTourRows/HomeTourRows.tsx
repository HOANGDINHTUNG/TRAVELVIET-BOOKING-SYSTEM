import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { catalogTourLinks } from "../../../../api/server/Tour.api";
import type { Tour } from "../../database/interface/publicTravel";
import "./HomeTourRows.css";

function formatVnd(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

function TourRowCarousel({
  title,
  tours,
  loading,
  emptyHint,
  viewMoreTo,
  viewMoreLabel,
  viewDetailLabel,
  ariaPrev,
  ariaNext,
  translateTourField,
}: {
  title: string;
  tours: Tour[];
  loading?: boolean;
  emptyHint: string;
  viewMoreTo: string;
  viewMoreLabel: string;
  viewDetailLabel: string;
  ariaPrev: string;
  ariaNext: string;
  translateTourField: (
    tour: Tour,
    field: "title" | "days" | "location",
    fallback: string,
  ) => string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollPage = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta =
      Math.min(el.clientWidth * 0.85, 420) * (dir === "next" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!loading && tours.length === 0) {
    return (
      <div className="home-tour-row">
        <div className="home-tour-row-head">
          <h2 className="home-tour-row-title">{title}</h2>
          <Link className="home-tour-row-more" to={viewMoreTo}>
            {viewMoreLabel}
          </Link>
        </div>
        <p className="home-tour-row-empty">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="home-tour-row">
      <div className="home-tour-row-head">
        <h2 className="home-tour-row-title">{title}</h2>
        <div className="home-tour-row-head-actions">
          <Link className="home-tour-row-more" to={viewMoreTo}>
            {viewMoreLabel}
          </Link>
          <div className="home-tour-row-nav">
            <button
              type="button"
              aria-label={ariaPrev}
              onClick={() => scrollPage("prev")}
              className="home-tour-row-arrow"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label={ariaNext}
              onClick={() => scrollPage("next")}
              className="home-tour-row-arrow"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
      <div ref={scrollerRef} className="home-tour-row-scroller">
        {tours.map((tour) => (
          <article key={tour.id} className="home-tour-card">
            <Link to={`/tours/${tour.id}`} className="home-tour-card-media">
              {tour.image ? (
                <img
                  src={tour.image}
                  alt={translateTourField(tour, "title", tour.title)}
                  loading="lazy"
                />
              ) : (
                <div className="home-tour-card-ph" aria-hidden />
              )}
            </Link>
            <div className="home-tour-card-body">
              <h3 className="home-tour-card-title">
                {translateTourField(tour, "title", tour.title)}
              </h3>
              <p className="home-tour-card-meta">
                {translateTourField(tour, "days", tour.days)}
              </p>
              <p className="home-tour-card-depart">
                {translateTourField(tour, "location", tour.location)}
              </p>
              <p className="home-tour-card-price">{formatVnd(tour.price)}</p>
              <Link to={`/tours/${tour.id}`} className="home-tour-card-more">
                {viewDetailLabel}
              </Link>
            </div>
          </article>
        ))}
        {loading &&
          tours.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`home-tour-skel-${title}-${i}`}
              className="home-tour-card home-tour-card-skeleton"
              aria-hidden
            />
          ))}
      </div>
    </div>
  );
}

type HomeTourRowsProps = {
  domesticTours: Tour[];
  internationalTours: Tour[];
  loading?: boolean;
};

export function HomeTourRows({
  domesticTours,
  internationalTours,
  loading = false,
}: HomeTourRowsProps) {
  const { t, i18n } = useTranslation();

  const translateTourField = useCallback(
    (tour: Tour, field: "title" | "days" | "location", fallback: string) => {
      if (!tour.translationKey) {
        return fallback;
      }
      const key = `data.tours.${tour.translationKey}.${field}`;
      return i18n.exists(key) ? t(key) : fallback;
    },
    [i18n, t],
  );

  return (
    <section
      className="home-tour-rows"
      aria-label={t("homeTourRows.sectionAria")}
    >
      <TourRowCarousel
        title={t("homeTourRows.domesticTitle")}
        tours={domesticTours}
        loading={loading}
        emptyHint={t("homeTourRows.emptyDomestic")}
        viewMoreTo={catalogTourLinks.domesticBeachFeatured}
        viewMoreLabel={t("homeTourRows.viewMore")}
        viewDetailLabel={t("homeTourRows.viewDetail")}
        ariaPrev={t("homeTourRows.prev")}
        ariaNext={t("homeTourRows.next")}
        translateTourField={translateTourField}
      />
      <TourRowCarousel
        title={t("homeTourRows.internationalTitle")}
        tours={internationalTours}
        loading={loading}
        emptyHint={t("homeTourRows.emptyInternational")}
        viewMoreTo={catalogTourLinks.internationalFeatured}
        viewMoreLabel={t("homeTourRows.viewMore")}
        viewDetailLabel={t("homeTourRows.viewDetail")}
        ariaPrev={t("homeTourRows.prev")}
        ariaNext={t("homeTourRows.next")}
        translateTourField={translateTourField}
      />
    </section>
  );
}
