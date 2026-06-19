import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { TourCard } from "@/components/ui/TourCard/TourCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { SmoothCarouselTrack } from "@/components/ui/SmoothCarousel/SmoothCarouselTrack";
import { useSmoothInfiniteCarousel } from "@/components/ui/SmoothCarousel/useSmoothInfiniteCarousel";

import { useRelatedTours } from "../../hooks/useRelatedTours";
import type { TourResponse } from "../../types/publicTour";
import { mapTourToHomeStyleCardProps } from "../../utils/relatedTourCard";
import { formatCatalogDepartureDate } from "../../utils/tourListingDisplay";
import { displaySeatsLeft } from "../../../home/components/LastMinuteDeals/lastMinuteDealsUtils";

import "../../../home/components/HomeTourRows/HomeTourRows.css";
import "./RelatedToursSection.css";

const VISIBLE_SLOTS = 4;

type RelatedToursSectionProps = {
  tour: TourResponse;
};

function RelatedTourCardSkeleton() {
  return (
    <GlassCard
      as="div"
      variant="flat"
      className="home-tour-card home-tour-card-skeleton"
    />
  );
}

export function RelatedToursSection({ tour }: RelatedToursSectionProps) {
  const { t } = useTranslation("tours");
  const { relatedTours, isLoading, isError } = useRelatedTours(tour);

  const list = relatedTours;
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

  if (!isLoading && (isError || relatedTours.length === 0)) {
    return null;
  }

  const sectionTitle = String(t("detail.relatedTitle"));

  return (
    <section
      className="related-tours-section"
      aria-labelledby="related-tours-heading"
      aria-busy={isLoading}
    >
      <div className="related-tours-head home-tour-row-head">
        <div className="related-tours-head-text">
          <h2 id="related-tours-heading" className="home-tour-row-title">
            {sectionTitle}
          </h2>
          <p className="related-tours-lead">
            {String(t("detail.relatedLead"))}
          </p>
        </div>
        {!isLoading && carousel.canNavigate ? (
          <div className="home-tour-row-head-actions">
            <div className="home-tour-row-nav">
              <button
                type="button"
                aria-label={String(t("detail.relatedPrev"))}
                onClick={carousel.goPrev}
                className="home-tour-row-arrow"
              >
                <ChevronLeft size={22} aria-hidden />
              </button>
              <button
                type="button"
                aria-label={String(t("detail.relatedNext"))}
                onClick={carousel.goNext}
                className="home-tour-row-arrow"
              >
                <ChevronRight size={22} aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={sectionTitle}
        className="home-tour-row-viewport-wrap related-tours-viewport-wrap"
      >
        {isLoading && n === 0 ? (
          <div
            className="home-tour-row-track home-tour-row-track--skeleton"
            aria-hidden
          >
            {Array.from({ length: VISIBLE_SLOTS }).map((_, index) => (
              <div key={`related-skel-${index}`} data-carousel-slide>
                <RelatedTourCardSkeleton />
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
            {trackTours.map((item, index) => {
              const card = mapTourToHomeStyleCardProps(item, t);
              return (
                <div
                  key={`${item.id}-${index}`}
                  data-carousel-slide
                  className="home-tour-row-slide"
                >
                  <TourCard
                    {...card}
                    nextDepartureDate={formatCatalogDepartureDate(item as any)}
                    availableSeats={displaySeatsLeft(item as any)}
                    className="home-tour-card"
                  />
                </div>
              );
            })}
          </SmoothCarouselTrack>
        )}
      </div>
    </section>
  );
}
