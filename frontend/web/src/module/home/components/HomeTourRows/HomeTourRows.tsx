import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { catalogTourLinks } from "../../../../api/server/Tour.api";
import { GlassCard } from "../../../../components/ui/GlassCard";
import { TourCard } from "../../../../components/ui/TourCard/TourCard";
import type { Tour } from "../../database/interface/publicTravel";
import type { TourCardSavingTier } from "../../../../components/ui/TourCard/TourCard";
import {
  TourQuickViewDialog,
  type TourQuickViewPayload,
} from "../../../../components/ui/TourCard/TourQuickViewDialog";
import { SmoothCarouselTrack } from "../../../../components/ui/SmoothCarousel/SmoothCarouselTrack";
import { useSmoothInfiniteCarousel } from "../../../../components/ui/SmoothCarousel/useSmoothInfiniteCarousel";
import { tourDetailPath } from "../../../tours/utils/slug";
import { inclusionBadgeLabels } from "../../../tours/utils/tourInclusionBadges";
import { savingTierForHomeTour } from "../../../tours/utils/relatedTourCard";
import { formatCatalogDepartureDate } from "../../../tours/utils/tourListingDisplay";
import { displaySeatsLeft } from "../LastMinuteDeals/lastMinuteDealsUtils";
import "./HomeTourRows.css";

const MAX_TOURS = 8;
const VISIBLE_SLOTS = 4;
const HOME_ROW_TIERS: TourCardSavingTier[] = [
  "gia_tot",
  "tieu_chuan",
  "tiet_kiem",
];

function cornerLabelsForTour(tour: Tour): string[] {
  const labels: string[] = [...inclusionBadgeLabels(tour.inclusionFlags)];
  if (tour.category?.trim() && labels.length < 3)
    labels.push(tour.category.trim());
  const h = tour.highlights?.[0]?.trim();
  if (h && labels.length < 3)
    labels.push(h.length > 26 ? `${h.slice(0, 26)}…` : h);
  return labels.slice(0, 3);
}

function homeSavingTierForCard(tour: Tour): TourCardSavingTier {
  const fromData = savingTierForHomeTour(tour);
  if (
    fromData === "gia_tot" ||
    fromData === "tieu_chuan" ||
    fromData === "tiet_kiem"
  ) {
    return fromData;
  }
  const index = Math.abs(Number(tour.id ?? 0)) % HOME_ROW_TIERS.length;
  return HOME_ROW_TIERS[index];
}

