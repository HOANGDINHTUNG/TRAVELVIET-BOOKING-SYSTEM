import { CalendarDays, MapPin, Route, Tag } from "lucide-react";
import type { BackendTour } from "../../home/database/interface/publicTravel";
import type { TourDetailCopy } from "../utils/tourDetailCopy";
import type { TourDetailViewModel } from "../utils/tourDetailViewModel";

type TourDetailHeroProps = {
  tour: BackendTour;
  viewModel: TourDetailViewModel;
  copy: TourDetailCopy;
};

export function TourDetailHero({ tour, viewModel, copy }: TourDetailHeroProps) {
  return (
    <section className="tour-detail-hero">
      <div className="tour-detail-hero-media" aria-hidden="true">
        {viewModel.heroImage ? (
          <img src={viewModel.heroImage} alt="" />
        ) : (
          <span className="tour-media-placeholder" />
        )}
      </div>

      <div className="tour-detail-hero-overlay" />

      <div className="tour-detail-hero-content">
        <div className="tour-detail-hero-copy">
          <p className="tour-detail-kicker">{tour.tripMode || copy.heroKicker}</p>
          <h1>{tour.name}</h1>
          <p className="tour-detail-short">
            {tour.shortDescription || copy.defaultShort}
          </p>
        </div>

        <div className="tour-detail-hero-stats" aria-label={copy.factsTitle}>
          <div className="tour-stat-item">
            <MapPin size={20} />
            <span>{tour.transportType || copy.flexibleTransport}</span>
          </div>
          <div className="tour-stat-item">
            <CalendarDays size={20} />
            <span>{viewModel.duration}</span>
          </div>
          <div className="tour-stat-item">
            <Tag size={20} />
            <span>{viewModel.price}</span>
          </div>
          <div className="tour-stat-item">
            <Route size={20} />
            <span>{tour.tripMode || copy.routeStyle}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
