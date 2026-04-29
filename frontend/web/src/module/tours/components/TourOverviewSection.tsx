import { CheckCircle2 } from "lucide-react";
import type { BackendTour } from "../../home/database/interface/publicTravel";
import type { TourDetailCopy } from "../utils/tourDetailCopy";
import type { TourDetailViewModel } from "../utils/tourDetailViewModel";

type TourOverviewSectionProps = {
  tour: BackendTour;
  viewModel: TourDetailViewModel;
  copy: TourDetailCopy;
};

export function TourOverviewSection({
  tour,
  viewModel,
  copy,
}: TourOverviewSectionProps) {
  return (
    <section className="tour-section tour-overview-section">
      <div className="tour-section-heading">
        <p className="tour-section-kicker">{copy.overviewKicker}</p>
        <h2>{copy.overviewTitle}</h2>
      </div>

      <div className="tour-overview-layout">
        <div className="tour-main-content">
          {tour.description ? (
            <div
              className="tour-description"
              dangerouslySetInnerHTML={{ __html: tour.description }}
            />
          ) : (
            <p className="tour-description">{tour.shortDescription || copy.noDescription}</p>
          )}
        </div>

        <aside className="tour-highlights-panel">
          <h3>{copy.highlightsTitle}</h3>
          {viewModel.highlights.length > 0 ? (
            <ul className="tour-highlights-list">
              {viewModel.highlights.map((item) => (
                <li key={item} className="tour-highlight-item">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tour-muted-text">{copy.noHighlights}</p>
          )}
        </aside>
      </div>
    </section>
  );
}
