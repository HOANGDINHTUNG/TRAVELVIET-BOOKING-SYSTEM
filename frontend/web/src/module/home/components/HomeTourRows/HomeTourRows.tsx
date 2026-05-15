import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { catalogTourLinks } from "../../../../api/server/Tour.api";
import { GlassCard } from "../../../../components/ui/GlassCard";
import type { Tour } from "../../database/interface/publicTravel";
import "./HomeTourRows.css";

const MAX_TOURS = 8;
const VISIBLE_SLOTS = 4;

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
  const list = useMemo(() => tours.slice(0, MAX_TOURS), [tours]);
  const n = list.length;

  const [startIndex, setStartIndex] = useState(0);
  const [slideDir, setSlideDir] = useState<"next" | "prev">("next");

  const visibleTours = useMemo(() => {
    if (n === 0) {
      return [];
    }
    if (n === 1) {
      return list;
    }
    const k = Math.min(VISIBLE_SLOTS, n);
    return Array.from({ length: k }, (_, i) => list[(startIndex + i) % n]!);
  }, [list, n, startIndex]);

  const listSig = useMemo(() => list.map((t) => t.id).join("|"), [list]);

  useEffect(() => {
    setStartIndex(0);
    setSlideDir("next");
  }, [listSig]);

  const go = (dir: "prev" | "next") => {
    if (n <= 1) {
      return;
    }
    setSlideDir(dir === "next" ? "next" : "prev");
    setStartIndex((s) =>
      dir === "next" ? (s + 1) % n : (s - 1 + n) % n,
    );
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
              onClick={() => go("prev")}
              className="home-tour-row-arrow"
            >
              <ChevronLeft size={22} aria-hidden />
            </button>
            <button
              type="button"
              aria-label={ariaNext}
              onClick={() => go("next")}
              className="home-tour-row-arrow"
            >
              <ChevronRight size={22} aria-hidden />
            </button>
          </div>
        </div>
      </div>
      <div
        className="home-tour-row-viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
      >
        {loading && list.length === 0 ? (
          <div
            className="home-tour-row-page home-tour-row-page--skeleton"
            aria-hidden
          >
            {Array.from({ length: VISIBLE_SLOTS }).map((_, i) => (
              <GlassCard
                as="div"
                variant="flat"
                key={`home-tour-skel-${title}-${i}`}
                className="home-tour-card home-tour-card-skeleton"
              />
            ))}
          </div>
        ) : (
          <div
            className={`home-tour-row-page home-tour-row-page--rotate-${slideDir}`}
            key={startIndex}
            style={{
              gridTemplateColumns: `repeat(${visibleTours.length}, minmax(0, 1fr))`,
            }}
          >
            {visibleTours.map((tour) => (
              <GlassCard
                as="article"
                variant="glass"
                key={tour.id}
                className="home-tour-card"
              >
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

                  <div className="home-tour-card-info">
                    <p className="home-tour-card-line">
                      <Clock
                        className="home-tour-card-icon"
                        size={17}
                        strokeWidth={2.25}
                        aria-hidden
                      />
                      <span className="home-tour-card-line-text">
                        {translateTourField(tour, "days", tour.days)}
                      </span>
                    </p>
                    <div className="home-tour-card-info-bottom">
                      <p className="home-tour-card-line home-tour-card-line--location">
                        <MapPin
                          className="home-tour-card-icon"
                          size={17}
                          strokeWidth={2.25}
                          aria-hidden
                        />
                        <span className="home-tour-card-line-text">
                          {translateTourField(tour, "location", tour.location)}
                        </span>
                      </p>
                      <p className="home-tour-card-price">{formatVnd(tour.price)}</p>
                    </div>
                  </div>
                  <Link to={`/tours/${tour.id}`} className="home-tour-card-more">
                    {viewDetailLabel}
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
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
      <div className="home-tour-rows-inner">
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
      </div>
    </section>
  );
}