function TourRowCarousel({
  title,
  tours,
  loading,
  emptyHint,
  viewMoreTo,
  viewMoreLabel,
  ariaPrev,
  ariaNext,
  translateTourField,
  onQuickViewTour,
}: {
  title: string;
  tours: Tour[];
  loading?: boolean;
  emptyHint: string;
  viewMoreTo: string;
  viewMoreLabel: string;
  ariaPrev: string;
  ariaNext: string;
  translateTourField: (
    tour: Tour,
    field: "title" | "days" | "location",
    fallback: string,
  ) => string;
  onQuickViewTour: (tour: Tour, savingTier?: TourCardSavingTier) => void;
}) {
  const list = useMemo(() => tours.slice(0, MAX_TOURS), [tours]);
  const n = list.length;

  const carousel = useSmoothInfiniteCarousel({
    itemCount: n,
    visibleCount: VISIBLE_SLOTS,
    loop: true,
  });

  const trackTours = useMemo(() => {
    if (n === 0) return [];
    const clones =
      carousel.cloneCount > 0 ? list.slice(0, carousel.cloneCount) : [];
    return [...list, ...clones];
  }, [carousel.cloneCount, list, n]);

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
          {carousel.canNavigate && (
            <div className="home-tour-row-nav">
              <button
                type="button"
                aria-label={ariaPrev}
                onClick={carousel.goPrev}
                className="home-tour-row-arrow"
              >
                <ChevronLeft size={22} aria-hidden />
              </button>
              <button
                type="button"
                aria-label={ariaNext}
                onClick={carousel.goNext}
                className="home-tour-row-arrow"
              >
                <ChevronRight size={22} aria-hidden />
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        className="home-tour-row-viewport-wrap"
      >
        {loading && list.length === 0 ? (
          <div
            className="home-tour-row-track home-tour-row-track--skeleton"
            aria-hidden
          >
            {Array.from({ length: VISIBLE_SLOTS }).map((_, i) => (
              <div key={`home-tour-skel-${title}-${i}`} data-carousel-slide>
                <GlassCard
                  as="div"
                  variant="flat"
                  className="home-tour-card home-tour-card-skeleton"
                />
              </div>
            ))}
          </div>
        ) : (
          <SmoothCarouselTrack
            viewportRef={carousel.viewportRef}
            offsetX={carousel.offsetX}
            durationSec={carousel.durationSec}
            onTransitionComplete={carousel.onTransitionComplete}
            className="home-tour-row-viewport"
            trackClassName="home-tour-row-track"
          >
            {trackTours.map((tour, index) => {
              const tier = homeSavingTierForCard(tour);
              return (
                <div
                  key={`${tour.id}-${index}`}
                  data-carousel-slide
                  className="home-tour-row-slide"
                >
                  <TourCard
                    title={translateTourField(tour, "title", tour.title)}
                    detailPath={tourDetailPath(tour.id, tour.title)}
                    imageUrl={tour.image}
                    location={translateTourField(
                      tour,
                      "location",
                      tour.location,
                    )}
                    duration={translateTourField(tour, "days", tour.days)}
                    price={tour.price}
                    savingTier={tier}
                    cornerLabels={cornerLabelsForTour(tour)}
                    brandLogoUrl={null}
                    nextDepartureDate={formatCatalogDepartureDate(tour)}
                    availableSeats={displaySeatsLeft(tour)}
                    className="home-tour-card"
                    onQuickView={() => onQuickViewTour(tour, tier)}
                  />
                </div>
              );
            })}
          </SmoothCarouselTrack>
        )}
      </div>
    </div>
  );
}

type HomeTourRowsProps = {
  dynamicRows: import("../store/homeSlice").DynamicTourRow[];
  loading?: boolean;
};

export function HomeTourRows({
  dynamicRows,
  loading = false,
}: HomeTourRowsProps) {
  const { t, i18n } = useTranslation();

  const [quickViewPayload, setQuickViewPayload] =
    useState<TourQuickViewPayload | null>(null);

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

  const buildQuickViewPayload = useCallback(
    (tour: Tour, savingTier?: TourCardSavingTier): TourQuickViewPayload => ({
      title: translateTourField(tour, "title", tour.title),
      imageUrl: tour.image,
      location: translateTourField(tour, "location", tour.location),
      duration: translateTourField(tour, "days", tour.days),
      price: tour.price,
      programCode: `TV-${String(tour.id).padStart(5, "0")}`,
      attractions:
        tour.highlights?.[0]?.trim() ||
        translateTourField(tour, "location", tour.location),
      cuisine:
        tour.highlights?.[1]?.trim() ||
        t("tourCard.quickViewModal.defaultCuisine"),
      detailPath: tourDetailPath(tour.id, tour.title),
      savingTier,
    }),
    [t, translateTourField],
  );

  const openQuickView = useCallback(
    (tour: Tour, savingTier?: TourCardSavingTier) => {
      setQuickViewPayload(buildQuickViewPayload(tour, savingTier));
    },
    [buildQuickViewPayload],
  );

  return (
    <section
      className="home-tour-rows"
      aria-label={t("homeTourRows.sectionAria")}
    >
      <div className="home-tour-rows-inner">
        {dynamicRows.map((row) => (
          <TourRowCarousel
            key={row.tagCode}
            title={row.title}
            tours={row.tours}
            loading={loading}
            emptyHint={t("homeTourRows.emptyDomestic")}
            viewMoreTo={`/catalog?tag=${row.tagCode}`}
            viewMoreLabel={t("homeTourRows.viewMore")}
            ariaPrev={t("homeTourRows.prev")}
            ariaNext={t("homeTourRows.next")}
            translateTourField={translateTourField}
            onQuickViewTour={openQuickView}
          />
        ))}
        {dynamicRows.length === 0 && loading && (
          <TourRowCarousel
            title=""
            tours={[]}
            loading={true}
            emptyHint={t("homeTourRows.emptyDomestic")}
            viewMoreTo={`/catalog`}
            viewMoreLabel={t("homeTourRows.viewMore")}
            ariaPrev={t("homeTourRows.prev")}
            ariaNext={t("homeTourRows.next")}
            translateTourField={translateTourField}
            onQuickViewTour={openQuickView}
          />
        )}
      </div>

      <TourQuickViewDialog
        open={quickViewPayload != null}
        onOpenChange={(open) => {
          if (!open) setQuickViewPayload(null);
        }}
        tour={quickViewPayload}
      />
    </section>
  );
}
